Prism.languages.eiffel = {
	'comment': /--.*/,
	'string': [
		// Aligned-verbatim-strings
		{
			pattern: /"([^[]*)\[[\s\S]*?\]\1"/,
			greedy: true
		},
		// Non-aligned-verbatim-strings
		{
			pattern: /"([^{]*)\{[\s\S]*?\}\1"/,
			greedy: true
		},
		// Single-line string
		{
			pattern: /"(?:%\s+%|%.|[^%"\r\n])*"/,
			greedy: true
		}
	],
	// normal char | special char | char code
	'char': /'(?:%.|[^%'\r\n])+'/,
	'keyword': /\b(?:across|agent|alias|all|and|attached|as|assign|attribute|check|class|convert|create|Current|debug|deferred|detachable|do|else|elseif|end|ensure|expanded|export|external|feature|from|frozen|if|implies|inherit|inspect|invariant|like|local|loop|not|note|obsolete|old|once|or|Precursor|redefine|rename|require|rescue|Result|retry|select|separate|some|then|undefine|until|variant|Void|when|xor)\b/i,
	'boolean': /\b(?:True|False)\b/i,
	// Convention: class-names are always all upper-case characters
	'class-name': {
		'pattern': /\b[A-Z][\dA-Z_]*\b/,
		'alias': 'builtin'
	},
	'number': [
		// hexa | octal | bin
		/\b0[xcb][\da-f](?:_*[\da-f])*\b/i,
		// Decimal
		/(?:\d(?:_*\d)*)?\.(?:(?:\d(?:_*\d)*)?e[+-]?)?\d(?:_*\d)*|\d(?:_*\d)*\.?/i
	],
	'punctuation': /:=|<<|>>|\(\||\|\)|->|\.(?=\w)|[{}[\];(),:?]/,
	'operator': /\\\\|\|\.\.\||\.\.|\/[~\/=]?|[><]=?|[-+*^=~]/
};
