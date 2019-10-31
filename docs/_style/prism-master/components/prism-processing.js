Prism.languages.processing = Prism.languages.extend('clike', {
	'keyword': /\b(?:break|catch|case|class|continue|default|else|extends|final|for|if|implements|import|new|null|private|public|return|static|super|switch|this|try|void|while)\b/,
	'operator': /<[<=]?|>[>=]?|&&?|\|\|?|[%?]|[!=+\-*\/]=?/
});
Prism.languages.insertBefore('processing', 'number', {
	// Special case: XML is a type
	'constant': /\b(?!XML\b)[A-Z][A-Z\d_]+\b/,
	'type': {
		pattern: /\b(?:boolean|byte|char|color|double|float|int|XML|[A-Z]\w*)\b/,
		alias: 'variable'
	}
});

// Spaces are allowed between function name and parenthesis
Prism.languages.processing['function'].pattern = /\w+(?=\s*\()/;

// Class-names is not styled by default
Prism.languages.processing['class-name'].alias = 'variable';