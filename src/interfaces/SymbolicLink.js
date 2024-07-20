const Node = require('./Node'),
    nodeProps = {
        nodeName: {value: 'SymbolicLink', writable: false, configurable: false, enumerable: true},
        NODE_TYPE: {value: 3, writable: false, configurable: false, enumerable: true},
    };

/**
 * `SymbolicLink` class which extends the `Node` class is an interface representing pathNames
 * that their `fs.Stats`'s `.isSymbolicLink()` method returns `true`.
 * @prop {string} nodeName Name of the node: `'SymbolicLink'`.
 * @prop {number} NODE_TYPE Code number for the node: `3`.
 */
class SymbolicLink extends Node {
    /**
     * Construct a new symbolic link.
     * @param {string} pathName Absolute pathName of the node
     * @param {object} [stats] Instance of `fs.Stats` for the node
     */
    constructor(nodePath, stats) {
        super(nodePath, stats);
        Object.defineProperties(this, nodeProps);
    }

    /**
     * Is the symlink broken?
     * @returns {promise<boolean>}
     */
    isBroken() {
        return this.readlink().then((linkPath) => {
            return this.exists(linkPath).then((ret) => !ret);
        });
    }

    /**
     * Synchronous version of `symbolicLink.isBroken` method.
     * @returns {boolean}
     */
    isBrokenSync() {
        return !this.existsSync(this.readlinkSync());
    }

    /**
     * Asynchronously read the value of the symbolic link.
     * Wrapper for `fs.readlink`.
     * @param {string|object} options Options for `fs.readlinkSync`.
     * @returns {promise<string|buffer>}
     */
    readlink(options) {
        return this.fs.readlink(this.pathName, options);
    }

    /**
     * Synchronously read the value of the symbolic link.
     * Wrapper for `fs.readlinkSync`.
     * @param {string|object} options Options for `fs.readlinkSync`.
     * @returns {string|buffer}
     */
    readlinkSync(options) {
        return this.fs.readlinkSync(this.pathName, options);
    }
}

module.exports = Node.SymbolicLink = SymbolicLink;
