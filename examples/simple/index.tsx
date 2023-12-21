import React from "react";
import ReactDOM from "react-dom/client";

import {Route} from "../../src/Route";
import {DOMRouter} from "../../src/DOMRouter";
import {Link} from "../../src/Link";
import {useParams} from "../../src/Params";


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
	</div>
}

function SecondPage() {
	return <div>
		<h1>
			Second page
		</h1>
		<Link href="/second/third">
			Third page
		</Link>
	</div>
}

function ThirdPage() {
	return <div>
		<h1>
			Third page
		</h1>
		<Link href="/data/123">
			Some params
		</Link>
	</div>
}

function ParamsPage() {
	const params = useParams<{ someId: string }>();
	return <div>
		<h1>
			Params page {params.someId}
		</h1>
		<Link href="/">
			Home
		</Link>
	</div>
}


function App() {
	return <DOMRouter>
		<h1>Renders</h1>
		<Route path="/">
			<SamplePage/>
		</Route>
		<Route path="/second">
			<SecondPage/>
		</Route>
		<Route path="/second/third">
			<ThirdPage/>
		</Route>
		<Route path="/data/:someId">
			<ParamsPage/>
		</Route>
	</DOMRouter>
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App/>);
