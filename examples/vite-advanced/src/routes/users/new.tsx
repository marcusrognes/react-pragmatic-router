export default function NewUser() {
	return (
		<section>
			<h2>New user</h2>
			<p>
				Static <code>/users/new</code> wins over the dynamic
				<code>/users/:id</code> thanks to route sorting.
			</p>
		</section>
	);
}
