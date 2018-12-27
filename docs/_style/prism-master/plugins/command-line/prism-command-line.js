(function() {

if (typeof self === 'undefined' || !self.Prism || !self.document) {
	return;
}

var clsReg = /(?:^|\s)command-line(?:\s|$)/;

Prism.hooks.add('before-highlight', function (env) {
	var vars = env.vars = env.vars || {};
	var commandLine = vars['command-line'] = vars['command-line'] || {};

	if (commandLine.complete || !env.code) {
		commandLine.complete = true;
		return;
	}

	// Works only for <code> wrapped inside <pre> (not inline).
	var pre = env.element.parentNode;
	if (!pre || !/pre/i.test(pre.nodeName) || // Abort only if neither the <pre> nor the <code> have the class
		(!clsReg.test(pre.className) && !clsReg.test(env.element.className))) {
		commandLine.complete = true;
		return;
	}

	if (env.element.querySelector('.command-line-prompt')) { // Abort if prompt already exists.
		commandLine.complete = true;
		return;
	}

	var codeLines = env.code.split('\n');
	commandLine.numberOfLines = codeLines.length;
	var outputLines = commandLine.outputLines = [];

	var outputSections = pre.getAttribute('data-output');
	var outputFilter = pre.getAttribute('data-filter-output');
	if (outputSections || outputSections === '') { // The user specified the output lines. -- cwells
		outputSections = outputSections.split(',');
		for (var i = 0; i < outputSections.length; i++) { // Parse the output sections into start/end ranges. -- cwells
			var range = outputSections[i].split('-');
			var outputStart = parseInt(range[0], 10);
			var outputEnd = (range.length === 2 ? parseInt(range[1], 10) : outputStart);

			if (!isNaN(outputStart) && !isNaN(outputEnd)) {
				if (outputStart < 1) {
					outputStart = 1;
				}
				if (outputEnd > codeLines.length) {
					outputEnd = codeLines.length;
				}
				// Convert start and end to 0-based to simplify the arrays. -- cwells
				outputStart--;
				outputEnd--;
				// Save the output line in an array and clear it in the code so it's not highlighted. -- cwells
				for (var j = outputStart; j <= outputEnd; j++) {
					outputLines[j] = codeLines[j];
					codeLines[j] = '';
				}
			}
		}
	} else if (outputFilter) { // Treat lines beginning with this string as output. -- cwells
		for (var i = 0; i < codeLines.length; i++) {
			if (codeLines[i].indexOf(outputFilter) === 0) { // This line is output. -- cwells
				outputLines[i] = codeLines[i].slice(outputFilter.length);
				codeLines[i] = '';
			}
		}
	}

	env.code = codeLines.join('\n');
});

Prism.hooks.add('before-insert', function (env) {
	var vars = env.vars = env.vars || {};
	var commandLine = vars['command-line'] = vars['command-line'] || {};
	if (commandLine.complete) {
		return;
	}

	// Reinsert the output lines into the highlighted code. -- cwells
	var codeLines = env.highlightedCode.split('\n');
	for (var i = 0; i < commandLine.outputLines.length; i++) {
		if (commandLine.outputLines.hasOwnProperty(i)) {
			codeLines[i] = commandLine.outputLines[i];
		}
	}
	env.highlightedCode = codeLines.join('\n');
});

Prism.hooks.add('complete', function (env) {
	var vars = env.vars = env.vars || {};
	var commandLine = vars['command-line'] = vars['command-line'] || {};
	if (commandLine.complete) {
		return;
	}

	var pre = env.element.parentNode;
	if (clsReg.test(env.element.className)) { // Remove the class "command-line" from the <code>
		env.element.className = env.element.className.replace(clsReg, ' ');
	}
	if (!clsReg.test(pre.className)) { // Add the class "command-line" to the <pre>
		pre.className += ' command-line';
	}

	var getAttribute = function(key, defaultValue) {
		return (pre.getAttribute(key) || defaultValue).replace(/"/g, '&quot');
	};

	// Create the "rows" that will become the command-line prompts. -- cwells
	var promptLines = new Array(commandLine.numberOfLines + 1);
	var promptText = getAttribute('data-prompt', '');
	if (promptText !== '') {
		promptLines = promptLines.join('<span data-prompt="' + promptText + '"></span>');
	} else {
		var user = getAttribute('data-user', 'user');
		var host = getAttribute('data-host', 'localhost');
		promptLines = promptLines.join('<span data-user="' + user + '" data-host="' + host + '"></span>');
	}

	// Create the wrapper element. -- cwells
	var prompt = document.createElement('span');
	prompt.className = 'command-line-prompt';
	prompt.innerHTML = promptLines;

	// Remove the prompt from the output lines. -- cwells
	for (var i = 0; i < commandLine.outputLines.length; i++) {
		if (commandLine.outputLines.hasOwnProperty(i)) {
			var node = prompt.children[i];
			node.removeAttribute('data-user');
			node.removeAttribute('data-host');
			node.removeAttribute('data-prompt');
		}
	}

	env.element.insertBefore(prompt, env.element.firstChild);
	commandLine.complete = true;
});

}());
