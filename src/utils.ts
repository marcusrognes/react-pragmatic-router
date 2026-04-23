export function patternMatcher(pattern: string, path: string, exact?: boolean) {
	const pathname = path.split('?')[0];
	const paramProps = new RegExp(':[^\/]+', 'g');
	const catchAllProps = new RegExp('\\*[^\\/]+', 'g');
	const paramMatches = [...pattern.matchAll(paramProps)];
	const catchAllMatches = [...pattern.matchAll(catchAllProps)];
	let regexString = pattern.replaceAll('/', '\\/');

	paramMatches.forEach(m => {
		regexString = regexString.replaceAll(m[0], `(?<${m[0].replace(':', '')}>[^\/]+)`);
	});

	catchAllMatches.forEach(m => {
		const name = m[0].replace('*', '');
		regexString = regexString.replaceAll(m[0], `(?<${name}>.+)`);
	});

	if (exact) {
		regexString = `^${regexString}$`;
	}

	const routeRegex = new RegExp(regexString);
	return pathname.match(routeRegex);
}
