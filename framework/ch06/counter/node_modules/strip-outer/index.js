export default function stripOuter(string, substring) {
	if (typeof string !== 'string' || typeof substring !== 'string') {
		throw new TypeError('Expected a string');
	}

	if (string.startsWith(substring)) {
		string = string.slice(substring.length);
	}

	if (string.endsWith(substring)) {
		string = string.slice(0, -substring.length);
	}

	return string;
}
