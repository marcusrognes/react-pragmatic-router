declare module 'virtual:react-pragmatic-router/routes' {
	import type { ComponentType } from 'react';

	export const routes: string[];
	export const modalRoutes: string[];
	export const Routes: ComponentType;
	export const ModalRoutes: ComponentType;
	export function useMatchedRoute(): string | null;
	export function useMatchedModal(): string | null;
}
