import React from 'react';
import ReactDOM from 'react-dom/client';

import { Route } from '../../src/Route';
import { DOMRouter } from '../../src/DOMRouter';
import { Link } from '../../src/Link';


function SamplePage() {
	console.log('Sample page');
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
	</div>;
}

function SecondPage() {
	console.log('Second page');
	return <div>
		<h1>
			Second page (relative addative href)
		</h1>
		<Link href="third">
			Third page
		</Link>
	</div>;
}

function ThirdPage() {
	console.log('Third page');
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
	console.log('ParamsPage', someId);
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
	console.log('Deeper ParamsPage');
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
	</div>;
}


function App() {
	return <DOMRouter>
		<h1>
			Simple
		</h1>
		<Route pattern="/" element={() => <SamplePage />} />
		<Route pattern="/second" element={({ params }) => <SecondPage />} />
		<Route pattern="/second/third" element={() => <ThirdPage />} />
		<Route pattern="/data/:someId" element={({ params }) => <ParamsPage someId={params.someId} />} />
		<Route pattern="/data/:someId/more/:someOtherId" element={({ params }) => <NestedParamsPage
			someId={params.someId}
			someOtherId={params.someOtherId}
		/>} />
	</DOMRouter>;
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
