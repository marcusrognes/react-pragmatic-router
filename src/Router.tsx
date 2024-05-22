import { createContext, ReactNode, useContext } from 'react';


export interface SetLocationProps {
	replace?: boolean;
}

export const RouterProvider = createContext({
	location: '', setLocation: (newLocation: string, props?: SetLocationProps) => {
	},
});


export function useRouter() {
	return useContext(RouterProvider);
}

export function Router(props: {
	location: string,
	setLocation: (newLocation: string, props?: SetLocationProps) => void,
	children: ReactNode
}) {
	return <RouterProvider.Provider value={{
		location: props.location,
		setLocation: props.setLocation,
	}}>
		{props.children}
	</RouterProvider.Provider>;
}
