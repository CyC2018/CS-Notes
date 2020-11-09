Prism.languages.xojo = {
	'comment': {
		pattern: /(?:'|\/\/|Rem\b).+/i,
		inside: {
			'keyword': /^Rem/i
		}
	},
	'string': {
		pattern: /"(?:""|[^"])*"/,
		greedy: true
	},
	'number': [
		/(?:\b\d+\.?\d*|\B\.\d+)(?:E[+-]?\d+)?/i,
		/&[bchou][a-z\d]+/i
	],
	'symbol': /#(?:If|Else|ElseIf|Endif|Pragma)\b/i,
	'keyword': /\b(?:AddHandler|App|Array|As(?:signs)?|By(?:Ref|Val)|Break|Call|Case|Catch|Const|Continue|CurrentMethodName|Declare|Dim|Do(?:wnTo)?|Each|Else(?:If)?|End|Exit|Extends|False|Finally|For|Global|If|In|Lib|Loop|Me|Next|Nil|Optional|ParamArray|Raise(?:Event)?|ReDim|Rem|RemoveHandler|Return|Select|Self|Soft|Static|Step|Super|Then|To|True|Try|Ubound|Until|Using|Wend|While)\b/i,
	'operator': /<[=>]?|>=?|[+\-*\/\\^=]|\b(?:AddressOf|And|Ctype|IsA?|Mod|New|Not|Or|Xor|WeakAddressOf)\b/i,
	'punctuation': /[.,;:()]/
};