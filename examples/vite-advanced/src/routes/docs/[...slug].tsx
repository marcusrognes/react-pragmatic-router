export default function Docs({ params }: { params: { slug: string } }) {
	const segments = params.slug.split('/');
	return (
		<section>
			<h2>Docs</h2>
			<p>
				Catch-all route from <code>routes/docs/[...slug].tsx</code>.
				Slug = <code>{params.slug}</code>
			</p>
			<ul>
				{segments.map((s, i) => <li key={i}>{s}</li>)}
			</ul>
		</section>
	);
}
