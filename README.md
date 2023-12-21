# react-pragmatic-router


# Getting started
`npm i react-pragmatic-router`

```typescript
<DOMRouter>
  	<Route path="/">
			<SamplePage/>
		</Route>
		<Route path="/second" exact>
			<SecondPage/>
		</Route>
		<Route path="/second/third">
			<ThirdPage/>
		</Route>
		<Route path="/data/:someId">
			<ParamsPage/>
		</Route>
</DOMRouter>
```

