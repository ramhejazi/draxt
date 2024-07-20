const Node = require('./Node'),
    {getType} = require('../util');

const nodeProps = {
    nodeName: {value: 'Directory', writable: false, configurable: false, enumerable: true},
    NODE_TYPE: {value: 1, writable: false, configurable: false, enumerable: true},
};

/**
 * `Directory` class which extends the `Node` class is an interface representing pathNames
 * that their `fs.Stats`'s `.isDirectory()` method returns `true`.
 * @prop {string} nodeName Name of the node: `'Directory'`.
 * @prop {number} NODE_TYPE Code number for the node: `1`.
 */
class Directory extends Node {
    /**
     * Construct a new node
     * @param {string} pathName Absolute pathName of the node
     * @param {object} [stats] Instance of `fs.Stats` for the node
     */
    constructor(pathName, stats) {
        super(pathName, stats);
        Object.defineProperties(this, nodeProps);
    }

    /**
     * Append/move passed directories into this directory node.
     * Uses `node.moveTo` which uses `fs-extra.move`.
     * @param {draxt|node|string|array<node|string>} nodes Accepts various parameters:
     *     - `draxt` collection.
     *     - a node instance.
     *     - pathNames of a file or directory.
     *     - array of node instances.
     *     - array of absolute pathNames of files/directories.
     *     - a mixed array of nodePaths and absolute pathNames of files/directories.
     * @param {object} [options] Options for `fs-extra.move`.
     * @returns {promise<nodes>} Promise representing array of moved nodes.
     */
    append(nodes, options) {
        nodes = this.constructor.__normalizeAppendNodes(nodes);
        const mvPromices = nodes.map((node) => {
            node = node instanceof Node ? node : new Node(node);
            return node.moveTo(this, options);
        });
        return Promise.all(mvPromices).then(() => this);
    }

    /**
     * Synchronous version of `directory.append`.
     * @chainable
     * @param {draxt|array<node|string>|string} nodes
     * @param {object} [options] Options for `fs-extra.move`.
     * @returns {node} The `directory` node.
     */
    appendSync(nodes, options) {
        nodes = this.constructor.__normalizeAppendNodes(nodes);
        nodes.forEach((node) => {
            node = node instanceof Node ? node : new Node(node);
            return node.moveToSync(this, options);
        });
        return this;
    }

    /**
     * Asynchronously select children of the directory by using `glob` package and
     * return a `draxt` collection.
     * @param {string} [pattern='*'] Glob pattern relative to the directory. The pattern
     * is used against `baseName` of directory child nodes.
     * @param {object} [options] Options for `glob` package.
     * @returns {promise<draxt>}
     */
    children() {
        const {rawQuery, toNodes, Draxt} = Node;
        let [options, filterFn] = this.__normalizeRelativeGlobOptions(...arguments);
        return rawQuery('*', options).then((items) => {
            if (filterFn) {
                items = items.filter(filterFn);
            }
            return toNodes(items).then(Draxt);
        });
    }

    /**
     * Synchronous version of `directory.children`.
     * @param {string} [selector] Optional selector
     * @param {object} [options] Options for glob package
     * @returns {draxt}
     */
    childrenSync() {
        const {rawQuerySync, toNodesSync, Draxt} = Node;
        let [_options, filterFn] = this.__normalizeRelativeGlobOptions(...arguments);
        let items = rawQuerySync('*', _options);
        if (filterFn) {
            items = items.filter(filterFn);
        }
        return new Draxt(toNodesSync(items));
    }

    /**
     * Ensures that a directory is empty. Deletes directory contents if the directory
     * is not empty. If the directory does not exist, it is created.
     * The directory itself is not deleted.
     * Wrapper for `fs-extra.emptyDir`.
     * @returns {promise}
     */
    empty() {
        return this.fs.emptyDir(this.pathName);
    }

    /**
     * Synchronous version of `directory.empty` method.
     * Wrapper for `fs-extra.emptyDirSync`.
     * @returns {node}
     */
    emptySync() {
        this.fs.emptyDirSync(this.pathName);
        return this;
    }

    /**
     * Asynchronously ensure directory exists.
     * Wrapper for `fs-extra.ensureDir`.
     *@returns {promise}
     */
    ensure() {
        return this.fs.ensureDir(this.pathName);
    }

    /**
     * Synchronously ensure directory exists.
     * Wrapper for `fs-extra.ensureDirSync`.
     * @returns {node}
     */
    ensureSync() {
        this.fs.ensureDirSync(this.pathName);
        return this;
    }

    /**
     * Is directory empty?
     * @returns {promise<boolean>}
     */
    isEmpty() {
        return this.readdir().then((files) => {
            return files.length === 0;
        });
    }

    /**
     * Synchronous version of `directory.isEmpty` method.
     * @returns {boolean}
     */
    isEmptySync() {
        return this.readdirSync().length === 0;
    }

    /**
     * Find matching decendants of the directory node.
     * Uses `glob` package.
     * @param {string} pattern Glob pattern.
     * @param {object} options Options for `glob` package.
     * @returns {Promise<draxt>}
     */
    find(selector, options) {
        const {Draxt} = Node;
        options = Node.__normalizeGlobOptions(options);
        options.cwd = this.pathName;
        return Node.query(selector, options).then((items) => {
            return new Draxt(items);
        });
    }

    /**
     * Synchronous version of `directory.find` method.
     * @param {string} selector
     * @param {object} options Options for `glob` package.
     * @returns {draxt}
     */
    findSync(selector, options) {
        const {Draxt} = Node;
        options = Node.__normalizeGlobOptions(options);
        options.cwd = this.pathName;
        const items = Node.querySync(selector, options);
        return new Draxt(items);
    }

    /**
     * Wrapper for promisified `fs.readdir`.
     * @param {string|object} options
     * @returns {promise}
     */
    readdir() {
        return this.fs.readdir(this.pathName, ...arguments);
    }

    /**
     * Wrapper for `fs.readdirSync`.
     * @param {string|object} options
     * @returns {array}
     */
    readdirSync() {
        return this.fs.readdirSync(this.pathName, ...arguments);
    }

    /**
     * Alias for `directory.readdir` method.
     * @param {string|object} options
     * @returns {promise}
     */
    read() {
        return this.readdir(...arguments);
    }

    /**
     * Alias for `directory.readdirSync` method.
     * @param {string|object} options
     * @returns {array}
     */
    readSync() {
        return this.readdirSync(...arguments);
    }

    /**
     * Wrapper for promisified `fs.rmdir`.
     * Deletes the directory, which must be empty.
     * @returns {promise}
     */
    rmdir() {
        return this.fs.rmdir(this.pathName);
    }

    /**
     * Wrapper for `fs.rmdirSync`.
     * Deletes the directory, which must be empty.
     * @chainable
     * @returns {node}
     */
    rmdirSync() {
        this.fs.rmdirSync(this.pathName);
        return this;
    }

    static __normalizeAppendNodes(nodes) {
        const {Draxt} = Node;
        if (nodes instanceof Draxt) {
            nodes = nodes.get();
        } else if (nodes instanceof Node) {
            nodes = [nodes];
        } else if (getType(nodes) === 'string') {
            nodes = [nodes];
        } else if (getType(nodes) !== 'array') {
            throw new Error(`Invalid parameter for \`nodes\` parameter: ${nodes}`);
        }
        return nodes;
    }
}

module.exports = Node.Directory = Directory;
