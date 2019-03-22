(function (Prism) {
	Prism.languages.flow = Prism.languages.extend('javascript', {});

	Prism.languages.insertBefore('flow', 'keyword', {
		'type': [
			{
				pattern: /\b(?:[Nn]umber|[Ss]tring|[Bb]oolean|Function|any|mixed|null|void)\b/,
				alias: 'tag'
			}
		]
	});
	Prism.languages.flow['function-variable'].pattern = /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)(?:\s*:\s*\w+)?|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i;
	delete Prism.languages.flow['parameter'];

	Prism.languages.insertBefore('flow', 'operator', {
		'flow-punctuation': {
			pattern: /\{\||\|\}/,
			alias: 'punctuation'
		}
	});

	if (Prism.util.type(Prism.languages.flow.keyword) !== 'Array') {
		Prism.languages.flow.keyword = [Prism.languages.flow.keyword];
	}
	Prism.languages.flow.keyword.unshift(
		{
			pattern: /(^|[^$]\b)(?:type|opaque|declare|Class)\b(?!\$)/,
			lookbehind: true
		},
		{
			pattern: /(^|[^$]\B)\$(?:await|Diff|Exact|Keys|ObjMap|PropertyType|Shape|Record|Supertype|Subtype|Enum)\b(?!\$)/,
			lookbehind: true
		}
	);
}(Prism));
