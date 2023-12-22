import {ReactNode, useEffect, useState} from "react";
import {Router} from "./Router";

const LOCATION_CHANGE_EVENT = "popstate";

export function DOMRouter(props: { children: ReactNode }) {
	const [path, setPath] = useState(window.location.pathname);

	useEffect(() => {
		function handlePop() {
			setPath(window.location.pathname);
		}

		window.addEventListener(LOCATION_CHANGE_EVENT, handlePop);

		return () => {
			window.removeEventListener(LOCATION_CHANGE_EVENT, handlePop);
		}
	}, [false]);

	return <Router path={path} setPath={(newPath) => {
		window.history.pushState(null, "", newPath);
		setPath(newPath);
	}}>
		{props.children}
	</Router>
}
