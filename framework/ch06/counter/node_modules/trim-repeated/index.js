import escapeStringRegexp from 'escape-string-regexp';

export default function trimRepeated(string, target) {
	if (typeof string !== 'string' || typeof target !== 'string') {
		throw new TypeError('Expected a string');
	}

	const regex = new RegExp(`(?:${escapeStringRegexp(target)}){2,}`, 'g');

	return string.replace(regex, target);
}
