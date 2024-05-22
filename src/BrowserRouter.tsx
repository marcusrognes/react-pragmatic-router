import { Router, SetLocationProps } from './Router';
import { ReactNode, useEffect, useState } from 'react';

function combineLocationAndSearch(location: string, search: string) {
	if (search) {
		return `${location}${search}`;
	}

	return location;
}

export function BrowserRouter(props: { children: ReactNode }) {
	const [location, _setLocation] = useState(window.location.pathname);
	const [searchParams, setSearchParams] = useState(window.location.search);

	function setLocation(newLocation: string, props?: SetLocationProps) {
		if(props?.replace){
			window.history.replaceState(null, '', newLocation);
		}else{
			window.history.pushState(null, '', newLocation);
		}

		_setLocation(window.location.pathname);
		setSearchParams(window.location.search);
	}

	useEffect(() => {
		function onPopstate() {
			_setLocation(window.location.pathname);
			setSearchParams(window.location.search);
		}

		window.addEventListener('popstate', onPopstate);
		return () => {
			window.removeEventListener('popstate', onPopstate);
		};
	}, [false]);

	return <Router location={combineLocationAndSearch(location, searchParams)} setLocation={setLocation}>
		{props.children}
	</Router>;
}