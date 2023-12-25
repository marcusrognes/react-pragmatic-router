import { ReactNode, useMemo } from 'react';
import { useRouter } from './Router';
import { patternMatcher } from './utils';


export type ParamsType = { [param: string]: string };

export function Route(props: {
	pattern: string,
	exact?: boolean,
	element?: ({ params }: { params: ParamsType }) => ReactNode,
	render?: (renderProps: { matches: boolean, params: ParamsType }) => ReactNode
}) {
	const { location } = useRouter();

	const matches = patternMatcher(props.pattern, location, props.exact);


	return useMemo(() => {
		if (props.element) {
			if (!matches) return null;
			return props.element({ params: matches.groups || {} });
		}

		if (!props.render) throw new Error('element or render is required');

		return props.render({ matches: !!matches, params: matches?.groups || {} });
	}, [JSON.stringify(matches?.groups || {}), !!matches]);
}