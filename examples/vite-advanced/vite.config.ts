import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactPragmaticRouterPlugin } from 'react-pragmatic-router/vite';

export default defineConfig({
	plugins: [
		react(),
		reactPragmaticRouterPlugin({ path: './src/routes' }),
	],
});
