(function (Prism) {
	// Functions to construct regular expressions
	// simple form
	// e.g. (interactive ... or (interactive)
	function simple_form(name) {
		return RegExp('(\\()' + name + '(?=[\\s\\)])');
	}
	// booleans and numbers
	function primitive(pattern) {
		return RegExp('([\\s([])' + pattern + '(?=[\\s)])');
	}

	// Patterns in regular expressions

	// Symbol name. See https://www.gnu.org/software/emacs/manual/html_node/elisp/Symbol-Type.html
	// & and : are excluded as they are usually used for special purposes
	var symbol = '[-+*/_~!@$%^=<>{}\\w]+';
	// symbol starting with & used in function arguments
	var marker = '&' + symbol;
	// Open parenthesis for look-behind
	var par = '(\\()';
	var endpar = '(?=\\))';
	// End the pattern with look-ahead space
	var space = '(?=\\s)';

	var language = {
		// Three or four semicolons are considered a heading.
		// See https://www.gnu.org/software/emacs/manual/html_node/elisp/Comment-Tips.html
		heading: {
			pattern: /;;;.*/,
			alias: ['comment', 'title']
		},
		comment: /;.*/,
		string: {
			pattern: /"(?:[^"\\]*|\\.)*"/,
			greedy: true,
			inside: {
				argument: /[-A-Z]+(?=[.,\s])/,
				symbol: RegExp('`' + symbol + "'")
			}
		},
		'quoted-symbol': {
			pattern: RegExp("#?'" + symbol),
			alias: ['variable', 'symbol']
		},
		'lisp-property': {
			pattern: RegExp(':' + symbol),
			alias: 'property'
		},
		splice: {
			pattern: RegExp(',@?' + symbol),
			alias: ['symbol', 'variable']
		},
		keyword: [
			{
				pattern: RegExp(
					par +
						'(?:(?:lexical-)?let\\*?|(?:cl-)?letf|if|when|while|unless|cons|cl-loop|and|or|not|cond|setq|error|message|null|require|provide|use-package)' +
						space
				),
				lookbehind: true
			},
			{
				pattern: RegExp(
					par + '(?:for|do|collect|return|finally|append|concat|in|by)' + space
				),
				lookbehind: true
			},
		],
		declare: {
			pattern: simple_form('declare'),
			lookbehind: true,
			alias: 'keyword'
		},
		interactive: {
			pattern: simple_form('interactive'),
			lookbehind: true,
			alias: 'keyword'
		},
		boolean: {
			pattern: primitive('(?:t|nil)'),
			lookbehind: true
		},
		number: {
			pattern: primitive('[-+]?\\d+(?:\\.\\d*)?'),
			lookbehind: true
		},
		defvar: {
			pattern: RegExp(par + 'def(?:var|const|custom|group)\\s+' + symbol),
			lookbehind: true,
			inside: {
				keyword: /^def[a-z]+/,
				variable: RegExp(symbol)
			}
		},
		defun: {
			pattern: RegExp(
				par +
					'(?:cl-)?(?:defun\\*?|defmacro)\\s+' +
					symbol +
					'\\s+\\([\\s\\S]*?\\)'
			),
			lookbehind: true,
			inside: {
				keyword: /^(?:cl-)?def\S+/,
				// See below, this property needs to be defined later so that it can
				// reference the language object.
				arguments: null,
				function: {
					pattern: RegExp('(^\\s)' + symbol),
					lookbehind: true
				},
				punctuation: /[()]/
			}
		},
		lambda: {
			pattern: RegExp(par + 'lambda\\s+\\((?:&?' + symbol + '\\s*)*\\)'),
			lookbehind: true,
			inside: {
				keyword: /^lambda/,
				// See below, this property needs to be defined later so that it can
				// reference the language object.
				arguments: null,
				punctuation: /[()]/
			}
		},
		car: {
			pattern: RegExp(par + symbol),
			lookbehind: true
		},
		punctuation: [
			// open paren, brackets, and close paren
			/(['`,]?\(|[)\[\]])/,
			// cons
			{
				pattern: /(\s)\.(?=\s)/,
				lookbehind: true
			},
		]
	};

	var arg = {
		'lisp-marker': RegExp(marker),
		rest: {
			argument: {
				pattern: RegExp(symbol),
				alias: 'variable'
			},
			varform: {
				pattern: RegExp(par + symbol + '\\s+\\S[\\s\\S]*' + endpar),
				lookbehind: true,
				inside: {
					string: language.string,
					boolean: language.boolean,
					number: language.number,
					symbol: language.symbol,
					punctuation: /[()]/
				}
			}
		}
	};

	var forms = '\\S+(?:\\s+\\S+)*';

	var arglist = {
		pattern: RegExp(par + '[\\s\\S]*' + endpar),
		lookbehind: true,
		inside: {
			'rest-vars': {
				pattern: RegExp('&(?:rest|body)\\s+' + forms),
				inside: arg
			},
			'other-marker-vars': {
				pattern: RegExp('&(?:optional|aux)\\s+' + forms),
				inside: arg
			},
			keys: {
				pattern: RegExp('&key\\s+' + forms + '(?:\\s+&allow-other-keys)?'),
				inside: arg
			},
			argument: {
				pattern: RegExp(symbol),
				alias: 'variable'
			},
			punctuation: /[()]/
		}
	};

	language['lambda'].inside.arguments = arglist;
	language['defun'].inside.arguments = Prism.util.clone(arglist);
	language['defun'].inside.arguments.inside.sublist = arglist;

	Prism.languages.lisp = language;
	Prism.languages.elisp = language;
	Prism.languages.emacs = language;
	Prism.languages['emacs-lisp'] = language;
}(Prism));
