Prism.languages.markdown = Prism.languages.extend('markup', {});
Prism.languages.insertBefore('markdown', 'prolog', {
	'blockquote': {
		// > ...
		pattern: /^>(?:[\t ]*>)*/m,
		alias: 'punctuation'
	},
	'code': [
		{
			// Prefixed by 4 spaces or 1 tab
			pattern: /^(?: {4}|\t).+/m,
			alias: 'keyword'
		},
		{
			// `code`
			// ``code``
			pattern: /``.+?``|`[^`\n]+`/,
			alias: 'keyword'
		},
		{
			// ```optional language
			// code block
			// ```
			pattern: /^```[\s\S]*?^```$/m,
			greedy: true,
			inside: {
				'code-block': {
					pattern: /^(```.*(?:\r?\n|\r))[\s\S]+?(?=(?:\r?\n|\r)^```$)/m,
					lookbehind: true
				},
				'code-language': {
					pattern: /^(```).+/,
					lookbehind: true
				},
				'punctuation': /```/
			}
		}
	],
	'title': [
		{
			// title 1
			// =======

			// title 2
			// -------
			pattern: /\S.*(?:\r?\n|\r)(?:==+|--+)/,
			alias: 'important',
			inside: {
				punctuation: /==+$|--+$/
			}
		},
		{
			// # title 1
			// ###### title 6
			pattern: /(^\s*)#+.+/m,
			lookbehind: true,
			alias: 'important',
			inside: {
				punctuation: /^#+|#+$/
			}
		}
	],
	'hr': {
		// ***
		// ---
		// * * *
		// -----------
		pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
		lookbehind: true,
		alias: 'punctuation'
	},
	'list': {
		// * item
		// + item
		// - item
		// 1. item
		pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
		lookbehind: true,
		alias: 'punctuation'
	},
	'url-reference': {
		// [id]: http://example.com "Optional title"
		// [id]: http://example.com 'Optional title'
		// [id]: http://example.com (Optional title)
		// [id]: <http://example.com> "Optional title"
		pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
		inside: {
			'variable': {
				pattern: /^(!?\[)[^\]]+/,
				lookbehind: true
			},
			'string': /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
			'punctuation': /^[\[\]!:]|[<>]/
		},
		alias: 'url'
	},
	'bold': {
		// **strong**
		// __strong__

		// Allow only one line break
		pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
		lookbehind: true,
		greedy: true,
		inside: {
			'punctuation': /^\*\*|^__|\*\*$|__$/
		}
	},
	'italic': {
		// *em*
		// _em_

		// Allow only one line break
		pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
		lookbehind: true,
		greedy: true,
		inside: {
			'punctuation': /^[*_]|[*_]$/
		}
	},
	'strike': {
		// ~~strike through~~
		// ~strike~

		// Allow only one line break
		pattern: /(^|[^\\])(~~?)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
		lookbehind: true,
		greedy: true,
		inside: {
			'punctuation': /^~~?|~~?$/
		}
	},
	'url': {
		// [example](http://example.com "Optional title")
		// [example] [id]
		pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
		inside: {
			'variable': {
				pattern: /(!?\[)[^\]]+(?=\]$)/,
				lookbehind: true
			},
			'string': {
				pattern: /"(?:\\.|[^"\\])*"(?=\)$)/
			}
		}
	}
});

Prism.languages.markdown['bold'].inside['url'] = Prism.languages.markdown['url'];
Prism.languages.markdown['italic'].inside['url'] = Prism.languages.markdown['url'];
Prism.languages.markdown['strike'].inside['url'] = Prism.languages.markdown['url'];
Prism.languages.markdown['bold'].inside['italic'] = Prism.languages.markdown['italic'];
Prism.languages.markdown['bold'].inside['strike'] = Prism.languages.markdown['strike'];
Prism.languages.markdown['italic'].inside['bold'] = Prism.languages.markdown['bold'];
Prism.languages.markdown['italic'].inside['strike'] = Prism.languages.markdown['strike'];
Prism.languages.markdown['strike'].inside['bold'] = Prism.languages.markdown['bold'];
Prism.languages.markdown['strike'].inside['italic'] = Prism.languages.markdown['italic'];

Prism.hooks.add('after-tokenize', function (env) {
	if (env.language !== 'markdown') {
		return;
	}

	function walkTokens(tokens) {
		if (!tokens || typeof tokens === 'string') {
			return;
		}

		for (var i = 0, l = tokens.length; i < l; i++) {
			var token = tokens[i];

			if (token.type !== 'code') {
				walkTokens(token.content);
				continue;
			}

			var codeLang = token.content[1];
			var codeBlock = token.content[3];

			if (codeLang && codeBlock &&
				codeLang.type === 'code-language' && codeBlock.type === 'code-block' &&
				typeof codeLang.content === 'string') {

				// this might be a language that Prism does not support
				var alias = 'language-' + codeLang.content.trim().split(/\s+/)[0].toLowerCase();

				// add alias
				if (!codeBlock.alias) {
					codeBlock.alias = [alias];
				} else if (typeof codeBlock.alias === 'string') {
					codeBlock.alias = [codeBlock.alias, alias];
				} else {
					codeBlock.alias.push(alias);
				}
			}
		}
	}

	walkTokens(env.tokens);
});

Prism.hooks.add('wrap', function (env) {
	if (env.type !== 'code-block') {
		return;
	}

	var codeLang = '';
	for (var i = 0, l = env.classes.length; i < l; i++) {
		var cls = env.classes[i];
		var match = /language-(\w+)/.exec(cls);
		if (match) {
			codeLang = match[1];
			break;
		}
	}

	var grammar = Prism.languages[codeLang];

	if (!grammar) {
		return;
	}

	// reverse Prism.util.encode
	var code = env.content.replace(/&lt;/g, '<').replace(/&amp;/g, '&');

	env.content = Prism.highlight(code, grammar, codeLang);
});

Prism.languages.md = Prism.languages.markdown;