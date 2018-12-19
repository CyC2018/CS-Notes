"use strict";

var fs = require("fs");
var assert = require("chai").assert;
var PrismLoader = require("./prism-loader");
var TokenStreamTransformer = require("./token-stream-transformer");

/**
 * Handles parsing of a test case file.
 *
 *
 * A test case file consists of at least two parts, separated by a line of dashes.
 * This separation line must start at the beginning of the line and consist of at least three dashes.
 *
 * The test case file can either consist of two parts:
 *
 *     {source code}
 *     ----
 *     {expected token stream}
 *
 *
 * or of three parts:
 *
 *     {source code}
 *     ----
 *     {expected token stream}
 *     ----
 *     {text comment explaining the test case}
 *
 * If the file contains more than three parts, the remaining parts are just ignored.
 * If the file however does not contain at least two parts (so no expected token stream),
 * the test case will later be marked as failed.
 *
 *
 * @type {{runTestCase: Function, transformCompiledTokenStream: Function, parseTestCaseFile: Function}}
 */
module.exports = {

	/**
	 * Runs the given test case file and asserts the result
	 *
	 * The passed language identifier can either be a language like "css" or a composed language
	 * identifier like "css+markup". Composed identifiers can be used for testing language inclusion.
	 *
	 * When testing language inclusion, the first given language is the main language which will be passed
	 * to Prism for highlighting ("css+markup" will result in a call to Prism to highlight with the "css" grammar).
	 * But it will be ensured, that the additional passed languages will be loaded too.
	 *
	 * The languages will be loaded in the order they were provided.
	 *
	 * @param {string} languageIdentifier
	 * @param {string} filePath
	 */
	runTestCase: function (languageIdentifier, filePath) {
		var testCase = this.parseTestCaseFile(filePath);
		var usedLanguages = this.parseLanguageNames(languageIdentifier);

		if (null === testCase) {
			throw new Error("Test case file has invalid format (or the provided token stream is invalid JSON), please read the docs.");
		}

		var Prism = PrismLoader.createInstance(usedLanguages.languages);
		// the first language is the main language to highlight
		var mainLanguageGrammar = Prism.languages[usedLanguages.mainLanguage];
		var env = {
			code: testCase.testSource,
			grammar: mainLanguageGrammar,
			language: usedLanguages.mainLanguage
		};
		Prism.hooks.run('before-tokenize', env);
		env.tokens = Prism.tokenize(env.code, env.grammar);
		Prism.hooks.run('after-tokenize', env);
		var compiledTokenStream = env.tokens;

		var simplifiedTokenStream = TokenStreamTransformer.simplify(compiledTokenStream);

		var tzd = JSON.stringify( simplifiedTokenStream ); var exp = JSON.stringify( testCase.expectedTokenStream );
		var i = 0; var j = 0; var diff = "";
		while ( j < tzd.length ){ if (exp[i] != tzd[j] || i == exp.length) diff += tzd[j]; else i++; j++; }

		// var message = "\nToken Stream: \n" + JSON.stringify( simplifiedTokenStream, null, " " ) + 
		var message = "\nToken Stream: \n" + tzd + 
			"\n-----------------------------------------\n" +
			"Expected Token Stream: \n" + exp +
			"\n-----------------------------------------\n" + diff;

		var result = assert.deepEqual(simplifiedTokenStream, testCase.expectedTokenStream, testCase.comment + message);
	},


	/**
	 * Parses the language names and finds the main language.
	 *
	 * It is either the last language or the language followed by a exclamation mark “!”.
	 * There should only be one language with an exclamation mark.
	 *
	 * @param {string} languageIdentifier
	 *
	 * @returns {{languages: string[], mainLanguage: string}}
	 */
	parseLanguageNames: function (languageIdentifier) {
		var languages = languageIdentifier.split("+");
		var mainLanguage = null;

		languages = languages.map(
			function (language) {
				var pos = language.indexOf("!");

				if (-1 < pos) {
					if (mainLanguage) {
						throw "There are multiple main languages defined.";
					}

					mainLanguage = language.replace("!", "");
					return mainLanguage;
				}

				return language;
			}
		);

		if (!mainLanguage) {
			mainLanguage = languages[languages.length-1];
		}

		return {
			languages: languages,
			mainLanguage: mainLanguage
		};
	},


	/**
	 * Parses the test case from the given test case file
	 *
	 * @private
	 * @param {string} filePath
	 * @returns {{testSource: string, expectedTokenStream: Array.<Array.<string>>, comment:string?}|null}
	 */
	parseTestCaseFile: function (filePath) {
		var testCaseSource = fs.readFileSync(filePath, "utf8");
		var testCaseParts = testCaseSource.split(/^-{10,}\w*$/m);

		try {
			var testCase = {
				testSource: testCaseParts[0].trim(),
				expectedTokenStream: JSON.parse(testCaseParts[1]),
				comment: null
			};

			// if there are three parts, the third one is the comment
			// explaining the test case
			if (testCaseParts[2]) {
				testCase.comment = testCaseParts[2].trim();
			}

			return testCase;
		}
		catch (e) {
			// the JSON can't be parsed (e.g. it could be empty)
			return null;
		}
	},

	/**
	 * Runs the given pieces of codes and asserts their result.
	 *
	 * Code is provided as the key and expected result as the value.
	 *
	 * @param {string} languageIdentifier
	 * @param {object} codes
	 */
	runTestsWithHooks: function (languageIdentifier, codes) {
		var usedLanguages = this.parseLanguageNames(languageIdentifier);
		var Prism = PrismLoader.createInstance(usedLanguages.languages);
		// the first language is the main language to highlight

		for (var code in codes) {
			if (codes.hasOwnProperty(code)) {
				var env = {
					element: {},
					language: usedLanguages.mainLanguage,
					grammar: Prism.languages[usedLanguages.mainLanguage],
					code: code
				};
				Prism.hooks.run('before-highlight', env);
				env.highlightedCode = Prism.highlight(env.code, env.grammar, env.language);
				Prism.hooks.run('before-insert', env);
				env.element.innerHTML = env.highlightedCode;
				Prism.hooks.run('after-highlight', env);
				Prism.hooks.run('complete', env);
				assert.equal(env.highlightedCode, codes[code]);
			}
		}
	}
};
