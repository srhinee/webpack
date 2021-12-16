const STYLES_REGEXP=/STYLE:(.*)\*\/\n?/
function t(source) {
	const match = source.match(STYLES_REGEXP);
	return match[1];
}
module.exports = t
