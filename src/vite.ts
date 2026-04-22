import * as fs from 'node:fs';
import * as path from 'node:path';

export interface ReactPragmaticRouterPluginOptions {
	path: string;
	extensions?: string[];
}

export interface ReactPragmaticRouterPlugin {
	name: 'react-pragmatic-router';
	enforce: 'pre';
	configResolved: (config: { root: string }) => void;
	configureServer: (server: any) => void;
	resolveId: (id: string) => string | null;
	load: (id: string) => string | null;
}

type RouteEntry = { pattern: string; file: string; layouts: string[] };
type Collected = { pages: RouteEntry[]; modals: RouteEntry[] };

const VIRTUAL_ID = 'virtual:react-pragmatic-router/routes';
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_ID;
const MODAL_DIR = '@modal';

function transformSegment(name: string): string {
	return name
		.replace(/^\[\.\.\.(.+)\]$/, '*$1')
		.replace(/^\[(.+)\]$/, ':$1');
}

function isGroup(name: string): boolean {
	return /^\(.+\)$/.test(name);
}

function findLayout(
	dir: string,
	entries: fs.Dirent[],
	extensions: string[],
): string | null {
	for (const ext of extensions) {
		const name = `_layout${ext}`;
		if (entries.some(e => e.isFile() && e.name === name)) {
			return path.join(dir, name);
		}
	}
	return null;
}

function walk(
	dir: string,
	extensions: string[],
	prefix = '',
	layouts: string[] = [],
	inModal = false,
): Collected {
	const result: Collected = { pages: [], modals: [] };
	if (!fs.existsSync(dir)) return result;

	const entries = fs.readdirSync(dir, { withFileTypes: true });
	const layout = findLayout(dir, entries, extensions);
	const currentLayouts = layout ? [...layouts, layout] : layouts;

	for (const entry of entries) {
		const full = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			if (entry.name.startsWith('_')) continue;
			const isModalDir = entry.name === MODAL_DIR;
			const nextPrefix = (isGroup(entry.name) || isModalDir)
				? prefix
				: prefix + '/' + transformSegment(entry.name);
			const nextLayouts = isModalDir ? [] : currentLayouts;
			const sub = walk(full, extensions, nextPrefix, nextLayouts, inModal || isModalDir);
			result.pages.push(...sub.pages);
			result.modals.push(...sub.modals);
			continue;
		}

		const ext = path.extname(entry.name);
		if (!extensions.includes(ext)) continue;

		const base = entry.name.slice(0, -ext.length);
		if (base.startsWith('_')) continue;
		if (base.replace(/^\[\.\.\..+\]$/, '').includes('.')) continue;

		const segment = base === 'index' ? '' : '/' + transformSegment(base);
		const pattern = (prefix + segment) || '/';
		const entryObj: RouteEntry = { pattern, file: full, layouts: currentLayouts };
		if (inModal) result.modals.push(entryObj);
		else result.pages.push(entryObj);
	}

	return result;
}

function routeScore(pattern: string): [number, number, number] {
	const hasCatchAll = /\*/.test(pattern) ? 1 : 0;
	const dynamicCount = (pattern.match(/:/g) || []).length;
	const length = pattern.length;
	return [hasCatchAll, dynamicCount, -length];
}

function sortRoutes(routes: RouteEntry[]): RouteEntry[] {
	return routes.slice().sort((a, b) => {
		const [aCatch, aDyn, aLen] = routeScore(a.pattern);
		const [bCatch, bDyn, bLen] = routeScore(b.pattern);
		if (aCatch !== bCatch) return aCatch - bCatch;
		if (aDyn !== bDyn) return aDyn - bDyn;
		return aLen - bLen;
	});
}

function generateModule(pages: RouteEntry[], modals: RouteEntry[]): string {
	const layoutIds = new Map<string, number>();
	for (const r of [...pages, ...modals]) {
		for (const l of r.layouts) {
			if (!layoutIds.has(l)) layoutIds.set(l, layoutIds.size);
		}
	}

	const layoutImports = [...layoutIds.entries()]
		.map(([file, id]) => `const Layout${id} = lazy(() => import(${JSON.stringify(file)}));`)
		.join('\n');

	const pageImports = pages
		.map((r, i) => `const Page${i} = lazy(() => import(${JSON.stringify(r.file)}));`)
		.join('\n');

	const modalImports = modals
		.map((r, i) => `const Modal${i} = lazy(() => import(${JSON.stringify(r.file)}));`)
		.join('\n');

	function wrap(kind: 'Page' | 'Modal', r: RouteEntry, i: number): string {
		let expr = `createElement(${kind}${i}, { params })`;
		for (let j = r.layouts.length - 1; j >= 0; j--) {
			const id = layoutIds.get(r.layouts[j])!;
			expr = `createElement(Layout${id}, { params }, ${expr})`;
		}
		return expr;
	}

	const pageEntries = pages
		.map((r, i) => `    ${JSON.stringify(r.pattern)}: ({ params }) => ${wrap('Page', r, i)},`)
		.join('\n');

	const modalEntries = modals
		.map((r, i) => `    ${JSON.stringify(r.pattern)}: ({ params }) => ${wrap('Modal', r, i)},`)
		.join('\n');

	return `import { lazy, createElement, Suspense } from 'react';
import { SwitchRoute, Router, useRouter } from 'react-pragmatic-router';

${layoutImports}
${pageImports}
${modalImports}

export const routes = ${JSON.stringify(pages.map((r) => r.pattern))};
export const modalRoutes = ${JSON.stringify(modals.map((r) => r.pattern))};

export function Routes() {
  const { location, setLocation, backgroundLocation } = useRouter();
  const effective = backgroundLocation || location;
  return createElement(Router, {
    location: effective,
    setLocation: setLocation,
  }, createElement(SwitchRoute, {
    exact: true,
    patterns: {
${pageEntries}
    },
  }));
}

export function ModalRoutes() {
  return createElement(Suspense, { fallback: null }, createElement(SwitchRoute, {
    exact: true,
    patterns: {
${modalEntries}
    },
  }));
}
`;
}

export function reactPragmaticRouterPlugin(
	options: ReactPragmaticRouterPluginOptions,
): ReactPragmaticRouterPlugin {
	const extensions = options.extensions ?? ['.tsx', '.ts', '.jsx', '.js'];
	let routesDir = '';
	let server: any = null;

	function invalidate(file: string) {
		if (!server) return;
		if (!file.startsWith(routesDir)) return;

		const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID);
		if (mod) {
			server.moduleGraph.invalidateModule(mod);
			server.ws.send({ type: 'full-reload' });
		}
	}

	return {
		name: 'react-pragmatic-router',
		enforce: 'pre',

		configResolved(config) {
			routesDir = path.resolve(config.root, options.path);
		},

		configureServer(_server) {
			server = _server;
			const watcher = _server.watcher;
			watcher.add(routesDir);
			watcher.on('add', invalidate);
			watcher.on('unlink', invalidate);
			watcher.on('change', invalidate);
		},

		resolveId(id) {
			if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
			return null;
		},

		load(id) {
			if (id !== RESOLVED_VIRTUAL_ID) return null;
			const { pages, modals } = walk(routesDir, extensions);
			return generateModule(sortRoutes(pages), sortRoutes(modals));
		},
	};
}

export default reactPragmaticRouterPlugin;
