import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'motion/react';
import { BrowserRouter } from 'react-pragmatic-router';
import {
	Routes,
	ModalRoutes,
	useMatchedModal,
} from 'virtual:react-pragmatic-router/routes';

const modalVariants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

function AnimatedModals() {
	const matched = useMatchedModal();
	return (
		<AnimatePresence>
			{matched && (
				<Suspense fallback={null}>
					<motion.div
						key={matched}
						variants={modalVariants}
						initial="initial"
						animate="animate"
						exit="exit"
						transition={{ duration: 0.18 }}
					>
						<ModalRoutes />
					</motion.div>
				</Suspense>
			)}
		</AnimatePresence>
	);
}

function App() {
	return (
		<BrowserRouter>
			<Suspense fallback={<p>Loading…</p>}>
				<Routes />
			</Suspense>
			<AnimatedModals />
		</BrowserRouter>
	);
}

createRoot(document.getElementById('root')!).render(<App />);
