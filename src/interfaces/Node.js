const path = require('path'),
    {glob, globSync} = require('glob'),
    fs = require('fs-extra'),
    minimatch = require('minimatch'),
    {getType} = require('../util'),
    assign = Object.assign;
// Default properies which are used for detecting node type.
const defaultNodeProps = {
    nodeName: {value: 'Node', writable: false, configurable: true, enumerable: true},
    NODE_TYPE: {value: 0, writable: false, configurable: true, enumerable: true},
};

/**
 * Node class is an interface that other classes representing
 * file system's nodes (like `File`, `Directory`, `SymbolicLink`, ...) inherit.
 * @prop {string} [nodeName='Node'] Default: `'Node'`. The name of constructor of the current node.
 * @prop {number} [NODE_TYPE=0] Default: `0`. Code number for the node.
 * @prop {string} pathName Absolute pathName of the node. Example: `'/app/readme.md'`.
 * @prop {string} baseName baseName of the node. Example: `'readme.md'`.
 * @prop {string} name Name of the node without the possible extension. Example `'readme'`.
 * @prop {string|undefined} extension Extension of the node without `.`. Example: `'js'`.
 * @prop {string} parentPath pathName of the parent directory of the node.
 * @prop {string} rootPath Root path of the file system.
 * @prop {object|undefined} _stats Cached instance of `fs.Stats` for the node.
 * @prop {object} fs Refers to `fs-extra` package.
 * @prop {object} glob Refers to `glob` package.
 */
class Node {
    /**
     * Construct a new node
     * @param {string} pathName Absolute pathName of the node
     * @param {object} [stats] Instance of `fs.Stats` for the node
     */
    constructor(pathName, stats) {
        this._stats = stats;
        Object.defineProperties(this, defaultNodeProps);
        this._setPathParams(pathName);
    }

    /**
     * Parse the node's pathName by using `path.parse()` method
     * and set the corresponsing node's properties.
     * @returns {undefined}
     */
    _setPathParams(nodePathname) {
        const {root, dir, name, ext, base} = path.parse(nodePathname);
        this.pathName = nodePathname;
        this.baseName = base;
        this.name = name;
        this.extension = ext.slice(1);
        this.rootPath = root;
        this.parentPath = dir;
    }

    /**
     * Get the node's pathName.
     * @returns {string}
     */
    getPathName() {
        return this.pathName;
    }

    /**
     * Get the node's baseName.
     * @returns {string}
     */
    getBaseName() {
        return this.baseName;
    }

    /**
     * Get the node's extension.
     * @returns {string}
     */
    getExtension() {
        return this.extension;
    }

    /**
     * Get name of the node.
     * For `File` nodes the `name` property is the name of file without possible extension.
     * @returns {string}
     */
    getName() {
        return this.name;
    }

    /**
     * Get the node's parent directory pathName.
     * @returns {string}
     */
    getParentPath() {
        return this.parentPath;
    }

    /**
     * Get cached `fs.Stats` instance for the node. Returns `undefined` when there
     * is no cached stats for the node. This happens only when the node is created
     * manually by user without passing a stats object.
     * @returns {object|undefined}
     */
    getCachedStats() {
        return this._stats;
    }

    /**
     * Get a stat property's value from cached `fs.Stats` for the node.
     * The method returns `undefined` when there is no cached stats.
     * @param {string} propName
     * @example
     * // Get `blksize` property of fs.Stats instance cached for the node.
     * const node_ctime = node.getStatProp('blksize');
     * @returns {any}
     */
    getStatProp(propName) {
        return (this._stats || {})[propName];
    }

    /**
     * Get "access time" of the node. Returns `atime` property of the cached stats.
     * @returns {date}
     */
    getAccessTime() {
        return this.getStatProp('atime');
    }

    /**
     * Get "modified time" of the node. Returns `mtime` property of the cached stats.
     * @returns {date}
     */
    getModifiedTime() {
        return this.getStatProp('mtime');
    }

    /**
     * Get "birthday time" of the node. Returns `birthtime` property of the cached stats.
     * @returns {date}
     */
    getBirthTime() {
        return this.getStatProp('birthtime');
    }

    /**
     * Get "change time" of the node. Returns `ctime` property of the cached stats.
     * @returns {date}
     */
    getChangeTime() {
        return this.getStatProp('ctime');
    }

    /**
     * Get size of the node.
     * Size is simply the `size` property of the cached `fs.Stats` instance.
     * @returns {number}
     */
    getSize() {
        return this.getStatProp('size');
    }

    /**
     * Is the node a directory?
     * @returns {boolean}
     */
    isDirectory() {
        return this.nodeName === 'Directory';
    }

    /**
     * Is the node a file?
     * @returns {boolean}
     */
    isFile() {
        return this.nodeName === 'File';
    }

    /**
     * Is the node a symbolic link?
     * @returns {boolean}
     */
    isSymbolicLink() {
        return this.nodeName === 'SymbolicLink';
    }

    /**
     * Is the node a dot file? i.e. does the node's name begin with dot character.
     * @returns {boolean}
     */
    isDotFile() {
        return this.baseName[0] === '.';
    }

    /**
     * Asynchronously renew stats of the node. Uses `fs.lstat`.
     * @returns {promise} A fresh `fs.Stats` instance for the node.
     */
    renewStats() {
        return this.fs.lstat(this.pathName).then((stats) => {
            this._stats = stats;
            return stats;
        });
    }

    /**
     * Synchronously renew stats of the node. Uses `fs.lstatSync`.
     * @chainable
     * @returns {node}
     */
    renewStatsSync() {
        const stat = this.lstatSync(this.pathName);
        this._stats = stat;
        return this;
    }

    /**
     * Get octal representation of the node's permissions.
     * @returns {string}
     * @example
     * node.getOctalPermissions() // → "755"
     */
    getOctalPermissions() {
        return (this._stats.mode & 0o777).toString(8);
    }

    /**
     * Get permissions of the node for owner, group and others by converting `mode`
     * property of cached stats into an object.
     * @example
     * node.getPermissions()
     * // →
     * {
     *   read: { owner: true, group: true, others: false },
     *   write: { owner: true, group: true, others: false },
     *   execute: { owner: true, group: true, others: false }
     * }
     * @returns {object}
     */
    getPermissions() {
        if (getType(this._stats) !== 'object') {
            throw new Error(
                'No valid cached stats ofr this node. Run `.renewStats()` before calling this function!'
            );
        }
        // Logic taken from npm `mode-to-permissions` module
        const mode = this._stats.mode,
            owner = mode >> 6,
            group = (mode << 3) >> 6,
            others = (mode << 6) >> 6;

        return {
            read: {
                owner: !!(owner & 4),
                group: !!(group & 4),
                others: !!(others & 4),
            },
            write: {
                owner: !!(owner & 2),
                group: !!(group & 2),
                others: !!(others & 2),
            },
            execute: {
                owner: !!(owner & 1),
                group: !!(group & 1),
                others: !!(others & 1),
            },
        };
    }

    /**
     * Asynchronously tests a user's permissions for the file or directory.
     * Wrapper for promisified `fs.access`.
     * @param {integer} [mode=fs.constants.F_OK]
     * @returns {promise}
     * @example
     * // Check if the node is readable.
     * node.access(node.fs.constants.R_OK).then(() => {
     *   // node is readable
     * }).catch(e => {
     *   // node is not readable
     * });
     */
    access(mode) {
        return this.fs.access(this.pathName, mode);
    }

    /**
     * Wrapper for `fs.accessSync`.
     * @chainable
     * @param {integer} [mode=fs.constants.F_OK]
     * @returns {node} this
     */
    accessSync(mode) {
        this.fs.accessSync(this.pathName, mode);
        return this;
    }

    /**
     * Wrapper for promisified `fs.chmod`.
     * @param {integer} mode
     * @returns {promise}
     */
    chmod(mode) {
        return this.fs.chmod(this.pathName, mode);
    }

    /**
     * Wrapper for `fs.chmodSync`.
     * @chainable
     * @param {integer} mode
     * @returns {node} this
     */
    chmodSync(mode) {
        this.fs.chmodSync(this.pathName, mode);
        return this;
    }

    /**
     * Wrapper for promisified `fs.lchmod`.
     * @param {integer} mode
     * @returns {promise}
     */
    lchmod(mode) {
        return this.fs.lchmod(this.pathName, mode);
    }

    /**
     * Wrapper for `fs.lchmodSync`.
     * @chainable
     * @param {integer} mode
     * @returns {node}
     */
    lchmodSync(mode) {
        this.fs.lchmodSync(this.pathName, mode);
        return this;
    }

    /**
     * Wrapper for promisified `fs.chown`.
     * @param {integer} uid The user id
     * @param {integer} gid The group id
     * @returns {promise}
     */
    chown(uid, gid) {
        return this.fs.chown(this.pathName, uid, gid);
    }

    /**
     * Wrapper for `fs.chownSync`.
     * @chainable
     * @param {integer} uid The user id
     * @param {integer} gid The group id
     * @returns {node} The file node
     */
    chownSync(uid, gid) {
        this.fs.chownSync(this.pathName, uid, gid);
        return this;
    }

    /**
     * Wrapper for promisified `fs.lchown`.
     * @param {integer} uid The user id
     * @param {integer} gid The group id
     * @returns {promise}
     */
    lchown(uid, gid) {
        return this.fs.lchown(this.pathName, uid, gid);
    }

    /**
     * Wrapper for `fs.lchownSync`.
     * @chainable
     * @param {integer} uid The user id
     * @param {integer} gid The group id
     * @returns {node} The file node
     */
    lchownSync(uid, gid) {
        this.fs.lchownSync(this.pathName, uid, gid);
        return this;
    }

    /**
     * Does node exist on file system?
     * Uses `fs.access` instead of the deprecated `fs.exists` method.
     * @returns {promise<boolean>}
     */
    exists() {
        return this.access(this.fs.constants.F_OK)
            .then(() => {
                return true;
            })
            .catch(() => false);
    }

    /**
     * Does node exist on file system?
     * Wrapper for `fs.existsSync`.
     * @returns {boolean}
     */
    existsSync() {
        return this.fs.existsSync(this.pathName);
    }

    /**
     * Wrapper for promisified `fs.stat`.
     * @returns {promise} Promise representing instance of `fs.Stats` for the node.
     */
    stat() {
        return this.fs.stat(this.pathName, ...arguments);
    }

    /**
     * Wrapper for `fs.statSync`.
     * @returns {object} Instance of `fs.Stats` for the node.
     */
    statSync() {
        return this.fs.statSync(this.pathName, ...arguments);
    }

    /**
     * Wrapper for promisified `fs.lstat`.
     * @returns {promise} Promise representing instance of `fs.Stats` for the node.
     */
    lstat() {
        return this.fs.lstat(this.pathName, ...arguments);
    }

    /**
     * Wrapper for `fs.lstatSync`.
     * @returns {object} Instance of `fs.Stats` for the node.
     */
    lstatSync() {
        return this.fs.lstatSync(this.pathName, ...arguments);
    }

    /**
     * Wrapper for promisified `fs.link`.
     * @param {string|Buffer|URL} newPath
     * @returns {Promise}
     */
    link(newPath) {
        return this.fs.link(this.pathName, newPath);
    }

    /**
     * Wrapper for `fs.linkSync`.
     * @chainable
     * @param {string|buffer|URL} newPath
     * @returns {node}
     */
    linkSync(newPath) {
        this.fs.linkSync(this.pathName, newPath);
        return this;
    }

    /**
     * Asynchronously rename node to the pathname provided as newPath.
     * In the case that `newPath` already exists, it will be overwritten.
     * Wrapper for promisified `fs.rename`.
     * @param newPath {string|Buffer|URL}
     * @returns {promise}
     */
    rename(newPath) {
        return this.fs.rename(this.pathName, ...arguments).then(() => {
            this._setPathParams(newPath);
        });
    }

    /**
     * Wrapper for `fs.renameSync`.
     * @chainable
     * @param newPath {string|Buffer|URL}
     * @returns {node}
     */
    renameSync(newPath) {
        this.fs.renameSync(this.pathName, newPath);
        this._setPathParams(newPath);
        return this;
    }

    /**
     * Wrapper for promisified `fs.utimes`.
     * @param atime {number|string|Date}
     * @param mtime {number|string|Date}
     * @returns {promise}
     */
    utimes() {
        return this.fs.utimes(this.pathName, ...arguments);
    }

    /**
     * Wrapper for `fs.utimesSync`.
     * @chainable
     * @param atime {number|string|Date}
     * @param mtime {number|string|Date}
     * @returns {node}
     */
    utimesSync() {
        this.fs.utimesSync(this.pathName, ...arguments);
        return this;
    }

    /**
     * Asynchronously copy the node. `Directory` instances can have contents. Like `cp -r`.
     * When directory doesn't exist, it's created!
     * Wrapper for `fs-extra.copy`.
     * @param {string} destPath Destination path.
     * @param {object} options Options for `fs-extra.copy`.
     * @returns {promise}
     * @example
     * // creating a `File` instance. `File` class extends the `Node` class!
     * const file = new File('/app/resources/style.css');
     * file.copy('/app/backup/backup_style.css').then(() => {
     *   // file has been copied successfully!
     * }).catch(e => {
     *   // There was an error!
     * });
     */
    copy() {
        return this.fs.copy(this.pathName, ...arguments);
    }

    /**
     * Wrapper for `fs-extra.copySync`.
     * @chainable
     * @param {string} destPath Destination path.
     * @param {object} options Options for `fs-extra.copySync`.
     * @returns {node}
     */
    copySync() {
        this.fs.copySync(this.pathName, ...arguments);
        return this;
    }

    /**
     * Move node to another location. `baseName` property of the node is joined
     * with `targetDir` param for resolving the final path for the node.
     * The method on success updates path-related properties of the node,
     * but node's cached stats (if any) is not refreshed!
     * For updating node's stats, user can call `node.renewStats()` or `node.renewStatsSync()`
     * methods after moving the node.
     * Uses `fs-extra.move`.
     * @param {object|string} targetDir `Directory` instance or absolute path of the target directory.
     * @param {object} options Options for `fs-extra.move`.
     * @return {promise}
     * @example
     * const node = new File('/app/resources/style.css');
     * const dir = new Directory('/app/target_dir');
     * node.moveTo(dir || '/app/target_dir').then(() => {
     *   // node has been moved into '/app/target_dir' directory!
     *   node.getPathName(); // → '/app/target_dir/style.css'
     * });
     */
    moveTo(targetDir, options) {
        const targetPath = this.__resolvePath(targetDir);
        if (typeof options === 'function') {
            throw new Error('`node.moveTo` doesn not accept a callback function!');
        }
        // Fix `fs.move` broken handling of optional parameters!
        const args = [this.pathName, targetPath];
        if (options) {
            args.push(options);
        }
        return this.fs.move(...args).then(() => {
            this._setPathParams(targetPath);
            return this;
        });
    }

    /**
     * Synchronous version of `node.moveTo`.
     * @chainable
     * @param {object|string} targetDir `Directory` instance or absolute path of the target directory.
     * @param {object} options Options for `fs-extra.move`.
     * @returns {node}
     */
    moveToSync(targetDir, options) {
        const targetPath = this.__resolvePath(targetDir);
        this.fs.moveSync(this.pathName, targetPath, options);
        this._setPathParams(targetPath);
        return this;
    }

    /**
     * Alias for `node.moveTo`.
     */
    appendTo() {
        return this.moveTo(...arguments);
    }

    /**
     * Alias for `node.moveToSync`.
     * @chainable
     * @returns {node}
     */
    appendToSync() {
        return this.moveToSync(...arguments);
    }

    /**
     * Asynchronously select siblings of the node.
     * Uses `glob` package.
     * @param {string} [patten='*'] Optional `glob` pattern.
     * @param {object} [options] Options for `glob` package.
     * @return {promise<draxt>} Promise representing a `draxt` collection.
     */
    siblings() {
        const {rawQuery, toNodes, Draxt} = Node;
        let [_options, filterFn] = this.__normalizeRelativeGlobOptions(...arguments);
        _options.ignore.push(this.pathName);
        return rawQuery('*', _options).then((items) => {
            if (filterFn) {
                items = items.filter(filterFn);
            }
            return toNodes(items).then(Draxt);
        });
    }

    /**
     * Synchronously select siblings of the node.
     * Uses `glob` package.
     * @param {string} [pattern='*'] Optional `glob` pattern.
     * @param {object} [options] Options for `glob` package.
     * @return {draxt} A `draxt` collection.
     */
    siblingsSync() {
        const {rawQuerySync, toNodesSync, Draxt} = Node;
        let [_options, filterFn] = this.__normalizeRelativeGlobOptions(...arguments);
        _options.ignore.push(this.pathName);
        let items = rawQuerySync('*', _options);
        if (filterFn) {
            items = items.filter(filterFn);
        }
        return new Draxt(toNodesSync(items));
    }

    /**
     * Remove the node from file system! `Directory` nodes can have contents. Like `rm -rf`.
     * Wrapper for `fs-extra.remove`.
     * @returns {promise}
     */
    remove() {
        return this.fs.remove(this.pathName, ...arguments);
    }

    /**
     * Wrapper for `fs-extra.removeSync`.
     * @chainable
     * @returns {node}
     */
    removeSync() {
        this.fs.removeSync(this.pathName, ...arguments);
        return this;
    }

    /**
     * Asynchronously get parent directory node of the node. It's an async method
     * as it gets an instance of `fs.Stats` for the parent node asynchronously!
     * @returns {promise<node>} Promise representing a `Directory` instance.
     * @example
     * const file = new File('/app/resources/style.css');
     * file.parent().then(dir => {
     *   dir.isDirectory(); // → true
     *   dir.getPathName(); // → '/app/resources'
     * });
     */
    parent() {
        const {Directory} = Node;
        return this.fs.lstat(this.parentPath).then((stats) => {
            return new Directory(this.parentPath, stats);
        });
    }

    /**
     * Synchronously get parent directory node of the node.
     * @returns {node} A `Directory` instance.
     */
    parentSync() {
        const {Directory} = Node;
        const stats = this.fs.lstatSync(this.parentPath);
        return new Directory(this.parentPath, stats);
    }

    /**
     * Asynchronously query the file system by using `glob` package.
     * @param {string} pattern Pattern for `glob` package.
     * @param {object} [options] Options for `glob` package.
     * @returns {promise<array>} An array of pathNames.
     */
    static rawQuery(pattern, options) {
        options = Node.__normalizeGlobOptions(options);
        return glob(pattern, options);
    }

    /**
     * Synchronously query the file system by using `glob` package.
     * @param {string} pattern Pattern for `glob` package.
     * @param {object} [options] Options for `glob` package.
     * @returns {array} An array of pathNames.
     */
    static rawQuerySync(pattern, options) {
        options = Node.__normalizeGlobOptions(options);
        return globSync(pattern, options);
    }

    /**
     * Convert array of paths to array of node instances asynchronously!
     * A node instance can be an instance of `File`, `Directory` or `SymbolicLink`.
     * @param {array} pathNames Array of pathNames.
     * @returns {promise<array>} Array of node instances.
     * @example
     * const pathNames = [
     *   '/app/resources',
     *   '/app/resources/style.css'
     * ];
     * Node.toNodes(pathNames).then(result => {
     *    // result:
     *    [
     *      Directory { pathName: '/app/resources', ... },
     *      File { pathName: '/app/resources/style.css', ... }
     *    ]
     * });
     */
    static toNodes(pathNames) {
        const nItems = [];
        const ps = pathNames.map((item, i) => {
            return fs.lstat(item).then((stats) => {
                nItems[i] = Node.__statsToNode(item, stats);
            });
        });
        return Promise.all(ps).then(() => nItems);
    }

    /**
     * Convert array of paths to array of nodes synchronously!
     * A node instance can be instance of `File`, `Directory` or `SymbolicLink`.
     * @param {array} pathNames Array of paths
     * @returns {array} Array of node instances.
     */
    static toNodesSync(pathNames) {
        return pathNames.map((item) => {
            const stats = fs.lstatSync(item);
            return Node.__statsToNode(item, stats);
        });
    }

    /**
     * Create a node object by analyzing `fs.Stats` of a pathName.
     * @param {string} pathName Absolute pathName of the node.
     * @param {object} stats Instance of `fs.Stats` for the pathName.
     * @returns {node}
     */
    static __statsToNode(pathName, stats) {
        const {File, Directory, SymbolicLink} = Node;
        if (stats.isFile()) {
            return new File(pathName, stats);
        } else if (stats.isDirectory()) {
            return new Directory(pathName, stats);
        } else if (stats.isSymbolicLink()) {
            return new SymbolicLink(pathName, stats);
        } else {
            return new Node(pathName, stats);
        }
    }

    /**
     * Asynchronously query the file system by using `glob` package.
     * @param {string} pattern A `glob` pattern.
     * @param {object} [options] Options for `glob` package.
     * @returns {promise<array>} Array of nodes.
     */
    static query() {
        const {rawQuery, toNodes} = Node;
        return rawQuery(...arguments).then(toNodes);
    }

    /**
     * Synchronously query the file system by using `glob` package.
     * @param {string} pattern
     * @param {object} [options] Options for `glob` package.
     * @returns {array} Array of nodes.
     */
    static querySync() {
        const {rawQuerySync, toNodesSync} = Node;
        return toNodesSync(rawQuerySync(...arguments));
    }

    /**
     * Normalize glob options. This function overrides some possible user-set
     * params like the `absolute` parameter.
     * @param {object} options
     * @returns {object} Normalized object
     */
    static __normalizeGlobOptions(options = {}) {
        const type = getType(options);
        if (type !== 'undefined' && ['string', 'object'].indexOf(type) === -1) {
            throw new Error('Optional `options` parameter must be either a string or an object!');
        }
        // query(pattern, context) syntax
        if (type === 'string') {
            options = {
                cwd: options,
            };
        }

        assign(options, {
            absolute: true,
        });

        return options;
    }

    /**
     * Normalize glob options for `Node#siblings` and `Node#siblingsSync` methods.
     * @param {string} [pattern] Optional pattern
     * @param {object} [options] Optional options
     * @return {array}
     */
    __normalizeRelativeGlobOptions(pattern, options = {}) {
        let filterFn;
        if (arguments.length === 1 && getType(pattern) === 'object') {
            options = pattern;
            pattern = undefined;
        }
        if (pattern && getType(pattern) !== 'string') {
            throw new Error('`pattern` parameter should be a string!');
        }
        if (getType(options) === 'string') {
            throw new Error('Relational queries do not accept `context` paramter!');
        }
        if (options && getType(options) !== 'object') {
            throw new Error('Invalid type for `options` parameter!');
        }

        // Convert `options.ignore` into an array (if it's not)
        let ignore = options.ignore;
        if (ignore) {
            if (!Array.isArray(ignore)) {
                ignore = [ignore];
            }
        } else {
            ignore = [];
        }
        options.ignore = ignore;

        // If `pattern` exists create a minimatch filter function
        if (pattern) {
            filterFn = minimatch.filter(pattern, {
                matchBase: true,
                dot: !!options.dot,
            });
        }

        const dirPath = this.nodeName === 'Directory' ? this.pathName : this.parentPath;

        assign(options, {
            cwd: dirPath,
        });

        return [options, filterFn];
    }

    /**
     * Make a pathName by joining `dir` parameter with node's `baseName`
     * @param {node|string} dir Instance of `Directory` class or a string pathName
     * @returns {string}
     */
    __resolvePath(dir) {
        const dirType = typeof dir;
        if (dirType === 'undefined') {
            throw new Error('`dir` parameter is required!');
        }
        const isDirectory = dir.nodeName === 'Directory';
        if (!isDirectory && dirType !== 'string') {
            throw new Error('`dir` parameter must be a string or instance of Directory class!');
        }
        const dirPath = isDirectory ? dir.pathName : dir;

        if (!path.isAbsolute(dirPath)) {
            throw new Error('`dir` must be an absolute path!');
        }
        return path.join(dirPath, this.baseName);
    }
}

Node.prototype.fs = fs;
Node.prototype.glob = glob;

module.exports = Node;
