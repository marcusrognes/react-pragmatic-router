import { createContext, ReactNode, useContext, useMemo } from 'react';


export interface SetLocationProps {
	replace?: boolean;
	modal?: boolean;
}

export const RouterProvider = createContext({
	location: '',
	setLocation: (newLocation: string, props?: SetLocationProps) => {
	},
	backgroundLocation: null as string | null,
});


export function useRouter() {
	return useContext(RouterProvider);
}

export function useSearchParams(): URLSearchParams {
	const { location } = useRouter();
	const search = location.split('?')[1] ?? '';
	return useMemo(() => new URLSearchParams(search), [search]);
}

export function Router(props: {
	location: string,
	setLocation: (newLocation: string, props?: SetLocationProps) => void,
	backgroundLocation?: string | null,
	children: ReactNode
}) {
	return <RouterProvider.Provider value={{
		location: props.location,
		setLocation: props.setLocation,
		backgroundLocation: props.backgroundLocation ?? null,
	}}>
		{props.children}
	</RouterProvider.Provider>;
}
