"use strict";

var TestDiscovery = require("./helper/test-discovery");
var TestCase = require("./helper/test-case");
var path = require("path");
var argv = require("yargs").argv;

var testSuite;
if (argv.language) {
	testSuite = TestDiscovery.loadSomeTests(__dirname + "/languages", argv.language);
} else {
	// load complete test suite
	testSuite = TestDiscovery.loadAllTests(__dirname + "/languages");
}

// define tests for all tests in all languages in the test suite
for (var language in testSuite) {
	if (!testSuite.hasOwnProperty(language)) {
		continue;
	}

	(function (language, testFiles) {
		describe("Testing language '" + language + "'", function () {
			this.timeout(10000);

			testFiles.forEach(
				function (filePath) {
			        var fileName = path.basename(filePath, path.extname(filePath));

			        it("– should pass test case '" + fileName + "'",
			            function () {

				            if (path.extname(filePath) === '.test') {
					            TestCase.runTestCase(language, filePath);
				            } else {
					            TestCase.runTestsWithHooks(language, require(filePath));
				            }

			            }
			        );
				}
			);
		});
	})(language, testSuite[language]);
}