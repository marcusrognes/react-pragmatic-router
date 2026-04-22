import { ReactNode } from 'react';
import { Link } from 'react-pragmatic-router';

export default function UsersLayout({ children }: { children: ReactNode }) {
	return (
		<div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1rem' }}>
			<aside style={{ borderRight: '1px solid #ddd', paddingRight: '1rem' }}>
				<h3>Users</h3>
				<ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
					<li><Link href="/users">All users</Link></li>
					<li><Link href="/users/new">New user</Link></li>
					<li><Link href="/users/42">User 42</Link></li>
					<li><Link href="/users/7">User 7</Link></li>
				</ul>
			</aside>
			<div>{children}</div>
		</div>
	);
}
