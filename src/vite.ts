import type { Plugin, ViteDevServer } from 'vite';
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface ReactPragmaticRouterPluginOptions {
	path: string;
	extensions?: string[];
}

type RouteEntry = { pattern: string; file: string };

const VIRTUAL_ID = 'virtual:react-pragmatic-router/routes';
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_ID;

function transformSegment(name: string): string {
	return name
		.replace(/^\[\.\.\.(.+)\]$/, ':$1')
		.replace(/^\[(.+)\]$/, ':$1');
}

function walk(
	dir: string,
	extensions: string[],
	prefix = '',
): RouteEntry[] {
	if (!fs.existsSync(dir)) return [];

	const results: RouteEntry[] = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const full = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			results.push(...walk(full, extensions, prefix + '/' + transformSegment(entry.name)));
			continue;
		}

		const ext = path.extname(entry.name);
		if (!extensions.includes(ext)) continue;

		const base = entry.name.slice(0, -ext.length);
		if (base.startsWith('_')) continue;

		const segment = base === 'index' ? '' : '/' + transformSegment(base);
		const pattern = (prefix + segment) || '/';
		results.push({ pattern, file: full });
	}

	return results;
}

function sortRoutes(routes: RouteEntry[]): RouteEntry[] {
	return routes.slice().sort((a, b) => {
		const aDyn = (a.pattern.match(/:/g) || []).length;
		const bDyn = (b.pattern.match(/:/g) || []).length;
		if (aDyn !== bDyn) return aDyn - bDyn;
		return b.pattern.length - a.pattern.length;
	});
}

function generateModule(routes: RouteEntry[]): string {
	const imports = routes
		.map((r, i) => `const Page${i} = lazy(() => import(${JSON.stringify(r.file)}));`)
		.join('\n');

	const entries = routes
		.map(
			(r, i) =>
				`    ${JSON.stringify(r.pattern)}: ({ params }) => createElement(Page${i}, { params }),`,
		)
		.join('\n');

	return `import { lazy, createElement } from 'react';
import { SwitchRoute } from 'react-pragmatic-router';

${imports}

export const routes = ${JSON.stringify(
		routes.map((r) => r.pattern),
	)};

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
): Plugin {
	const extensions = options.extensions ?? ['.tsx', '.ts', '.jsx', '.js'];
	let routesDir = '';
	let server: ViteDevServer | null = null;

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
