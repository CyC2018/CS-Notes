Prism.languages.vala = Prism.languages.extend('clike', {
	// Classes copied from prism-csharp
	'class-name': [
		{
			// (Foo bar, Bar baz)
			pattern: /\b[A-Z]\w*(?:\.\w+)*\b(?=(?:\?\s+|\*?\s+\*?)\w+)/,
			inside: {
				punctuation: /\./
			}
		},
		{
			// [Foo]
			pattern: /(\[)[A-Z]\w*(?:\.\w+)*\b/,
			lookbehind: true,
			inside: {
				punctuation: /\./
			}
		},
		{
			// class Foo : Bar
			pattern: /(\b(?:class|interface)\s+[A-Z]\w*(?:\.\w+)*\s*:\s*)[A-Z]\w*(?:\.\w+)*\b/,
			lookbehind: true,
			inside: {
				punctuation: /\./
			}
		},
		{
			// class Foo
			pattern: /((?:\b(?:class|interface|new|struct|enum)\s+)|(?:catch\s+\())[A-Z]\w*(?:\.\w+)*\b/,
			lookbehind: true,
			inside: {
				punctuation: /\./
			}
		}
	],
	'constant': /\b[A-Z0-9_]+\b/,
	'function': /\w+(?=\s*\()/,
	'keyword': /\b(?:bool|char|double|float|null|size_t|ssize_t|string|unichar|void|int|int8|int16|int32|int64|long|short|uchar|uint|uint8|uint16|uint32|uint64|ulong|ushort|class|delegate|enum|errordomain|interface|namespace|struct|break|continue|do|for|foreach|return|while|else|if|switch|assert|case|default|abstract|const|dynamic|ensures|extern|inline|internal|override|private|protected|public|requires|signal|static|virtual|volatile|weak|async|owned|unowned|try|catch|finally|throw|as|base|construct|delete|get|in|is|lock|new|out|params|ref|sizeof|set|this|throws|typeof|using|value|var|yield)\b/i,
	'number': /(?:\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?)(?:f|u?l?)?/i,
	'operator': /\+\+|--|&&|\|\||<<=?|>>=?|=>|->|~|[+\-*\/%&^|=!<>]=?|\?\??|\.\.\./,
	'punctuation': /[{}[\];(),.:]/
});

Prism.languages.insertBefore('vala','string', {
	'raw-string': {
		pattern: /"""[\s\S]*?"""/,
		greedy: true,
		alias: 'string'
	},
	'template-string': {
		pattern: /@"[\s\S]*?"/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\$(?:\([^)]*\)|[a-zA-Z]\w*)/,
				inside: {
					'delimiter': {
						pattern: /^\$\(?|\)$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.vala
				}
			},
			'string': /[\s\S]+/
		}
	}
});

Prism.languages.insertBefore('vala', 'keyword', {
	'regex': {
		pattern: /\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[imsx]{0,4}(?=\s*($|[\r\n,.;})\]]))/,
		greedy: true
	}
});