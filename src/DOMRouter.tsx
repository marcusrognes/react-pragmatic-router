import { ReactNode } from 'react';
import { Router } from './Router';


export function DOMRouter(props: { children: ReactNode }) {
	return <Router startPath={window.location.pathname}>
		{props.children}
	</Router>;
}
