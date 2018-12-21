var components = require('../components.js');
var peerDependentsMap = null;

function getPeerDependentsMap() {
	var peerDependentsMap = {};
	Object.keys(components.languages).forEach(function (language) {
		if (language === 'meta') {
			return false;
		}
		if (components.languages[language].peerDependencies) {
			var peerDependencies = components.languages[language].peerDependencies;
			if (!Array.isArray(peerDependencies)) {
				peerDependencies = [peerDependencies];
			}
			peerDependencies.forEach(function (peerDependency) {
				if (!peerDependentsMap[peerDependency]) {
					peerDependentsMap[peerDependency] = [];
				}
				peerDependentsMap[peerDependency].push(language);
			});
		}
	});
	return peerDependentsMap;
}

function getPeerDependents(mainLanguage) {
	if (!peerDependentsMap) {
		peerDependentsMap = getPeerDependentsMap();
	}
	return peerDependentsMap[mainLanguage] || [];
}

function loadLanguages(arr, withoutDependencies) {
	// If no argument is passed, load all components
	if (!arr) {
		arr = Object.keys(components.languages).filter(function (language) {
			return language !== 'meta';
		});
	}
	if (arr && !arr.length) {
		return;
	}

	if (!Array.isArray(arr)) {
		arr = [arr];
	}

	arr.forEach(function (language) {
		if (!components.languages[language]) {
			console.warn('Language does not exist ' + language);
			return;
		}
		// Load dependencies first
		if (!withoutDependencies && components.languages[language].require) {
			loadLanguages(components.languages[language].require);
		}

		var pathToLanguage = './prism-' + language;
		delete require.cache[require.resolve(pathToLanguage)];
		delete Prism.languages[language];
		require(pathToLanguage);

		// Reload dependents
		var dependents = getPeerDependents(language).filter(function (dependent) {
			// If dependent language was already loaded,
			// we want to reload it.
			if (Prism.languages[dependent]) {
				delete Prism.languages[dependent];
				return true;
			}
			return false;
		});
		if (dependents.length) {
			loadLanguages(dependents, true);
		}
	});
}

module.exports = function (arr) {
	// Don't expose withoutDependencies
	loadLanguages(arr);
};