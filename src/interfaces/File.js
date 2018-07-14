const Node = require('./Node');

const nodeProps = {
	'nodeName' : { value: 'File', writable: false, configurable: false, enumerable: true },
	'NODE_TYPE': { value: 2, writable: false, configurable: false }
}

/**
 * `File` class which extends the `Node` class is an interface representing pathNames
 * that their `fs.Stats`'s `.isFile()` method returns `true`.
 * @prop {string} nodeName Name of the node: `'File'`.
 * @prop {number} NODE_TYPE Code number for the node: `2`.
 */
class File extends Node {
	/**
	 * Construct a new file.
	 * @param {string} pathName Absolute pathName of the node
	 * @param {object} [stats] Instance of `fs.Stats` for the node
	 */
	constructor(pathName, stats) {
		super(pathName, stats);
		Object.defineProperties(this, nodeProps);
	}

	/**
	 * Ensure the file node exists on file system.
	 * Wrapper for `fs-extra.ensureFile`.
	 * @returns {promise}
	 */
	ensure() {
		return this.fs.ensureFile(this.pathName);
	}

	/**
	 * Ensure the file node exists on file system synchronously.
	 * Wrapper for `fs.ensureFileSync`.
	 * @returns {node}
	 */
	ensureSync() {
		this.fs.ensureFileSync(this.pathName);
		return this;
	}

	/**
	 * Asynchronously append data to a file, creating the file if it does not yet exist. `data` can be a string or a Buffer.
	 * Wrapper for `fs.appendFile`.
	 * @returns {promise}
	 */
	append() {
		return this.fs.appendFile(this.pathName, ...arguments);
	}

	/**
	 * Wrapper for `fs.appendFileSync`.
	 * @returns {node}
	 */
	appendSync() {
		this.fs.appendFileSync(this.pathName, ...arguments);
		return this;
	}

	/**
	 * Promisified wrapper for `fs.readFile`.
	 * @returns {promise} Promise object representing contents of the file.
	 */
	read() {
		return this.fs.readFile(this.pathName, ...arguments);
	}

	/**
	 * Wrapper for `fs.readFileSync`.
	 * @returns {any}
	 */
	readSync() {
		return this.fs.readFileSync(this.pathName, ...arguments);
	}

	/**
	 * Promisified wrapper for `fs.truncate`
	 * @returns {promise}
	 */
	truncate() {
		return this.fs.truncate(this.pathName, ...arguments);
	}

	/**
	 * Wrapper for `fs.truncateSync`.
	 * @returns {node}
	 */
	truncateSync() {
		this.fs.truncateSync(this.pathName, ...arguments);
		return this;
	}

	/**
	 * Promisified `fs.writeFile`
	 * @returns {promise}
	 */
	write() {
		return this.fs.writeFile(this.pathName, ...arguments);
	}

	/**
	 * Wrapper for `fs.writeFileSync`.
	 * @chainable
	 * @returns {node}
	 */
	writeSync() {
		this.fs.writeFileSync(this.pathName, ...arguments);
		return this;
	}

}

module.exports = Node.File = File;
