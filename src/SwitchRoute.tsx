import { ReactNode, useMemo } from 'react';
import { useRouter } from './Router';
import { patternMatcher } from './utils';
import { ParamsType } from './Route';

export function SwitchRoute(props: {
	patterns: { [pattern: string]: (args: { params: ParamsType, path: string }) => ReactNode },
	exact?: boolean,
}) {
	const { location } = useRouter();
	const pathname = location.split('?')[0];
	let patterns = Object.keys(props.patterns);
	let matches: RegExpMatchArray | null = null;
	let matchingPattern: string | null = null;
	let hasMatched = false;

	for(const pattern of patterns){
		if(hasMatched) continue;

		matches = patternMatcher(pattern, location, props.exact);

		if(!matches) continue;

		hasMatched = true;
		matchingPattern = pattern;
	}

	return useMemo(() => {
		if(!matches || !matchingPattern) return null;

		return props.patterns[matchingPattern]({params: matches.groups || {}, path: pathname});
	}, [JSON.stringify(matches?.groups || {}), !!matches, matchingPattern, pathname]);
}
