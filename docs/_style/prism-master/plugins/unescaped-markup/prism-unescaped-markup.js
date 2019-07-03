(function () {

	if (typeof self === 'undefined' || !self.Prism || !self.document || !Prism.languages.markup) {
		return;
	}

	Prism.plugins.UnescapedMarkup = true;

	Prism.hooks.add('before-highlightall', function (env) {
		env.selector += ", [class*='lang-'] script[type='text/plain'], [class*='language-'] script[type='text/plain']" +
		                ", script[type='text/plain'][class*='lang-'], script[type='text/plain'][class*='language-']";
	});

	Prism.hooks.add('before-sanity-check', function (env) {
		if ((env.element.matches || env.element.msMatchesSelector).call(env.element, "script[type='text/plain']")) {
			var code = document.createElement("code");
			var pre = document.createElement("pre");

			pre.className = code.className = env.element.className;

			if (env.element.dataset) {
				Object.keys(env.element.dataset).forEach(function (key) {
					if (Object.prototype.hasOwnProperty.call(env.element.dataset, key)) {
						pre.dataset[key] = env.element.dataset[key];
					}
				});
			}

			env.code = env.code.replace(/&lt;\/script(>|&gt;)/gi, "</scri" + "pt>");
			code.textContent = env.code;

			pre.appendChild(code);
			env.element.parentNode.replaceChild(pre, env.element);
			env.element = code;
			return;
		}

		var pre = env.element.parentNode;
		if (!env.code && pre && pre.nodeName.toLowerCase() == 'pre' &&
				env.element.childNodes.length && env.element.childNodes[0].nodeName == "#comment") {
			env.element.textContent = env.code = env.element.childNodes[0].textContent;
		}
	});
}());
