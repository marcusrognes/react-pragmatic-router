export function patternMatcher(pattern: string, path: string, exact?: boolean) {
	const matchProps = new RegExp(':[^\/]+', 'g');
	const array = [...pattern.matchAll(matchProps)];
	let regexString = pattern.replaceAll('/', '\\/');

	array.forEach(m => {
		regexString = regexString.replaceAll(m[0], `(?<${m[0].replace(':', '')}>[^\/]+)`);
	});

	if (exact) {
		regexString += '$';
	}

	const routeRegex = new RegExp(regexString);
	return path.match(routeRegex);
}
