import { Link } from 'react-pragmatic-router';

export default function Home() {
	return (
		<section>
			<h2>Home</h2>
			<p>File-based routing powered by the Vite plugin.</p>

			<h3>Modals</h3>
			<p>Open the same URL as an overlay or as a full page:</p>
			<ul>
				<li>
					<Link href="/edit-thing/42" modal>
						Open “Edit thing 42” as modal (stays on Home)
					</Link>
				</li>
				<li>
					<Link href="/edit-thing/42">
						Go to <code>/edit-thing/42</code> directly (full-page modal)
					</Link>
				</li>
			</ul>
		</section>
	);
}
