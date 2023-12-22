import { ReactNode, useMemo } from 'react';
import { useRouter } from './Router';
import { ParamsProvider, ParamsType } from './Params';

export function usePatterMatcher(pattern: string, path: string, exact?: boolean) {
	const matchProps = new RegExp(':[^\/]+', 'g');
	const array = [...pattern.matchAll(matchProps)];
	let regexString = pattern.replaceAll('/', '\\/');

	array.forEach(m => {
		regexString = regexString.replaceAll(m[0], `(?<${m[0].replace(':', '')}>[^\/]+)`);
	});

	if (exact) {
		regexString += '$';
	}

	const routeRegex = new RegExp(regexString);
	return path.match(routeRegex);
}

export function Route(props: { path: string, exact?: boolean, children: ReactNode }) {
	const router = useRouter();
	const matches = usePatterMatcher(props.path, router.path, props.exact);
	const paramsMemo = useMemo(() => {
		console.log("Re memoing", props.path);
		return matches?.groups || {};
	}, [JSON.stringify(matches?.groups)]);

	if (!matches) return;


	return <ParamsProvider params={paramsMemo as ParamsType}>{props.children}</ParamsProvider>;
}
