import React from 'react';
import ReactDOM from 'react-dom/client';

import { Route } from '../../src/Route';
import { BrowserRouter } from '../../src/BrowserRouter';
import { Link } from '../../src/Link';
import { useRouter } from '../../src';
import { NavLink } from '../../src/NavLink';
import { SwitchRoute } from '../../src/SwitchRoute';


function SamplePage() {
	return <div>
		<h1>
			Sample page
		</h1>
		<Link href="/second">
			Second
		</Link>
		<Link href="/data/123">
			Some params
		</Link>

		<Link href="/second/?test=1223">
			With search params
		</Link>
	</div>;
}

function SecondPage() {
	const { location } = useRouter();
	const urlParams = new URLSearchParams(location.split("?")[1] ?? "");

	return <div>
		<h1>
			Second page (relative addative href) searchParams: test:{urlParams.get('test')}
		</h1>
		<Link href="third">
			Third page
		</Link>
	</div>;
}

function ThirdPage() {
	return <div>
		<h1>
			Third page
		</h1>
		<Link href="/data/123">
			Some params
		</Link>
	</div>;
}

function ParamsPage({ someId }: { someId: string }) {
	return <div>
		<h1>
			Params page {someId}
		</h1>
		<Link href="/data/123/more/1">
			Deeper params
		</Link>
		<Link href="/">
			Home
		</Link>
	</div>;
}

function NestedParamsPage({ someId, someOtherId }: { someId: string, someOtherId: string }) {
	const { setLocation } = useRouter();
	return <div>
		<h1>
			Deeper params page {someId} {someOtherId}
		</h1>
		<Link href={`/data/123/more/${parseInt(someOtherId) + 1}`}>
			Go: {someOtherId}
		</Link>
		<br />
		<Link href="/">
			Home
		</Link>


		<Link href="/data/321/more/321" replace>
			Replace
		</Link>

		<button onClick={() => setLocation('/')}>
			Navigate with setLocation
		</button>
	</div>;
}


function App() {
	return <BrowserRouter>
		<h1>
			Simple
		</h1>
		<NavLink href="/" exact>Link 1</NavLink>
		<NavLink href="/">Link 1 (not exact)</NavLink>
		<NavLink href="/second">Second</NavLink>
		<NavLink href="/second/third">Third</NavLink>
		<NavLink href="/data/2" exact>Data 2</NavLink>
		<NavLink href="/data/2/more/2" exact>More 2</NavLink>
		<NavLink href="/switch/some-static" exact>Switch static</NavLink>
		<NavLink href="/switch/SomeId" exact>Switch SomeId skip static</NavLink>

		<Route pattern="/" exact element={() => <SamplePage />} />
		<Route pattern="/second" element={({ params }) => <SecondPage />} />
		<Route pattern="/second/third" element={() => <ThirdPage />} />
		<Route pattern="/data/:someId" exact element={({ params }) => <ParamsPage someId={params.someId} />} />
		<Route pattern="/data/:someId/more/:someOtherId" element={({ params }) => <NestedParamsPage
			someId={params.someId}
			someOtherId={params.someOtherId}
		/>} />

		<SwitchRoute patterns={{
			'/switch/some-static': () => <div><h1>Some static site</h1></div>,
			'/switch/:someId': ({ params }) => <div><h1>{params.someId}</h1></div>,
			'/switch': () => <div><h1>Root switch</h1></div>,
		}} exact />
	</BrowserRouter>;
}

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
