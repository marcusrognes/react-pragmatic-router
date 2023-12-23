import { useLocation } from './Router';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import { patterMatcher } from './utils';


export function useMatcher(pattern: string, exact?: boolean) {
	const location = useLocation();

	return patterMatcher(pattern, location, exact);
}

export type ParamsType = { [param: string]: string };

const RouteContext = createContext<{ pattern: string }>({ pattern: "" });

export function useRoute<T extends ParamsType>() {
	return useContext(RouteContext);
}

export function Route(props: { pattern: string, exact?: boolean, children: ReactNode }) {
	const matcher = useMatcher(props.pattern, props.exact);
	if (!matcher) return null;

	return <RouteContext.Provider value={{ pattern: props.pattern }}>{props.children}</RouteContext.Provider>;
}


export function useParams<T>(){
	const route = useRoute();
	const match = useMatcher(route.pattern);

	return (match?.groups ?? {}) as T;
}
