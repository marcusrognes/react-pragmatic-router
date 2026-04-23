import { Link, useSearchParams } from 'react-pragmatic-router';
import { Page } from '../_components/Page';

const tabs = [
	{ id: 'profile', label: 'Profile' },
	{ id: 'activity', label: 'Activity' },
	{ id: 'settings', label: 'Settings' },
];

export default function UserDetail({ params }: { params: { id: string } }) {
	const search = useSearchParams();
	const tab = search.get('tab') ?? 'profile';

	return (
		<Page>
			<section>
				<h2>User {params.id}</h2>
				<p>
					Dynamic segment from <code>routes/users/[id].tsx</code>.
				</p>
				<nav style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
					{tabs.map((t) => {
						const href =
							t.id === 'profile'
								? `/users/${params.id}`
								: `/users/${params.id}?tab=${t.id}`;
						return (
							<Link
								key={t.id}
								href={href}
								style={{ fontWeight: tab === t.id ? 'bold' : 'normal' }}
							>
								{t.label}
							</Link>
						);
					})}
				</nav>
				<div style={{ border: '1px solid #ddd', padding: '0.75rem', borderRadius: '4px' }}>
					Current tab: <strong>{tab}</strong>
				</div>
				<p style={{ marginTop: '0.75rem' }}>
					<Link href={`/edit-user/${params.id}`} modal>
						Edit as modal
					</Link>
				</p>
			</section>
		</Page>
	);
}
