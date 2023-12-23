import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { randomId } from './utils';

const ROUTER_LOCATIONS = new Map<string, string>();
const ROUTER_LOCATION_CHANGE_EVENTS = new Map<string, ((newLocation: string) => void)[]>();

export function addLocationListener(routerId: string, fn: (newLocation: string) => void) {
	if (!ROUTER_LOCATION_CHANGE_EVENTS.has(routerId)) {
		ROUTER_LOCATION_CHANGE_EVENTS.set(routerId, []);
	}

	ROUTER_LOCATION_CHANGE_EVENTS.get(routerId)?.push(fn);

	return () => {
		const index = ROUTER_LOCATION_CHANGE_EVENTS.get(routerId)?.indexOf(fn) ?? -1;

		if (index == -1) return;

		ROUTER_LOCATION_CHANGE_EVENTS.get(routerId)?.splice(index, 1);
	};
}

export function setLocation(routerId: string, location: string) {
	ROUTER_LOCATIONS.set(routerId, location);
	ROUTER_LOCATION_CHANGE_EVENTS.get(routerId)?.forEach(fn => fn(location));
}

export function getLocation(routerId: string) {
	return ROUTER_LOCATIONS.get(routerId) || '/';
}

export const RouterProvider = createContext({ routerId: '' });

export function Router(props: { startPath: string, children: ReactNode }) {
	const routerId = useMemo(() => {
		const id = randomId(6);

		setLocation(id, props.startPath);

		return id;
	}, [false]);
	return <RouterProvider.Provider value={{
		routerId,
	}}>
		{props.children}
	</RouterProvider.Provider>;
}

export function useRouter() {
	return useContext(RouterProvider);
}

export function useLocation() {
	const { routerId } = useRouter();
	const [path, setPath] = useState(getLocation(routerId));

	useEffect(() => {
		return addLocationListener(routerId, (newLocation) => {
			setPath(newLocation);
		});
	}, [false]);

	return path;
}

export function useNavigate() {
	const { routerId } = useRouter();
	return (newLocation: string) => {
		setLocation(routerId, newLocation);
	};
}