Prism.languages.rest = {
	'table': [
		{
			pattern: /(\s*)(?:\+[=-]+)+\+(?:\r?\n|\r)(?:\1(?:[+|].+)+[+|](?:\r?\n|\r))+\1(?:\+[=-]+)+\+/,
			lookbehind: true,
			inside: {
				'punctuation': /\||(?:\+[=-]+)+\+/
			}
		},
		{
			pattern: /(\s*)(?:=+ +)+=+(?:(?:\r?\n|\r)\1.+)+(?:\r?\n|\r)\1(?:=+ +)+=+(?=(?:\r?\n|\r){2}|\s*$)/,
			lookbehind: true,
			inside: {
				'punctuation': /[=-]+/
			}
		}
	],

	// Directive-like patterns

	'substitution-def': {
		pattern: /(^\s*\.\. )\|(?:[^|\s](?:[^|]*[^|\s])?)\| [^:]+::/m,
		lookbehind: true,
		inside: {
			'substitution': {
				pattern: /^\|(?:[^|\s]|[^|\s][^|]*[^|\s])\|/,
				alias: 'attr-value',
				inside: {
					'punctuation': /^\||\|$/
				}
			},
			'directive': {
				pattern: /( +)[^:]+::/,
				lookbehind: true,
				alias: 'function',
				inside: {
					'punctuation': /::$/
				}
			}
		}
	},
	'link-target': [
		{
			pattern: /(^\s*\.\. )\[[^\]]+\]/m,
			lookbehind: true,
			alias: 'string',
			inside: {
				'punctuation': /^\[|\]$/
			}
		},
		{
			pattern: /(^\s*\.\. )_(?:`[^`]+`|(?:[^:\\]|\\.)+):/m,
			lookbehind: true,
			alias: 'string',
			inside: {
				'punctuation': /^_|:$/
			}
		}
	],
	'directive': {
		pattern: /(^\s*\.\. )[^:]+::/m,
		lookbehind: true,
		alias: 'function',
		inside: {
			'punctuation': /::$/
		}
	},
	'comment': {
		// The two alternatives try to prevent highlighting of blank comments
		pattern: /(^\s*\.\.)(?:(?: .+)?(?:(?:\r?\n|\r).+)+| .+)(?=(?:\r?\n|\r){2}|$)/m,
		lookbehind: true
	},

	'title': [
		// Overlined and underlined
		{
			pattern: /^(([!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])\2+)(?:\r?\n|\r).+(?:\r?\n|\r)\1$/m,
			inside: {
				'punctuation': /^[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]+|[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]+$/,
				'important': /.+/
			}
		},

		// Underlined only
		{
			pattern: /(^|(?:\r?\n|\r){2}).+(?:\r?\n|\r)([!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])\2+(?=\r?\n|\r|$)/,
			lookbehind: true,
			inside: {
				'punctuation': /[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]+$/,
				'important': /.+/
			}
		}
	],
	'hr': {
		pattern: /((?:\r?\n|\r){2})([!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])\2{3,}(?=(?:\r?\n|\r){2})/,
		lookbehind: true,
		alias: 'punctuation'
	},
	'field': {
		pattern: /(^\s*):[^:\r\n]+:(?= )/m,
		lookbehind: true,
		alias: 'attr-name'
	},
	'command-line-option': {
		pattern: /(^\s*)(?:[+-][a-z\d]|(?:--|\/)[a-z\d-]+)(?:[ =](?:[a-z][\w-]*|<[^<>]+>))?(?:, (?:[+-][a-z\d]|(?:--|\/)[a-z\d-]+)(?:[ =](?:[a-z][\w-]*|<[^<>]+>))?)*(?=(?:\r?\n|\r)? {2,}\S)/im,
		lookbehind: true,
		alias: 'symbol'
	},
	'literal-block': {
		pattern: /::(?:\r?\n|\r){2}([ \t]+).+(?:(?:\r?\n|\r)\1.+)*/,
		inside: {
			'literal-block-punctuation': {
				pattern: /^::/,
				alias: 'punctuation'
			}
		}
	},
	'quoted-literal-block': {
		pattern: /::(?:\r?\n|\r){2}([!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]).*(?:(?:\r?\n|\r)\1.*)*/,
		inside: {
			'literal-block-punctuation': {
				pattern: /^(?:::|([!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])\1*)/m,
				alias: 'punctuation'
			}
		}
	},
	'list-bullet': {
		pattern: /(^\s*)(?:[*+\-•‣⁃]|\(?(?:\d+|[a-z]|[ivxdclm]+)\)|(?:\d+|[a-z]|[ivxdclm]+)\.)(?= )/im,
		lookbehind: true,
		alias: 'punctuation'
	},
	'doctest-block': {
		pattern: /(^\s*)>>> .+(?:(?:\r?\n|\r).+)*/m,
		lookbehind: true,
		inside: {
			'punctuation': /^>>>/
		}
	},

	'inline': [
		{
			pattern: /(^|[\s\-:\/'"<(\[{])(?::[^:]+:`.*?`|`.*?`:[^:]+:|(\*\*?|``?|\|)(?!\s).*?[^\s]\2(?=[\s\-.,:;!?\\\/'")\]}]|$))/m,
			lookbehind: true,
			inside: {
				'bold': {
					pattern: /(^\*\*).+(?=\*\*$)/,
					lookbehind: true
				},
				'italic': {
					pattern: /(^\*).+(?=\*$)/,
					lookbehind: true
				},
				'inline-literal': {
					pattern: /(^``).+(?=``$)/,
					lookbehind: true,
					alias: 'symbol'
				},
				'role': {
					pattern: /^:[^:]+:|:[^:]+:$/,
					alias: 'function',
					inside: {
						'punctuation': /^:|:$/
					}
				},
				'interpreted-text': {
					pattern: /(^`).+(?=`$)/,
					lookbehind: true,
					alias: 'attr-value'
				},
				'substitution': {
					pattern: /(^\|).+(?=\|$)/,
					lookbehind: true,
					alias: 'attr-value'
				},
				'punctuation': /\*\*?|``?|\|/
			}
		}
	],

	'link': [
		{
			pattern: /\[[^\]]+\]_(?=[\s\-.,:;!?\\\/'")\]}]|$)/,
			alias: 'string',
			inside: {
				'punctuation': /^\[|\]_$/
			}
		},
		{
			pattern: /(?:\b[a-z\d](?:[_.:+]?[a-z\d]+)*_?_|`[^`]+`_?_|_`[^`]+`)(?=[\s\-.,:;!?\\\/'")\]}]|$)/i,
			alias: 'string',
			inside: {
				'punctuation': /^_?`|`$|`?_?_$/
			}
		}
	],

	// Line block start,
	// quote attribution,
	// explicit markup start,
	// and anonymous hyperlink target shortcut (__)
	'punctuation': {
		pattern: /(^\s*)(?:\|(?= |$)|(?:---?|—|\.\.|__)(?= )|\.\.$)/m,
		lookbehind: true
	}
};