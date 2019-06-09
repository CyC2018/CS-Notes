/**
 * Manage downloads
 */

(function() {

var cache = {};
var form = $('form');
var minified = true;

var dependencies = {};

var treeURL = 'https://api.github.com/repos/PrismJS/prism/git/trees/gh-pages?recursive=1';
var treePromise = new Promise(function(resolve) {
	$u.xhr({
		url: treeURL,
		callback: function(xhr) {
			if (xhr.status < 400) {
				resolve(JSON.parse(xhr.responseText).tree);
			}
		}
	});
});

var hstr = window.location.hash.match(/(?:languages|plugins)=[-+\w]+|themes=[-\w]+/g);
if (hstr) {
	hstr.forEach(function(str) {
		var kv = str.split('=', 2),
		    category = kv[0],
		    ids = kv[1].split('+');
		if (category !== 'meta' && category !== 'core' && components[category]) {
			for (var id in components[category]) {
				if (components[category][id].option) {
					delete components[category][id].option;
				}
			}
			if (category === 'themes' && ids.length) {
				var themeInput = $('#theme input[value="' + ids[0] + '"]');
				if (themeInput) {
					themeInput.checked = true;
				}
				setTheme(ids[0]);
			}
			var makeDefault = function (id) {
				if (id !== 'meta') {
					if (components[category][id]) {
						if (components[category][id].option !== 'default') {
							if (typeof components[category][id] === 'string') {
								components[category][id] = { title: components[category][id] }
							}
							components[category][id].option = 'default';
						}
						if (components[category][id].require) {
							var deps = components[category][id].require;
							if ($u.type(deps) !== 'array') {
								deps = [deps];
							}
							deps.forEach(makeDefault);
						}
					}
				}
			};
			ids.forEach(makeDefault);
		}
	});
}

// Stay compatible with old querystring feature
var qstr = window.location.search.match(/(?:languages|plugins)=[-+\w]+|themes=[-\w]+/g);
if (qstr && !hstr) {
	window.location.hash = window.location.search.replace(/^\?/, '');
	window.location.search = '';
}

var storedTheme = localStorage.getItem('theme');

for (var category in components) {
	var all = components[category];

	all.meta.section = $u.element.create('section', {
		className: 'options',
		id: 'category-' + category,
		contents: {
			tag: 'h1',
			contents: category.charAt(0).toUpperCase() + category.slice(1)
		},
		inside: '#components'
	});

	if (all.meta.addCheckAll) {
		$u.element.create('label', {
			attributes: {
				'data-id': 'check-all-' + category
			},
			contents: [
				{
					tag: 'input',
					properties: {
						type: 'checkbox',
						name: 'check-all-' + category,
						value: '',
						checked: false,
						onclick: (function(category, all){
							return function () {
								var checkAll = this;
								$$('input[name="download-' + category + '"]').forEach(function(input) {
									all[input.value].enabled = input.checked = checkAll.checked;
								});

								update(category);
							};
						})(category, all)
					}
				},
				'Select/unselect all'
			],
			inside: all.meta.section
		});
	}

	for (var id in all) {
		if(id === 'meta') {
			continue;
		}

		var checked = false, disabled = false;
		var option = all[id].option || all.meta.option;

		switch (option) {
			case 'mandatory': disabled = true; // fallthrough
			case 'default': checked = true;
		}
		if (category === 'themes' && storedTheme) {
			checked = id === storedTheme;
		}

		var filepath = all.meta.path.replace(/\{id}/g, id);

		var info = all[id] = {
			title: all[id].title || all[id],
			aliasTitles: all[id].aliasTitles,
			noCSS: all[id].noCSS || all.meta.noCSS,
			noJS: all[id].noJS || all.meta.noJS,
			enabled: checked,
			require: $u.type(all[id].require) === 'string' ? [all[id].require] : all[id].require,
			after: $u.type(all[id].after) === 'string' ? [all[id].after] : all[id].after,
			peerDependencies: $u.type(all[id].peerDependencies) === 'string' ? [all[id].peerDependencies] : all[id].peerDependencies,
			owner: all[id].owner,
			files: {
				minified: {
					paths: [],
					size: 0
				},
				dev: {
					paths: [],
					size: 0
				}
			}
		};

		if (info.require) {
			info.require.forEach(function (v) {
				dependencies[v] = (dependencies[v] || []).concat(id);
			});
		}

		if (!all[id].noJS && !/\.css$/.test(filepath)) {
			info.files.minified.paths.push(filepath.replace(/(\.js)?$/, '.min.js'));
			info.files.dev.paths.push(filepath.replace(/(\.js)?$/, '.js'));
		}


		if ((!all[id].noCSS && !/\.js$/.test(filepath)) || /\.css$/.test(filepath)) {
			var cssFile = filepath.replace(/(\.css)?$/, '.css');

			info.files.minified.paths.push(cssFile);
			info.files.dev.paths.push(cssFile);
		}

		function getLanguageTitle(lang) {
			if (!lang.aliasTitles)
				return lang.title;

			var titles = [lang.title];
			for (var alias in lang.aliasTitles)
				if (lang.aliasTitles.hasOwnProperty(alias))
					titles.push(lang.aliasTitles[alias]);
			return titles.join(" + ");
		}

		var label = $u.element.create('label', {
			attributes: {
				'data-id': id
			},
			contents: [
				{
					tag: 'input',
					properties: {
						type: all.meta.exclusive? 'radio' : 'checkbox',
						name: 'download-' + category,
						value: id,
						checked: checked,
						disabled: disabled,
						onclick: (function(id, category, all){
							return function () {
								$$('input[name="' + this.name + '"]').forEach(function(input) {
									all[input.value].enabled = input.checked;
								});

								if (all[id].require && this.checked) {
									all[id].require.forEach(function(v) {
										var input = $('label[data-id="' + v + '"] > input');
										input.checked = true;

										input.onclick();
									});
								}

								if (dependencies[id] && !this.checked) { // It’s required by others
									dependencies[id].forEach(function(dependent) {
										var input = $('label[data-id="' + dependent + '"] > input');
										input.checked = false;

										input.onclick();
									});
								}

								update(category, id);
							};
						})(id, category, all)
					}
				},
				all.meta.link? {
					tag: 'a',
					properties: {
						href: all.meta.link.replace(/\{id}/g, id),
						className: 'name'
					},
					contents: info.title
				} : {
					tag: 'span',
					properties: {
						className: 'name'
					},
					contents: getLanguageTitle(info)
				},
				' ',
				all[id].owner? {
					tag: 'a',
					properties: {
						href: 'https://github.com/' + all[id].owner,
						className: 'owner',
						target: '_blank'
					},
					contents: all[id].owner
				} : ' ',
				{
					tag: 'strong',
					className: 'filesize'
				}
			],
			inside: all.meta.section
		});

		// Add click events on main theme selector too.
		(function (label) {
			if (category === 'themes') {
				var themeInput = $('#theme input[value="' + id + '"]');
				var input = $('input', label);
				if (themeInput) {
					var themeInputOnclick = themeInput.onclick;
					themeInput.onclick = function () {
						input.checked = true;
						input.onclick();
						themeInputOnclick && themeInputOnclick.call(themeInput);
					};
				}
			}
		}(label));
	}
}

form.elements.compression[0].onclick =
form.elements.compression[1].onclick = function() {
	minified = !!+this.value;

	getFilesSizes();
};

function getFileSize(filepath) {
	return treePromise.then(function(tree) {
		for(var i=0, l=tree.length; i<l; i++) {
			if(tree[i].path === filepath) {
				return tree[i].size;
			}
		}
	});
}

function getFilesSizes() {
	for (var category in components) {
		var all = components[category];

		for (var id in all) {
			if(id === 'meta') {
				continue;
			}

			var distro = all[id].files[minified? 'minified' : 'dev'],
			    files = distro.paths;

			files.forEach(function (filepath) {
				var file = cache[filepath] = cache[filepath] || {};

				if(!file.size) {

					(function(category, id) {
					getFileSize(filepath).then(function(size) {
						if(size) {
							file.size = size;
							distro.size += file.size;

							update(category, id);
						}
					});
					}(category, id));
				}
				else {
					update(category, id);
				}
			});
		}
	}
}

getFilesSizes();

function getFileContents(filepath) {
	return new Promise(function(resolve, reject) {
		$u.xhr({
			url: filepath,
			callback: function(xhr) {
				if (xhr.status < 400 && xhr.responseText) {
					resolve(xhr.responseText);
				} else {
					reject();
				}
			}
		});
	});
}

function prettySize(size) {
	return Math.round(100 * size / 1024)/100 + 'KB';
}

function update(updatedCategory, updatedId){
	// Update total size
	var total = {js: 0, css: 0}, updated = {js: 0, css: 0};

	for (var category in components) {
		var all = components[category];
		var allChecked = true;

		for (var id in all) {
			var info = all[id];

			if (info.enabled || id == updatedId) {
				var distro = info.files[minified? 'minified' : 'dev'];

				distro.paths.forEach(function(path) {
					if (cache[path]) {
						var file = cache[path];

						var type = path.match(/\.(\w+)$/)[1],
						    size = file.size || 0;

						if (info.enabled) {

							if (!file.contentsPromise) {
								file.contentsPromise = getFileContents(path);
							}

							total[type] += size;
						}

						if (id == updatedId) {
							updated[type] += size;
						}
					}
				});
			}
			if (id !== 'meta' && !info.enabled) {
				allChecked = false;
			}

			// Select main theme
			if (category === 'themes' && id === updatedId && info.enabled) {
				var themeInput = $('#theme input[value="' + updatedId + '"]');
				if (themeInput) {
					themeInput.checked = true;
				}
				setTheme(updatedId);
			}
		}

		if (all.meta.addCheckAll) {
			$('input[name="check-all-' + category + '"]').checked = allChecked;
		}
	}

	total.all = total.js + total.css;

	if (updatedId) {
		updated.all = updated.js + updated.css;

		$u.element.prop($('label[data-id="' + updatedId + '"] .filesize'), {
			textContent: prettySize(updated.all),
			title: (updated.js ? Math.round(100 * updated.js / updated.all) + '% JavaScript' : '') +
				(updated.js && updated.css ? ' + ' : '') +
				(updated.css ? Math.round(100 * updated.css / updated.all) + '% CSS' : '')
		});
	}

	$('#filesize').textContent = prettySize(total.all);

	$u.element.prop($('#percent-js'), {
		textContent: Math.round(100 * total.js / total.all) + '%',
		title: prettySize(total.js)
	});

	$u.element.prop($('#percent-css'), {
		textContent: Math.round(100 * total.css / total.all) + '%',
		title: prettySize(total.css)
	});

	delayedGenerateCode();
}

var timerId = 0;
// "debounce" multiple rapid requests to generate and highlight code
function delayedGenerateCode(){
	if ( timerId !== 0 ) {
		clearTimeout(timerId);
	}
	timerId = setTimeout(generateCode, 500);
}

function getSortedComponents(components, requireName, sorted) {
	if (!sorted) {
		sorted = [];
		for (var component in components) {
			sorted.push(component);
		}
	}

	var i = 0;
	while (i < sorted.length) {
		var id = sorted[i];
		var indexOfRequirement = i;
		var notNow = false;
		for (var requirement in components[id][requireName]) {
			indexOfRequirement = sorted.indexOf(components[id][requireName][requirement]);
			if (indexOfRequirement > i) {
				notNow = true;
				break;
			}
		}
		if (notNow) {
			var tmp = sorted[i];
			sorted[i] = sorted[indexOfRequirement];
			sorted[indexOfRequirement] = tmp;
		}
		else {
			i++;
		}
	}
	return sorted;
}

function getSortedComponentsByRequirements(components, afterName) {
	var sorted = getSortedComponents(components, afterName);
	return getSortedComponents(components, "require", sorted);
}

function generateCode(){
	var promises = [];
	var redownload = {};

	for (var category in components) {
		var all = components[category];

		// In case if one component requires other, required component should go first.
		var sorted = getSortedComponentsByRequirements(all, category === 'languages' ? 'peerDependencies' : 'after');

		for (var i = 0; i < sorted.length; i++) {
			var id = sorted[i];

			if(id === 'meta') {
				continue;
			}

			var info = all[id];
			if (info.enabled) {
				if (category !== 'core') {
					redownload[category] = redownload[category]  || [];
					redownload[category].push(id);
				}
				info.files[minified? 'minified' : 'dev'].paths.forEach(function (path) {
					if (cache[path]) {
						var type = path.match(/\.(\w+)$/)[1];

						promises.push({
							contentsPromise: cache[path].contentsPromise,
							path: path,
							type: type
						});
					}
				});
			}
		}
	}

	// Hide error message if visible
	var error = $('#download .error');
	error.style.display = '';

	Promise.all([buildCode(promises), getVersion()]).then(function(arr) {
		var res = arr[0];
		var version = arr[1];
		var code = res.code;
		var errors = res.errors;

		if(errors.length) {
			error.style.display = 'block';
			error.innerHTML = '';
			$u.element.contents(error, errors);
		}

		var redownloadUrl = window.location.href.split("#")[0] + "#";
		for (var category in redownload) {
			redownloadUrl += category + "=" + redownload[category].join('+') + "&";
		}
		redownloadUrl = redownloadUrl.replace(/&$/,"");
		window.location.replace(redownloadUrl);

		var versionComment = "/* PrismJS " + version + "\n" + redownloadUrl + " */";

		for (var type in code) {
			var codeElement = $('#download-' + type + ' code');

			codeElement.textContent = versionComment + "\n" + code[type];
			Prism.highlightElement(codeElement, true);

			$('#download-' + type + ' .download-button').href = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(versionComment + "\n" + code[type]);
		}
	});
}

function buildCode(promises) {
	var i = 0,
	    l = promises.length;
	var code = {js: '', css: ''};
	var errors = [];

	var f = function(resolve) {
		if(i < l) {
			var p = promises[i];
			p.contentsPromise.then(function(contents) {
				code[p.type] += contents + (p.type === 'js' && !/;\s*$/.test(contents) ? ';' : '') + '\n';
				i++;
				f(resolve);
			});
			p.contentsPromise['catch'](function() {
				errors.push($u.element.create({
					tag: 'p',
					prop: {
						textContent: 'An error occurred while fetching the file "' + p.path + '".'
					}
				}));
				i++;
				f(resolve);
			});
		} else {
			resolve({code: code, errors: errors});
		}
	};

	return new Promise(f);
}

function getVersion() {
	return getFileContents('./package.json').then(function (jsonStr) {
		return JSON.parse(jsonStr).version;
	});
}

})();
