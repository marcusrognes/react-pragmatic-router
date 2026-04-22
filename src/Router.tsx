import { createContext, ReactNode, useContext } from 'react';


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
