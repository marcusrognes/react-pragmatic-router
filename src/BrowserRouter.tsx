import { Router } from './Router';
import { ReactNode, useEffect, useState } from 'react';


export function BrowserRouter(props: { children: ReactNode }) {
	const [location, _setLocation] = useState(window.location.pathname);

	function setLocation(newLocation: string) {
		window.history.pushState(null, '', newLocation);
		_setLocation(window.location.pathname);
	}

	useEffect(() => {
		function onPopstate() {
			_setLocation(window.location.pathname);
		}

		window.addEventListener('popstate', onPopstate);
		return () => {
			window.removeEventListener('popstate', onPopstate);
		};

	}, [false]);

	return <Router location={location} setLocation={setLocation}>
		{props.children}
	</Router>;
}