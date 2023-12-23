export function randomId(length: number) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

export function patterMatcher(pattern: string, path: string, exact?: boolean) {
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
