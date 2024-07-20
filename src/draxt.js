/*eslint no-irregular-whitespace: ["error", { "skipComments": true }]*/

const {Node} = require('./interfaces');
const assign = Object.assign;
const {getType} = require('./util');
const define = Object.defineProperty;
const lengthProps = {
    get() {
        return this.items.length;
    },
    enumerable: true,
    configurable: true,
};

/**
 * `draxt` function is the main method of `draxt` package. The function
 * can be called with `new` as a constructor function (not recommended) and
 * without `new` as a factory function. `draxt` uses promisified `glob` package as it's
 * selector engine. All query results of `glob` package are converted into one of `Node`'s sub-class
 * (`File`, `Directory` or `SymbolicLink`) instances by analyzing pathNames' `fs.Stats` object.
 * The returned value of `draxt` is a `draxt` collection
 * which to some extent works like jQuery collections but unlike jQuery collections it's not an array-like object.
 * The collection items are stored as an array property (`.items`).
 * @prop {array} items Items of the collection.
 * @prop {number} length Lenght of collection's items.
 * @param {string|array<node>|node|draxt} [pattern] `pattern` parameter can contain several values:
 *   - `string` which is passed to `glob` package as `glob` pattern.
 *      In this case `draxt` returns a `promise` object representing a `draxt` collection/instance.
 *   - A `Node` or one it's sub-classes (`File`, `Directory` or `SymbolicLink`) instance.
 *     In this case a `draxt` collection containing the passed `node` is returned.
 *   - An array of `node` instances.
 *   - A `draxt` collection to clone (shallow).
 *   - `undefined` which returns an empty `draxt` collection.
 * @param {object|string} [options] Options for `glob` package. The `options` parameter
 * can also be a string representing a pathName which will be used as context for the query,
 * similar to jQuery's `$(selector, context)` syntax.
 * @returns {promise<draxt>|draxt}
 * @example
 * // /app
 * //  ├── controllers/
 * //  │   └── index.js
 * //  ├── public/
 * //  │   ├── script.js
 * //  │   └── style.css
 * //  └── views/
 * //      └── index.njk/
 *
 * const draxt = require('draxt');
 * const Directory = draxt.Directory;
 * // Initialization with a glob pattern/selector.
 * // Which returns a `promise` object!
 * draxt('/app/**').then(draxtCollection => {
 *   // draxtCollection: →
 *   Draxt {
 *    length: [Getter],
 *    items: [
 *        Directory { pathName: '/app', ... }
 *        Directory { pathName: '/app/controllers', ... }
 *        File { pathName: '/app/controllers/index.js', ... }
 *        ...
 *    ]
 * });
 * const anEmpyDraxtCollection = draxt();
 * // A `draxt` collection with length of `1`
 * // Which has a manually created `Directory` instance.
 * const draxtCollection = draxt(new Directory('/app'));
 */
function Draxt(pattern, options = {}) {
    // If `this` is not a Draxt instance, create a Draxt instance.
    if (this instanceof Draxt !== true) {
        return new Draxt(...arguments);
    }
    // Define dynamic `length` property.
    define(this, 'length', lengthProps);
    // `items` refers to collection's node.
    this.items = [];

    if (getType(pattern) === 'undefined') {
        return this;
    }

    if (pattern instanceof Node || Array.isArray(pattern)) {
        this.add(pattern);
        return this;
    }

    if (pattern instanceof Draxt) {
        this.items = pattern.get().slice();
        return this;
    }

    return Node.query(pattern, options).then((items) => {
        return this.add(items);
    });
}

Node.Draxt = Draxt;
Draxt.Node = Node;
Draxt.File = Node.File;
Draxt.Directory = Node.Directory;
Draxt.SymbolicLink = Node.SymbolicLink;
Draxt.fn = Draxt.prototype;

/**
 * Synchronously query the file system by using `glob` package and
 * return a new `draxt` collection.
 * @param {string} pattern Glob pattern.
 * @param {object} [options] Options for `glob` package.
 * @returns {draxt} An instance of `draxt`, a.k.a. a _draxt collection_.
 */
Draxt.sync = function () {
    const items = Node.querySync(...arguments);
    return new Draxt(items);
};

/**
 * Extend `draxt` by adding methods to it's `prototype`. Basically works like `jQuery.fn.extend`.
 * @param {object} methods
 */
Draxt.extend = function (methods) {
    assign(Draxt.fn, methods);
};

/**
 * Add node(s) to current `draxt` collection.
 * Pre-exising nodes will not be added to the collection.
 * @param {node|array<node>|draxt} items Instance of Node or array of nodes or a `draxt` collection.
 * @returns {draxt} An instance of `draxt`.
 * @example
 * const draxtCollection = draxt();
 * draxtCollection.add(new Node('/pathName'));
 * draxtCollection.length // → 1
 */
Draxt.prototype.add = function (items) {
    if (items instanceof Draxt) {
        items = items.get();
    }
    const nodes = Array.isArray(items) ? items.slice() : [items];
    nodes.forEach((node) => {
        if (!(node instanceof Node)) {
            throw new Error(
                'Invalid value for `items` parameter. `draxt` collection can only have Node instances. ' +
                    'The given value is a(n) ' +
                    getType(node) +
                    '!'
            );
        }
        const has = this.has(node);
        if (!has) this.items.push(node);
    });
    return this;
};

/**
 * Get one or all nodes from the `draxt` collection.
 * With an `index` specified, `.get(index)` retrieves a single node otherwise
 * retrives all the nodes (if any).
 * @param {number} [index] - Index of node in items collection.
 * @returns {array<node>|node|undefined}
 */
Draxt.prototype.get = function (index) {
    if (typeof index === 'undefined') {
        return this.items;
    }
    return this.items[index];
};

/**
 * Get the first node (if any) from the collection.
 * @returns {node|undefined}
 */
Draxt.prototype.first = function () {
    return this.items[0];
};

/**
 * Get the last node (if any) from the collection.
 * @returns {node|undefined}
 */
Draxt.prototype.last = function () {
    return this.items[this.items.length - 1];
};

/**
 * Does the `draxt` collection has a node with specified pathName?
 * Note that `.has()` method doesn't work by checking if collection has a specific
 * `Node` instance. It checks whether collection has a node with the specified
 * pathName.
 * @param {string|node} item A `Node` instance or a `pathName`
 * @returns {boolean}
 * @example
 * // example fs structure
 * // └── app
 * //   ├── public
 * //   │   ├── script.js
 * //   │   └── style.css
 * const collection = draxtCollection.sync('/app/**');
 * draxtCollection.has('/app/public/script.js') // → true
 * draxtCollection.has(new Node('/app/public/script.js')) // → true
 */
Draxt.prototype.has = function (item) {
    const pathName = item instanceof Node ? item.pathName : item;
    const found = this.items.some((node) => node.pathName === pathName);
    return found;
};

/**
 * Slice the collection and return a new `Draxt` collection.
 * Uses `Array.prototype.slice`.
 * @param {integer} [begin] Zero-based index at which to begin extraction.
 * @param {integer} [end] Zero-based index before which to end extraction. `slice` extracts up to but not including `end`.
 * @returns {draxt} A new `draxt` collection which contains sliced items.
 */
Draxt.prototype.slice = function () {
    let sItems = this.items.slice(...arguments);
    return new Draxt(sItems);
};

/**
 * Filter the collection's nodes and return a new `draxt` collection.
 * Uses `Array.prototype.filter`.
 * @param {function} callback A function to execute for each node.
 * @param {any} [thisArg] Value to use as `this` (i.e the reference Object) when executing callback.
 * @returns {draxt} A new `draxt` collection which contains filtered items.
 */
Draxt.prototype.filter = function () {
    let fItems = this.items.filter(...arguments);
    return new Draxt(fItems);
};

/**
 * Iterate over the `draxt` collection and execute a function for each
 * node. Uses `Array.prototype.forEach`.
 * @chainable
 * @param {function} callback A function to execute for each node.
 * @param {any} [thisArg] Value to use as `this` (i.e the reference Object) when executing callback.
 * @returns {draxt} The current collection.
 */
Draxt.prototype.forEach = function () {
    this.items.forEach(...arguments);
    return this;
};

/**
 * Alias for `draxt.forEach`.
 */
Draxt.prototype.each = Draxt.prototype.forEach;

/**
 * Create an array with the results of calling a provided function on every
 * node in the `draxt` collection.
 * Uses `Array.prototype.map`.
 * @param {function} callback A function to execute for each node.
 * @param {any} [thisArg] Value to use as `this` (i.e the reference Object) when executing callback.
 * @returns {array}
 */
Draxt.prototype.map = function () {
    return this.items.map(...arguments);
};

/**
 * Asynchronous version of `draxt.map`. The results of mapped array is passed
 * to `Promise.all` method.
 * @param {function} fn A function to execute for each node.
 * @param {any} [thisArg] Value to use as `this` (i.e the reference Object) when executing callback.
 * @returns {promise}
 */
Draxt.prototype.mapAsync = function () {
    return Promise.all(this.items.map(...arguments));
};

/**
 * Test whether at least one node in the collection passes the test implemented
 * by the provided function.
 * Uses `Array.prototype.some`.
 * @param {function} fn A function to execute for each node.
 * @returns {boolean}
 */
Draxt.prototype.some = function () {
    return this.items.some(...arguments);
};

/**
 * Sort the nodes of collection _in place_ and return the `draxt` collection.
 * Uses `Array.prototype.sort`.
 * @param {function} callback A function that defines the sort order.
 * @returns {draxt} Note that the collection is sorted _in place_, and no copy is made.
 */
Draxt.prototype.sort = function (fn) {
    this.items.sort(fn);
    return this;
};

/**
 * Reverse the collection's nodes _in place_.
 * The first array element becomes the last, and the last array element becomes the first.
 * @returns {draxt}
 */
Draxt.prototype.reverse = function () {
    this.items.reverse();
    return this;
};

/**
 * Filter directory nodes (instances of `Directory` class) and return a new
 * `draxt` collection.
 * @returns {draxt}
 */
Draxt.prototype.directories = function () {
    return this.filter((el) => {
        return el.isDirectory();
    });
};

/**
 * Filter file nodes (instances of `File` class) and return a new `draxt` collection.
 * @returns {draxt}
 */
Draxt.prototype.files = function () {
    return this.filter((el) => {
        return el.isFile();
    });
};

/**
 * Filter symbolic link nodes (instances of `SymbolicLink` class) and return a new `draxt` collection.
 * @returns {draxt}
 */
Draxt.prototype.symlinks = function () {
    return this.filter((el) => {
        return el.isSymbolicLink();
    });
};

/**
 * Empty the `draxt` collection. This method doesn't affect file system!
 * @returns {draxt}
 */
Draxt.prototype.empty = function () {
    this.items = [];
    return this;
};

/**
 * Remove node(s) from the current `draxt` collection by using `.pathName`s as the criterion.
 * @chainable
 * @param {draxt|node|array<node|string>} node Accepts various paramters.
 * @return {draxt}
 */
Draxt.prototype.drop = function (node) {
    let nodes;
    if (node instanceof Node) {
        nodes = [node];
    } else if (node instanceof Draxt) {
        nodes = node.get();
    } else if (getType(node) === 'string') {
        nodes = [node];
    } else if (Array.isArray(node)) {
        nodes = node;
    } else {
        throw new Error('Invalid paramter passed to `.drop()` method');
    }
    const pathNames = nodes.map((item) => {
        if (typeof item === 'string') {
            return item;
        }
        return item.pathName;
    });
    this.items = this.items.filter((node) => {
        return pathNames.indexOf(node.pathName) === -1;
    });
    return this;
};

module.exports = Draxt;
