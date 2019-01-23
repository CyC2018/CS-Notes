"use strict";


module.exports = {
	/**
	 * Simplifies the token stream to ease the matching with the expected token stream.
	 *
	 * * Strings are kept as-is
	 * * In arrays each value is transformed individually
	 * * Values that are empty (empty arrays or strings only containing whitespace)
	 *
	 *
	 * @param {Array} tokenStream
	 * @returns {Array.<string[]|Array>}
	 */
	simplify: function (tokenStream) {
		if (Array.isArray(tokenStream)) {
			return tokenStream
				.map(this.simplify.bind(this))
				.filter(function (value) {
					return !(Array.isArray(value) && !value.length) && !(typeof value === "string" && !value.trim().length);
				}
			);
		}
		else if (typeof tokenStream === "object") {
			return [tokenStream.type, this.simplify(tokenStream.content)];
		}
		else {
			return tokenStream;
		}
	}
};
