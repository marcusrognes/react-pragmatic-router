import { ReactNode } from 'react';
import { motion } from 'motion/react';

export function Page({ children }: { children: ReactNode }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -8 }}
			transition={{ duration: 0.2 }}
		>
			{children}
		</motion.div>
	);
}
