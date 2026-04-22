import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-pragmatic-router';
import { Routes, ModalRoutes } from 'virtual:react-pragmatic-router/routes';

function App() {
	return (
		<BrowserRouter>
			<Suspense fallback={<p>Loading…</p>}>
				<Routes />
			</Suspense>
			<ModalRoutes />
		</BrowserRouter>
	);
}

createRoot(document.getElementById('root')!).render(<App />);
