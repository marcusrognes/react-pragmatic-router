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

const VIRTUAL_ID = 'virtual:react-pragmatic-router/routes';
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_ID;

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
): RouteEntry[] {
	if (!fs.existsSync(dir)) return [];

	const entries = fs.readdirSync(dir, { withFileTypes: true });
	const layout = findLayout(dir, entries, extensions);
	const currentLayouts = layout ? [...layouts, layout] : layouts;

	const results: RouteEntry[] = [];

	for (const entry of entries) {
		const full = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			const nextPrefix = isGroup(entry.name)
				? prefix
				: prefix + '/' + transformSegment(entry.name);
			results.push(...walk(full, extensions, nextPrefix, currentLayouts));
			continue;
		}

		const ext = path.extname(entry.name);
		if (!extensions.includes(ext)) continue;

		const base = entry.name.slice(0, -ext.length);
		if (base.startsWith('_')) continue;

		const segment = base === 'index' ? '' : '/' + transformSegment(base);
		const pattern = (prefix + segment) || '/';
		results.push({ pattern, file: full, layouts: currentLayouts });
	}

	return results;
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

function generateModule(routes: RouteEntry[]): string {
	const layoutIds = new Map<string, number>();
	for (const r of routes) {
		for (const l of r.layouts) {
			if (!layoutIds.has(l)) layoutIds.set(l, layoutIds.size);
		}
	}

	const layoutImports = [...layoutIds.entries()]
		.map(([file, id]) => `const Layout${id} = lazy(() => import(${JSON.stringify(file)}));`)
		.join('\n');

	const pageImports = routes
		.map((r, i) => `const Page${i} = lazy(() => import(${JSON.stringify(r.file)}));`)
		.join('\n');

	const entries = routes
		.map((r, i) => {
			let expr = `createElement(Page${i}, { params })`;
			for (let j = r.layouts.length - 1; j >= 0; j--) {
				const id = layoutIds.get(r.layouts[j])!;
				expr = `createElement(Layout${id}, { params }, ${expr})`;
			}
			return `    ${JSON.stringify(r.pattern)}: ({ params }) => ${expr},`;
		})
		.join('\n');

	return `import { lazy, createElement } from 'react';
import { SwitchRoute } from 'react-pragmatic-router';

${layoutImports}
${pageImports}

export const routes = ${JSON.stringify(routes.map((r) => r.pattern))};

export function Routes() {
  return createElement(SwitchRoute, {
    exact: true,
    patterns: {
${entries}
    },
  });
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
			const routes = sortRoutes(walk(routesDir, extensions));
			return generateModule(routes);
		},
	};
}

export default reactPragmaticRouterPlugin;
