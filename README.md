# react-pragmatic-router


## Getting started:
`npm i react-pragmatic-router`


## Usage:

```tsx
<BrowserRouter>
	<Route pattern="/" element={() => <SamplePage />} />
	<Route pattern="/second" element={({ params }) => <SecondPage />} />
	<Route pattern="/second/third" element={() => <ThirdPage />} />
	<Route pattern="/data/:someId" element={({ params }) => <ParamsPage someId={params.someId} />} />
	<Route pattern="/data/:someId/more/:someOtherId" element={({ params }) => <NestedParamsPage
		someId={params.someId}
		someOtherId={params.someOtherId}
	/>} />
</BrowserRouter>
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
	return <BrowserRouter>
		<Route pattern="/page/:someParam" element={({ params }) => <Page someParam={params.someParam} />} />
	</BrowserRouter>;
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
<BrowserRouter>
	<Route pattern="/posts" exact element={() => <PostsPage />} />
	<Route pattern="^/posts$" element={() => <PostsPage />} />
</BrowserRouter>;
```

## SwitchRoute:
```tsx
<BrowserRouter>
	<SwitchRoute
        exact
		patterns={{
			'/posts/create-post': () => <CreatePostPage />,
			'/posts/:postId': ({ params }) => <PostPage id={params.postId} />,
		}}
	/>
</BrowserRouter>;
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

## Vite plugin (file-based routing):

Add the plugin to `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactPragmaticRouterPlugin } from 'react-pragmatic-router/vite';

export default defineConfig({
    plugins: [
        react(),
        reactPragmaticRouterPlugin({ path: './src/routes' }),
    ],
});
```

Add a reference in an ambient `.d.ts` (e.g. `src/vite-env.d.ts`) so TS knows the virtual module:

```ts
/// <reference types="react-pragmatic-router/client" />
```

Then in your app:

```tsx
import { Suspense } from 'react';
import { BrowserRouter } from 'react-pragmatic-router';
import { Routes, ModalRoutes } from 'virtual:react-pragmatic-router/routes';

export function App() {
    return <BrowserRouter>
        <Suspense fallback={null}>
            <Routes />
            <ModalRoutes />
        </Suspense>
    </BrowserRouter>;
}
```

### Conventions

| File                                   | Pattern              |
|----------------------------------------|----------------------|
| `routes/index.tsx`                     | `/`                  |
| `routes/about.tsx`                     | `/about`             |
| `routes/users/index.tsx`               | `/users`             |
| `routes/users/new.tsx`                 | `/users/new`         |
| `routes/users/[id].tsx`                | `/users/:id`         |
| `routes/users/[id]/posts.tsx`          | `/users/:id/posts`   |
| `routes/docs/[...slug].tsx`            | `/docs/*slug`        |
| `routes/(marketing)/pricing.tsx`       | `/pricing`           |
| `routes/_layout.tsx`                   | wraps every page     |
| `routes/users/_layout.tsx`             | wraps every `/users/*` page |
| `routes/@modal/edit-thing/[id].tsx`    | `/edit-thing/:id` (overlay modal) |

- Each route file must `export default` a component. It receives `{ params }` as a prop.
- `[id]` → named param. `[...slug]` → catch-all, matches the rest of the path (including slashes), sorted after all other routes.
- Folders named `(something)` are route groups: they don't appear in the URL, but can contain their own `_layout.tsx` that applies only to pages inside the group.
- `_layout.tsx` at any depth wraps every descendant route. Layouts receive `{ children, params }`. Nest freely — `routes/_layout.tsx` wraps everything, `routes/users/_layout.tsx` additionally wraps `/users/*`.
- Other files prefixed with `_` are ignored (treat them as private). Folders prefixed with `_` are also skipped entirely, so you can colocate non-route code — e.g. `routes/_components/Button.tsx` or `routes/users/_hooks/useUser.ts` — without it showing up as a URL.
- Files with a sub-extension (anything with a `.` in the base name, e.g. `[id].trpc.tsx`, `users.server.ts`, `index.test.tsx`) are treated as colocated files and are **not** routes. Only `foo.tsx` becomes a route, not `foo.anything.tsx`.
- Sorting: static segments beat dynamic ones beat catch-all. So `/users/new` wins over `/users/:id`, and `/users/:id` wins over `/*rest`.
- `SwitchRoute` with `exact: true` is used under the hood, so only one route renders at a time.
- Dev server does a full reload when route files are added, removed, or renamed.

### Modals

Files inside any `@modal/` folder are modal routes. The `@modal` segment is dropped from the URL (like a route group), so `routes/@modal/edit-thing/[id].tsx` becomes `/edit-thing/:id`. Modals don't inherit page layouts.

To open one as an overlay, pass the `modal` prop to `<Link>` / `<NavLink>`:

```tsx
<Link href="/edit-thing/42" modal>Edit 42</Link>
```

This stashes the current URL in `history.state` as `backgroundLocation`. `<Routes />` then renders against the background, so the page you were on stays mounted, and `<ModalRoutes />` renders the modal on top. Browser back closes the modal; refresh shows the modal standalone (no background).

Inside a modal, read `backgroundLocation` and call `setLocation` to close:

```tsx
const { backgroundLocation, setLocation } = useRouter();
const close = () => setLocation(backgroundLocation ?? '/');
```

See [`examples/vite-advanced`](./examples/vite-advanced) for a complete setup demonstrating layouts, groups, dynamic params and catch-all routes.

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
	return <BrowserRouter>
		<AnimatedRoute pattern="/" element={() => <AnimatedPage />} />
		<AnimatedRoute pattern="/some-other-page" element={() => <AnimatedPage />} />
	</BrowserRouter>;
}

```


