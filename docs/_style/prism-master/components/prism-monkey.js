Prism.languages.monkey = {
	'string': /"[^"\r\n]*"/,
	'comment': [
		{
			pattern: /^#Rem\s+[\s\S]*?^#End/im,
			greedy: true
		},
		{
			pattern: /'.+/,
			greedy: true
		}
	],
	'preprocessor': {
		pattern: /(^[ \t]*)#.+/m,
		lookbehind: true,
		alias: 'comment'
	},
	'function': /\w+(?=\()/,
	'type-char': {
		pattern: /(\w)[?%#$]/,
		lookbehind: true,
		alias: 'variable'
	},
	'number': {
		pattern: /((?:\.\.)?)(?:(?:\b|\B-\.?|\B\.)\d+(?:(?!\.\.)\.\d*)?|\$[\da-f]+)/i,
		lookbehind: true
	},
	'keyword': /\b(?:Void|Strict|Public|Private|Property|Bool|Int|Float|String|Array|Object|Continue|Exit|Import|Extern|New|Self|Super|Try|Catch|Eachin|True|False|Extends|Abstract|Final|Select|Case|Default|Const|Local|Global|Field|Method|Function|Class|End|If|Then|Else|ElseIf|EndIf|While|Wend|Repeat|Until|Forever|For|To|Step|Next|Return|Module|Interface|Implements|Inline|Throw|Null)\b/i,
	'operator': /\.\.|<[=>]?|>=?|:?=|(?:[+\-*\/&~|]|\b(?:Mod|Shl|Shr)\b)=?|\b(?:And|Not|Or)\b/i,
	'punctuation': /[.,:;()\[\]]/
};