# react-pragmatic-router


## Getting started:
`npm i react-pragmatic-router`


## Usage:
```tsx
<DOMRouter>
	<Route pattern="/" element={() => <SamplePage />} />
	<Route pattern="/second" element={({ params }) => <SecondPage />} />
	<Route pattern="/second/third" element={() => <ThirdPage />} />
	<Route pattern="/data/:someId" element={({ params }) => <ParamsPage someId={params.someId} />} />
	<Route pattern="/data/:someId/more/:someOtherId" element={({ params }) => <NestedParamsPage
		someId={params.someId}
		someOtherId={params.someOtherId}
	/>} />
</DOMRouter>
```

## Or:
```tsx
<Router location={"/"} setLocation={(newLocation: string) => {}}>
	<Route pattern="/" element={() => <SamplePage />} />
	<Route pattern="/second" element={({ params }) => <SecondPage />} />
	<Route pattern="/second/third" element={() => <ThirdPage />} />
	<Route pattern="/data/:someId" element={({ params }) => <ParamsPage someId={params.someId} />} />
	<Route pattern="/data/:someId/more/:someOtherId" element={({ params }) => <NestedParamsPage
		someId={params.someId}
		someOtherId={params.someOtherId}
	/>} />
</Router>
```


## Params:

```tsx
import { DOMRouter, Route } from 'react-pragmatic-router';

function Page(props: { someParam: string }) {
	return <div>
		<h1>Param: {props.someParam}</h1>
	</div>;
}


function App() {
	return <DOMRouter>
		<Route pattern="/page/:someParam" element={({ params }) => <Page someParam={params.someParam} />} />
	</DOMRouter>;
}
```

## Links:
```tsx
import { Link, NavLink } from 'react-pragmatic-router';

function Page(props: { someParam: string }) {
	return <div>
		<h1>Link</h1>
        
        <Link href="/some-other-page">To some other page</Link>
		<NavLink activeClass="active" exact href="/some-other-page">Navlink</NavLink>
	</div>;
}
```

## Exact route:
Exact is the same as adding ^ before and $ after your route `^/posts$` and `/posts` with exact is the same

These two routes does the same thing
```tsx
<DOMRouter>
	<Route pattern="/posts" exact element={() => <PostsPage />} />
	<Route pattern="^/posts$" element={() => <PostsPage />} />
</DOMRouter>;
```

## SwitchRoute:
```tsx
<DOMRouter>
	<SwitchRoute
        exact
		patterns={{
			'/posts/create-post': () => <CreatePostPage />,
			'/posts/:postId': ({ params }) => <PostPage id={params.postId} />,
		}}
	/>
</DOMRouter>;
```


## Programmatic navigation:

```tsx
import { Link, NavLink, useRouter } from 'react-pragmatic-router';

function Page(props: { someParam: string }) {
	const { setLocation } = useRouter();
	return <div>
		<h1>Programmatic navigation</h1>

		<button onClick={() => setLocation(`/some-new-location`)}>Trigger navigation</button>
	</div>;
}
```

## Advanced (Animations etc):

```tsx
import { ReactNode, useMemo } from 'react';
import { useRouter, patternMatcher, ParamsType } from 'react-pragmatic-router';
import { AnimatePresence, motion } from 'framer-motion';

function AnimatedRoute(props: {
	pattern: string;
	exact?: boolean;
	element: ({ params }: { params: ParamsType }) => ReactNode
}) {
	const { location } = useRouter();

	const matches = patternMatcher(props.pattern, location, props.exact);
	const cached = useMemo(() => {
		if (!matches) return null;
		return props.element({ params: matches?.groups || {} });
	}, [!!matches, JSON.stringify(matches?.groups)]);

	return <AnimatePresence mode="wait">{!!matches && cached}</AnimatePresence>;
}

function AnimatedPage() {
	return <motion.div
		initial={{ opacity: 0, y: '-20px' }}
		animate={{ opacity: 1, y: '0px' }}
		exit={{ opacity: 0, y: '-20px' }}
		transition={{ duration: 0.2 }}
		style={{
			position: 'fixed',
			top: '0',
			left: '0',
			width: '100vw',
			height: '100vh',
            background: "white"
		}}
	>
		<h1>Animated page!</h1>
	</motion.div>;
}

export function App() {
	return <DOMRouter>
		<AnimatedRoute pattern="/" element={() => <AnimatedPage />} />
		<AnimatedRoute pattern="/some-other-page" element={() => <AnimatedPage />} />
	</DOMRouter>;
}

```


