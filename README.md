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