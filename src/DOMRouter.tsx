import { Router } from './Router';
import { ReactNode, useState } from 'react';


export function DOMRouter(props: { children: ReactNode }) {
	const [location, _setLocation] = useState(window.location.pathname);

	function setLocation(newLocation: string){
		_setLocation(newLocation);
		window.history.pushState(null, "", newLocation);
	}

	return <Router location={location} setLocation={setLocation}>
		{props.children}
	</Router>;
}