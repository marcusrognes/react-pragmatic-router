export default function UserDetail({ params }: { params: { id: string } }) {
	return (
		<section>
			<h2>User {params.id}</h2>
			<p>Dynamic segment from <code>routes/users/[id].tsx</code>.</p>
		</section>
	);
}
