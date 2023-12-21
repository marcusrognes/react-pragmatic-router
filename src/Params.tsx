import {createContext, ReactNode, useContext} from "react";


export type ParamsType = { [param: string]: string };

const ParamsContext = createContext<{ params: ParamsType }>({params: {}});

export function useParams<T extends ParamsType>() {
	const {params} = useContext(ParamsContext);
	return params as T;
}

export function ParamsProvider(props: { children: ReactNode, params: ParamsType }) {
	const params = useParams();

	return <ParamsContext.Provider value={{
		params: {
			...params,
			...props.params
		}
	}}>
		{props.children}
	</ParamsContext.Provider>;
}

