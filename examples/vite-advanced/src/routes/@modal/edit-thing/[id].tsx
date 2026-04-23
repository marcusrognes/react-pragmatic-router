import { motion } from 'motion/react';
import { useRouter } from 'react-pragmatic-router';

const overlay: React.CSSProperties = {
	position: 'fixed',
	inset: 0,
	background: 'rgba(0,0,0,0.45)',
	display: 'grid',
	placeItems: 'center',
	zIndex: 1000,
};

const sheet: React.CSSProperties = {
	background: 'white',
	padding: '1.5rem',
	borderRadius: '8px',
	minWidth: '320px',
	boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
};

export default function EditThingModal({ params }: { params: { id: string } }) {
	const { backgroundLocation, setLocation } = useRouter();

	function close() {
		setLocation(backgroundLocation ?? '/');
	}

	return (
		<div role="dialog" aria-modal="true" style={overlay} onClick={close}>
			<motion.div
				style={sheet}
				initial={{ scale: 0.96, y: 8 }}
				animate={{ scale: 1, y: 0 }}
				exit={{ scale: 0.96, y: 8 }}
				transition={{ duration: 0.18 }}
				onClick={(e) => e.stopPropagation()}
			>
				<h2 style={{ marginTop: 0 }}>Edit thing {params.id}</h2>
				<p>
					This modal lives at <code>/edit-thing/{params.id}</code> and is
					defined in <code>routes/@modal/edit-thing/[id].tsx</code>.
				</p>
				<p style={{ color: '#666' }}>
					Opened from another page? Background stays visible and
					browser-back closes the modal. Refreshing this URL shows the
					modal alone.
				</p>
				<button onClick={close}>Close</button>
			</motion.div>
		</div>
	);
}
