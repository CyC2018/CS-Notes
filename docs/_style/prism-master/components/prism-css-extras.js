Prism.languages.css.selector = {
	pattern: Prism.languages.css.selector,
	inside: {
		'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
		'pseudo-class': /:[-\w]+(?:\(.*\))?/,
		'class': /\.[-:.\w]+/,
		'id': /#[-:.\w]+/,
		'attribute': /\[[^\]]+\]/
	}
};

Prism.languages.insertBefore('css', 'property', {
	'variable': {
		pattern: /(^|[^-\w\xA0-\uFFFF])--[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*/i,
		lookbehind: true
	}
});

Prism.languages.insertBefore('css', 'function', {
	'operator': {
		pattern: /(\s)[+\-*\/](?=\s)/,
		lookbehind: true
	},
	'hexcode': /#[\da-f]{3,8}/i,
	'entity': /\\[\da-f]{1,8}/i,
	'unit': {
		pattern: /(\d)(?:%|[a-z]+)/,
		lookbehind: true
	},
	'number': /-?[\d.]+/
});
