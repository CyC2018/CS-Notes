Prism.languages.r = {
	'comment': /#.*/,
	'string': {
		pattern: /(['"])(?:\\.|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'percent-operator': {
		// Includes user-defined operators
		// and %%, %*%, %/%, %in%, %o%, %x%
		pattern: /%[^%\s]*%/,
		alias: 'operator'
	},
	'boolean': /\b(?:TRUE|FALSE)\b/,
	'ellipsis': /\.\.(?:\.|\d+)/,
	'number': [
		/\b(?:NaN|Inf)\b/,
		/(?:\b0x[\dA-Fa-f]+(?:\.\d*)?|\b\d+\.?\d*|\B\.\d+)(?:[EePp][+-]?\d+)?[iL]?/
	],
	'keyword': /\b(?:if|else|repeat|while|function|for|in|next|break|NULL|NA|NA_integer_|NA_real_|NA_complex_|NA_character_)\b/,
	'operator': /->?>?|<(?:=|<?-)?|[>=!]=?|::?|&&?|\|\|?|[+*\/^$@~]/,
	'punctuation': /[(){}\[\],;]/
};