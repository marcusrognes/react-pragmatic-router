# vite-advanced example

Shows the Vite plugin with:

- Nested layouts (`_layout.tsx`)
- Route groups (`(marketing)`)
- Dynamic params (`[id]`)
- Catch-all routes (`[...slug]`)

## Run

```bash
cd examples/vite-advanced
npm install
npm run dev
```

## Layout

```
src/routes/
  _layout.tsx              # root layout — wraps every page
  index.tsx                # /
  about.tsx                # /about
  (marketing)/
    pricing.tsx            # /pricing          (group folder dropped)
  users/
    _layout.tsx            # wraps every /users/* page
    index.tsx              # /users
    new.tsx                # /users/new        (static wins over :id)
    [id].tsx               # /users/:id
  docs/
    [...slug].tsx          # /docs/*slug       (catch-all, sorted last)
```
