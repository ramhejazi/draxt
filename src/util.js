/**
 * A simple utility object
 */
module.exports = {
	/**
	 * Get type of a variable
	 * @param {any} value
	 * @returns {string}
	 */
	getType(value) {
		return Object.prototype
			.toString
			.apply(value)
			.match(/\[object (\w+)\]/)[1]
			.toLowerCase();
	}
}
