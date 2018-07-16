# draxt.js
[`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) function is the main method of [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) package. The function
can be called with `new` as a constructor function (not recommended) and
without `new` as a factory function. [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) uses promisified [`glob`](https://github.com/isaacs/node-glob) package as it's
selector engine. All query results of [`glob`](https://github.com/isaacs/node-glob) package are converted into one of [`Node`](https://github.com/ramhejazi/draxt/blob/master/docs/Node.md)'s sub-class
([`File`](https://github.com/ramhejazi/draxt/blob/master/docs/File.md), [`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md) or [`SymbolicLink`](https://github.com/ramhejazi/draxt/blob/master/docs/SymbolicLink.md)) instances by analyzing pathNames' [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) object.
The returned value of [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) is a [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection
which to some extent works like jQuery collections but unlike jQuery collections it's not an array-like object.
The collection items are stored as an array property (`.items`).
### Syntax
```js
const draxtCollection = draxt(pathName [, stats]);
```
- `pattern` (`string `|` array.<node> `|` node `|` draxt`)&nbsp;&nbsp;–&nbsp;&nbsp;`pattern` parameter can contain several values:
  - `string` which is passed to [`glob`](https://github.com/isaacs/node-glob) package as [`glob`](https://github.com/isaacs/node-glob) pattern.
     In this case [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) returns a `promise` object representing a [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection/instance.
  - A [`Node`](https://github.com/ramhejazi/draxt/blob/master/docs/Node.md) or one it's sub-classes ([`File`](https://github.com/ramhejazi/draxt/blob/master/docs/File.md), [`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md) or [`SymbolicLink`](https://github.com/ramhejazi/draxt/blob/master/docs/SymbolicLink.md)) instance.
    In this case a [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection containing the passed `node` is returned.
  - An array of `node` instances.
  - A [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection to clone (shallow).
  - `undefined` which returns an empty [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.
- `options` (`object `|` string`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`glob`](https://github.com/isaacs/node-glob) package. The `options` parameter
can also be a string representing a pathName which will be used as context for the query,
similar to jQuery's [`$(selector, context)`](http://api.jquery.com/jQuery/#jQuery-selector-context) syntax.

```js
// /app
//  ├── controllers/
//  │   └── index.js
//  ├── public/
//  │   ├── script.js
//  │   └── style.css
//  └── views/
//      └── index.njk/

const draxt = require('draxt');
const Directory = draxt.Directory;
// Initialization with a glob pattern/selector.
// Which returns a `promise` object!
draxt('/app/**').then(draxtCollection => {
  // draxtCollection: →
  Draxt {
   length: [Getter],
   items: [
       Directory { pathName: '/app', ... }
       Directory { pathName: '/app/controllers', ... }
       File { pathName: '/app/controllers/index.js', ... }
       ...
   ]
});
const anEmpyDraxtCollection = draxt();
// A `draxt` collection with length of `1`
// Which has a manually created `Directory` instance.
const draxtCollection = draxt(new Directory('/app'));
```

→ `promise.<draxt> `|` draxt`
<br><br>
## Methods
#### [`draxt.sync(pattern [, options])`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L111)
- `pattern` (`string`)&nbsp;&nbsp;–&nbsp;&nbsp;Glob pattern.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`glob`](https://github.com/isaacs/node-glob) package.

Synchronously query the file system by using [`glob`](https://github.com/isaacs/node-glob) package and
return a new [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.

→ `draxt` An instance of [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md), a.k.a. a _draxt collection_.
<br><br>
#### [`draxt.extend(methods)`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L120)
- `methods` (`object`)

Extend [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) by adding methods to it's `prototype`. Basically works like `jQuery.fn.extend`.
<br><br>
#### [`draxtCollection.add(items)`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L134)
- `items` (`node `|` array.<node> `|` draxt`)&nbsp;&nbsp;–&nbsp;&nbsp;Instance of Node or array of nodes or a [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.

Add node(s) to current [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.
Pre-exising nodes will not be added to the collection.
```js
const draxtCollection = draxt();
draxtCollection.add(new Node('/pathName'));
draxtCollection.length // → 1
```

→ `draxt` An instance of [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md).
<br><br>
#### [`draxtCollection.get([index])`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L159)
- `index` (`number`)&nbsp;&nbsp;–&nbsp;&nbsp;Index of node in items collection.

Get one or all nodes from the [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.
With an `index` specified, `.get(index)` retrieves a single node otherwise
retrives all the nodes (if any).

→ `array.<node> `|` node `|` undefined`
<br><br>
#### [`draxtCollection.first()`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L170)
Get the first node (if any) from the collection.

→ `node `|` undefined`
<br><br>
#### [`draxtCollection.last()`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L178)
Get the last node (if any) from the collection.

→ `node `|` undefined`
<br><br>
#### [`draxtCollection.has(item)`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L199)
- `item` (`string `|` node`)&nbsp;&nbsp;–&nbsp;&nbsp;A [`Node`](https://github.com/ramhejazi/draxt/blob/master/docs/Node.md) instance or a `pathName`

Does the [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection has a node with specified pathName?
Note that `.has()` method doesn't work by checking if collection has a specific
[`Node`](https://github.com/ramhejazi/draxt/blob/master/docs/Node.md) instance. It checks whether collection has a node with the specified
pathName.
```js
// example fs structure
// └── app
//   ├── public
//   │   ├── script.js
//   │   └── style.css
const collection = draxtCollection.sync('/app/**');
draxtCollection.has('/app/public/script.js') // → true
draxtCollection.has(new Node('/app/public/script.js')) // → true
```

→ `boolean`
<br><br>
#### [`draxtCollection.slice([begin, end])`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L212)
- `begin` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;Zero-based index at which to begin extraction.
- `end` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;Zero-based index before which to end extraction. `slice` extracts up to but not including `end`.

Slice the collection and return a new [`Draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.
Uses `Array.prototype.slice`.

→ `draxt` A new [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection which contains sliced items.
<br><br>
#### [`draxtCollection.filter(callback [, thisArg])`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L224)
- `callback` (`function`)&nbsp;&nbsp;–&nbsp;&nbsp;A function to execute for each node.
- `thisArg` (`any`)&nbsp;&nbsp;–&nbsp;&nbsp;Value to use as `this` (i.e the reference Object) when executing callback.

Filter the collection's nodes and return a new [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.
Uses `Array.prototype.filter`.

→ `draxt` A new [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection which contains filtered items.
<br><br>
#### [`draxtCollection.forEach(callback [, thisArg])`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L237)
- `callback` (`function`)&nbsp;&nbsp;–&nbsp;&nbsp;A function to execute for each node.
- `thisArg` (`any`)&nbsp;&nbsp;–&nbsp;&nbsp;Value to use as `this` (i.e the reference Object) when executing callback.

Iterate over the [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection and execute a function for each
node. Uses `Array.prototype.forEach`.

→ `draxt` The current collection.
<br><br>
#### [`draxtCollection.each()`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L245)
Alias for `draxt.forEach`.
<br><br>
#### [`draxtCollection.map(callback [, thisArg])`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L255)
- `callback` (`function`)&nbsp;&nbsp;–&nbsp;&nbsp;A function to execute for each node.
- `thisArg` (`any`)&nbsp;&nbsp;–&nbsp;&nbsp;Value to use as `this` (i.e the reference Object) when executing callback.

Create an array with the results of calling a provided function on every
node in the [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.
Uses `Array.prototype.map`.

→ `array`
<br><br>
#### [`draxtCollection.mapAsync(fn [, thisArg])`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L266)
- `fn` (`function`)&nbsp;&nbsp;–&nbsp;&nbsp;A function to execute for each node.
- `thisArg` (`any`)&nbsp;&nbsp;–&nbsp;&nbsp;Value to use as `this` (i.e the reference Object) when executing callback.

Asynchronous version of `draxt.map`. The results of mapped array is passed
to `Promise.all` method.

→ `promise`
<br><br>
#### [`draxtCollection.some(fn)`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L277)
- `fn` (`function`)&nbsp;&nbsp;–&nbsp;&nbsp;A function to execute for each node.

Test whether at least one node in the collection passes the test implemented
by the provided function.
Uses `Array.prototype.some`.

→ `boolean`
<br><br>
#### [`draxtCollection.sort(callback)`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L287)
- `callback` (`function`)&nbsp;&nbsp;–&nbsp;&nbsp;A function that defines the sort order.

Sort the nodes of collection _in place_ and return the [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.
Uses `Array.prototype.sort`.

→ `draxt` Note that the collection is sorted _in place_, and no copy is made.
<br><br>
#### [`draxtCollection.reverse()`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L297)
Reverse the collection's nodes _in place_.
The first array element becomes the last, and the last array element becomes the first.

→ `draxt`
<br><br>
#### [`draxtCollection.directories()`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L307)
Filter directory nodes (instances of [`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md) class) and return a new
[`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.

→ `draxt`
<br><br>
#### [`draxtCollection.files()`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L317)
Filter file nodes (instances of [`File`](https://github.com/ramhejazi/draxt/blob/master/docs/File.md) class) and return a new [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.

→ `draxt`
<br><br>
#### [`draxtCollection.symlinks()`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L327)
Filter symbolic link nodes (instances of [`SymbolicLink`](https://github.com/ramhejazi/draxt/blob/master/docs/SymbolicLink.md) class) and return a new [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.

→ `draxt`
<br><br>
#### [`draxtCollection.empty()`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L337)
Empty the [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection. This method doesn't affect file system!

→ `draxt`
<br><br>
#### [`draxtCollection.drop(node)`](https://github.com/ramhejazi/draxt/blob/master/src/draxt.js#L348)
- `node` (`draxt `|` node `|` array.<(node|string)>`)&nbsp;&nbsp;–&nbsp;&nbsp;Accepts various paramters.

Remove node(s) from the current [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection by using `.pathName`s as the criterion.

→ `draxt`
<br><br>