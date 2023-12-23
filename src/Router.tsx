import { createContext, ReactNode, useContext } from 'react';


export const RouterProvider = createContext({
	location: '', setLocation: (newLocation: string) => {
	},
});


export function useRouter() {
	return useContext(RouterProvider);
}

export function Router(props: { location: string, setLocation: (newLocation: string) => void, children: ReactNode }) {
	return <RouterProvider.Provider value={{
		location: props.location,
		setLocation: props.setLocation,
	}}>
		{props.children}
	</RouterProvider.Provider>;
}
