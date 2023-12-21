import {createContext, ReactNode, useContext} from 'react';

export const RouterContext = createContext({
	path: "", setPath: (path: string) => {
	}
});

export function useRouter() {
	return useContext(RouterContext);
}

export function Router({children, path, setPath}: {
	children: ReactNode,
	path: string,
	setPath: (path: string) => void
}) {
	return <RouterContext.Provider value={{
		path,
		setPath
	}}>
		{children}
	</RouterContext.Provider>;
}