import { ReactNode, useMemo } from 'react';
import { useRouter } from './Router';
import { patternMatcher } from './utils';


export type ParamsType = { [param: string]: string };

export function SwitchRoute(props: {
	patterns: { [pattern: string]: ({ params }: { params: ParamsType }) => ReactNode },
	exact?: boolean,
}) {
	const { location } = useRouter();
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

		return props.patterns[matchingPattern]({params: matches.groups || {}});
	}, [JSON.stringify(matches?.groups || {}), !!matches, matchingPattern]);
}