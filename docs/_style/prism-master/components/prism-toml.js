(function (Prism) {

	// pattern: /(?:[\w-]+|'[^'\n\r]*'|"(?:\.|[^\\"\r\n])*")/
	var key = "(?:[\\w-]+|'[^'\n\r]*'|\"(?:\\.|[^\\\\\"\r\n])*\")";

	Prism.languages.toml = {
		'comment': {
			pattern: /#.*/,
			greedy: true
		},
		'table': {
			pattern: RegExp("(\\[\\s*)" + key + "(?:\\s*\\.\\s*" + key + ")*(?=\\s*\\])"),
			lookbehind: true,
			greedy: true,
			alias: 'class-name'
		},
		'key': {
			pattern: RegExp("(^\\s*|[{,]\\s*)" + key + "(?:\\s*\\.\\s*" + key + ")*(?=\\s*=)", "m"),
			lookbehind: true,
			greedy: true,
			alias: 'property'
		},
		'string': {
			pattern: /"""(?:\\[\s\S]|[^\\])*?"""|'''[\s\S]*?'''|'[^'\n\r]*'|"(?:\\.|[^\\"\r\n])*"/,
			greedy: true
		},
		'date': [
			{
				// Offset Date-Time, Local Date-Time, Local Date
				pattern: /\d{4}-\d{2}-\d{2}(?:[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?/i,
				alias: 'number'
			},
			{
				// Local Time
				pattern: /\d{2}:\d{2}:\d{2}(?:\.\d+)?/i,
				alias: 'number'
			}
		],
		'number': /(?:\b0(?:x[\da-zA-Z]+(?:_[\da-zA-Z]+)*|o[0-7]+(?:_[0-7]+)*|b[10]+(?:_[10]+)*))\b|[-+]?\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?\b|[-+]?(?:inf|nan)\b/,
		'boolean': /\b(?:true|false)\b/,
		'punctuation': /[.,=[\]{}]/
	};
}(Prism));
