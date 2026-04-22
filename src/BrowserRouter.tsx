import { Router, SetLocationProps } from './Router';
import { ReactNode, useEffect, useState } from 'react';

function combineLocationAndSearch(location: string, search: string) {
	if (search) {
		return `${location}${search}`;
	}

	return location;
}

type HistoryState = { backgroundLocation?: string | null } | null;

export function BrowserRouter(props: { children: ReactNode }) {
	const [location, _setLocation] = useState(window.location.pathname);
	const [searchParams, setSearchParams] = useState(window.location.search);
	const [backgroundLocation, setBackgroundLocation] = useState<string | null>(() => {
		const s = window.history.state as HistoryState;
		return s?.backgroundLocation ?? null;
	});

	function setLocation(newLocation: string, p?: SetLocationProps) {
		let newState: HistoryState = null;

		if (p?.modal) {
			const currentFull = combineLocationAndSearch(location, searchParams);
			const bg = backgroundLocation ?? currentFull;
			newState = { backgroundLocation: bg };
			setBackgroundLocation(bg);
		} else {
			setBackgroundLocation(null);
		}

		if (p?.replace) {
			window.history.replaceState(newState, '', newLocation);
		} else {
			window.history.pushState(newState, '', newLocation);
		}

		_setLocation(window.location.pathname);
		setSearchParams(window.location.search);
	}

	useEffect(() => {
		function onPopstate() {
			_setLocation(window.location.pathname);
			setSearchParams(window.location.search);
			const s = window.history.state as HistoryState;
			setBackgroundLocation(s?.backgroundLocation ?? null);
		}

		window.addEventListener('popstate', onPopstate);
		return () => {
			window.removeEventListener('popstate', onPopstate);
		};
	}, []);

	return <Router
		location={combineLocationAndSearch(location, searchParams)}
		setLocation={setLocation}
		backgroundLocation={backgroundLocation}
	>
		{props.children}
	</Router>;
}
