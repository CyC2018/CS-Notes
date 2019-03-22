/* TODO
	Add support for Markdown notation inside doc comments
	Add support for nested block comments...
	Match closure params even when not followed by dash or brace
	Add better support for macro definition
*/

Prism.languages.rust = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\s\S]*?\*\//,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true
		}
	],
	'string': [
		{
			pattern: /b?r(#*)"(?:\\.|(?!"\1)[^\\\r\n])*"\1/,
			greedy: true
		},
		{
			pattern: /b?"(?:\\.|[^\\\r\n"])*"/,
			greedy: true
		}
	],
	'char': {
		pattern: /b?'(?:\\(?:x[0-7][\da-fA-F]|u{(?:[\da-fA-F]_*){1,6}|.)|[^\\\r\n\t'])'/,
		alias: 'string'
	},
	'lifetime-annotation': {
		pattern: /'[^\s>']+/,
		alias: 'symbol'
	},
	'keyword': /\b(?:abstract|alignof|as|be|box|break|const|continue|crate|do|dyn|else|enum|extern|false|final|fn|for|if|impl|in|let|loop|match|mod|move|mut|offsetof|once|override|priv|pub|pure|ref|return|sizeof|static|self|Self|struct|super|true|trait|type|typeof|union|unsafe|unsized|use|virtual|where|while|yield)\b/,

	'attribute': {
		pattern: /#!?\[.+?\]/,
		greedy: true,
		alias: 'attr-name'
	},

	'function': [
		/\w+(?=\s*\()/,
		// Macros can use parens or brackets
		/\w+!(?=\s*\(|\[)/
	],
	'macro-rules': {
		pattern: /\w+!/,
		alias: 'function'
	},

	// Hex, oct, bin, dec numbers with visual separators and type suffix
	'number': /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(\d(?:_?\d)*)?\.?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)(?:_?(?:[iu](?:8|16|32|64)?|f32|f64))?\b/,

	// Closure params should not be confused with bitwise OR |
	'closure-params': {
		pattern: /\|[^|]*\|(?=\s*[{-])/,
		inside: {
			'punctuation': /[|:,]/,
			'operator': /[&*]/
		}
	},
	'punctuation': /[{}[\];(),:]|\.+|->/,
	'operator': /[-+*\/%!^]=?|=[=>]?|@|&[&=]?|\|[|=]?|<<?=?|>>?=?/
};