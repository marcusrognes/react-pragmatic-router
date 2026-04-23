import { ReactNode, Suspense } from 'react';
import { AnimatePresence } from 'motion/react';
import { NavLink } from 'react-pragmatic-router';

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>
			<header
				style={{
					borderBottom: '1px solid #ddd',
					paddingBottom: '0.5rem',
					marginBottom: '1rem',
				}}
			>
				<h1 style={{ margin: 0 }}>react-pragmatic-router</h1>
				<nav
					style={{
						display: 'flex',
						gap: '0.75rem',
						marginTop: '0.5rem',
					}}
				>
					<NavLink href="/" exact activeClass="active">
						Home
					</NavLink>
					<NavLink href="/about" activeClass="active">
						About
					</NavLink>
					<NavLink href="/pricing" activeClass="active">
						Pricing
					</NavLink>
					<NavLink href="/users" activeClass="active">
						Users
					</NavLink>
					<NavLink
						href="/docs/getting-started/install"
						activeClass="active"
					>
						Docs
					</NavLink>
				</nav>
			</header>
			<main>
				<Suspense fallback={<p>Loading…</p>}>
					<AnimatePresence mode="wait">{children}</AnimatePresence>
				</Suspense>
			</main>
		</div>
	);
}
