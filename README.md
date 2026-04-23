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

## Search params:

`useRouter().location` includes the query string, and a query-only navigation (e.g. `/users/42` → `/users/42?tab=activity`) re-renders every component that reads the router context. `useSearchParams()` is a small convenience that returns a `URLSearchParams` keyed off the current location:

```tsx
import { Link, useSearchParams } from 'react-pragmatic-router';

function UserDetail({ params }: { params: { id: string } }) {
	const search = useSearchParams();
	const tab = search.get('tab') ?? 'profile';

	return <div>
		<Link href={`/users/${params.id}`}>Profile</Link>
		<Link href={`/users/${params.id}?tab=activity`}>Activity</Link>
		<p>Current tab: {tab}</p>
	</div>;
}
```

Route params from `patternMatcher` always come from the pathname; the query is never merged into them.

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
        </Suspense>
        <Suspense fallback={null}>
            <ModalRoutes />
        </Suspense>
    </BrowserRouter>;
}
```

Use two separate `<Suspense>` boundaries — one per slot — so a loading modal chunk doesn't collapse the background page (and vice versa).

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

### Transitions (motion/react)

The virtual module also exports two hooks so you can drive animations from the matched pattern:

```ts
import {
    Routes,
    ModalRoutes,
    useMatchedRoute,
    useMatchedModal,
} from 'virtual:react-pragmatic-router/routes';
```

- `useMatchedRoute()` → the matched page pattern (matched against `backgroundLocation ?? location`), or `null`.
- `useMatchedModal()` → the matched modal pattern (matched against the live `location`), or `null`.

Use them as `<AnimatePresence>` keys.

**Modals** (always a top-level overlay):

```tsx
function AnimatedModals() {
    const matched = useMatchedModal();
    return (
        <AnimatePresence>
            {matched && (
                <Suspense fallback={null}>
                    <motion.div
                        key={matched}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                    >
                        <ModalRoutes />
                    </motion.div>
                </Suspense>
            )}
        </AnimatePresence>
    );
}
```

Put the `<Suspense>` *inside* the `<AnimatePresence>` conditional, so the `<motion.div>` only mounts once the modal chunk has loaded. Otherwise the enter animation starts on an empty wrapper and the content pops in mid-tween.

**Pages** — put the `<AnimatePresence>` inside each layout, not around `<Routes />`. The plugin already keys every layout by its file identity and every leaf page by its pattern, so each layout's `children` slot is a keyed child that `AnimatePresence` can track:

```tsx
// routes/_layout.tsx
import { AnimatePresence } from 'motion/react';

export default function RootLayout({ children }) {
    return (
        <>
            <Header />
            <main>
                <AnimatePresence mode="wait">{children}</AnimatePresence>
            </main>
        </>
    );
}
```

Then have each leaf page wrap its content in a `motion.*` element with `initial`/`animate`/`exit`. A shared wrapper keeps this tidy:

```tsx
// routes/_components/Page.tsx
export function Page({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
        >
            {children}
        </motion.div>
    );
}
```

Why this works:

- Layout keys are stable per layout file (`layout:0`, `layout:1`, …). An `AnimatePresence` inside `routes/_layout.tsx` sees its child key stay the same when you navigate between `/users` and `/users/42` (both wrap a `layout:1` element at that slot), so the root layout does **not** re-animate.
- The inner `routes/users/_layout.tsx` gets a keyed leaf as its child, so `/users` → `/users/new` triggers an exit/enter inside that layout only.
- `/users/42` → `/users/43` animates too: the leaf is keyed by the resolved pathname (not the pattern), so dynamic-param siblings swap cleanly. Revisiting the same URL keeps the key stable, so it won't re-animate unnecessarily.

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


