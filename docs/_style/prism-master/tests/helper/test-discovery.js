"use strict";

var fs = require("fs");
var path = require("path");


module.exports = {

	/**
	 * Loads the list of all available tests
	 *
	 * @param {string} rootDir
	 * @returns {Object.<string, string[]>}
	 */
	loadAllTests: function (rootDir) {
		var testSuite = {};
		var self = this;

		this.getAllDirectories(rootDir).forEach(
			function (language) {
				testSuite[language] = self.getAllFiles(path.join(rootDir, language));
			}
		);

		return testSuite;
	},

	/**
	 * Loads the list of available tests that match the given languages
	 *
	 * @param {string} rootDir
	 * @param {string|string[]} languages
	 * @returns {Object.<string, string[]>}
	 */
	loadSomeTests: function (rootDir, languages) {
		var testSuite = {};
		var self = this;

		this.getSomeDirectories(rootDir, languages).forEach(
			function (language) {
				testSuite[language] = self.getAllFiles(path.join(rootDir, language));
			}
		);

		return testSuite;
	},


	/**
	 * Returns a list of all (sub)directories (just the directory names, not full paths)
	 * in the given src directory
	 *
	 * @param {string} src
	 * @returns {Array.<string>}
	 */
	getAllDirectories: function (src) {
		return fs.readdirSync(src).filter(
			function (file) {
				return fs.statSync(path.join(src, file)).isDirectory();
			}
		);
	},

	/**
	 * Returns a list of all (sub)directories (just the directory names, not full paths)
	 * in the given src directory, matching the given languages
	 *
	 * @param {string} src
	 * @param {string|string[]} languages
	 * @returns {Array.<string>}
	 */
	getSomeDirectories: function (src, languages) {
		var self = this;
		return fs.readdirSync(src).filter(
			function (file) {
				return fs.statSync(path.join(src, file)).isDirectory() && self.directoryMatches(file, languages);
			}
		);
	},

	/**
	 * Returns whether a directory matches one of the given languages.
	 * @param {string} directory
	 * @param {string|string[]} languages
	 */
	directoryMatches: function (directory, languages) {
		if (!Array.isArray(languages)) {
			languages = [languages];
		}
		var dirLanguages = directory.split(/!?\+!?/);
		return dirLanguages.some(function (lang) {
			return languages.indexOf(lang) >= 0;
		});
	},


	/**
	 * Returns a list of all full file paths to all files in the given src directory
	 *
	 * @private
	 * @param {string} src
	 * @returns {Array.<string>}
	 */
	getAllFiles: function (src) {
		return fs.readdirSync(src).filter(
			function (fileName) {
				return fs.statSync(path.join(src, fileName)).isFile();
			}
		).map(
			function (fileName) {
				return path.join(src, fileName);
			}
		);
	}
};
