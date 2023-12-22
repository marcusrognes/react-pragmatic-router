import React from "react";
import ReactDOM from "react-dom/client";

import {Route} from "../../src/Route";
import {DOMRouter} from "../../src/DOMRouter";
import {Link} from "../../src/Link";
import {useParams} from "../../src/Params";


function SamplePage() {
	console.log("Sample page");
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
	console.log("Second page");
	return <div>
		<h1>
			Second page (relative addative href)
		</h1>
		<Link href="third">
			Third page
		</Link>
	</div>
}

function ThirdPage() {
	console.log("Third page");
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
	console.log("ParamsPage");
	return <div>
		<h1>
			Params page {params.someId}
		</h1>
		<Link href="/data/123/more/1">
			Deeper params
		</Link>
		<Link href="/">
			Home
		</Link>
	</div>
}

function NestedParamsPage() {
	const params = useParams<{ someId: string, someOtherId: string }>();

	console.log("Deeper ParamsPage");
	return <div>
		<h1>
			Deeper params page {params.someId} {params.someOtherId}
		</h1>
		<Link href={`/data/123/more/${parseInt(params.someOtherId) + 1}`}>
			Go: {params.someOtherId}
		</Link>
		<br/>
		<Link href="/">
			Home
		</Link>
	</div>
}




function App() {
	return <DOMRouter>
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
		<Route path="/data/:someId/more/:someOtherId">
			<NestedParamsPage/>
		</Route>
	</DOMRouter>
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App/>);
