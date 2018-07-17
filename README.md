<div align="center">
	<h1>draxt.js</h1>
	<a href="https://travis-ci.org/ramhejazi/draxt">
 		<img src="https://img.shields.io/travis/ramhejazi/draxt.svg">
	</a>
	<a href="https://www.npmjs.com/package/draxt">
		<img alt="draxt npm version" src="https://img.shields.io/npm/v/draxt.svg?style=flat-square">
	</a>
	<a href="https://coveralls.io/github/ramhejazi/draxt">
		<img alt="draxt coverage status" src="https://coveralls.io/repos/github/ramhejazi/draxt/badge.svg">
	</a>
	<a href="https://github.com/ramhejazi/draxt/blob/master/LICENSE">
		<img alt="draxt license" src="https://img.shields.io/npm/l/draxt.svg">
	</a>
</div>
<br>

`draxt` is a utility module for selecting and manipulating filesystem objects in a Node.js environment.
It uses [`glob`](https://en.wikipedia.org/wiki/Glob_(programming)) patterns as its "selector engine". `draxt` also provides several DOM-like interfaces representing filesystem objects which build on promisified APIs for the [`fs`](https://nodejs.org/api/fs.html) and [`fs-extra`](https://github.com/jprichardson/node-fs-extra) modules.

> _draxt_ means _tree_ in the [Pahlavi language](https://en.wikipedia.org/wiki/Middle_Persian).

```html
/app
 ├── controllers/
 │   └── index.js
 ├── public/
 │   ├── script.js
 │   └── style.css
 └── views/
     └── index.njk/
```

```js
// Let's use a familiar variable name!
const $ = require('draxt')

(async () => {
  // Select `/app` directory contents and create a new `draxt` collection.
  const $app = await $('/app/**')
  $app
    // Let's filter js files:
    .filter(node => node.extension === 'js')
    // Now we have a new `draxt` collection with 2 nodes.
    .forEach(async (node, index, allNodes) => {
      // `node` is instance of `File` class. Because it's a file!
      console.log(node.pathName); // → `/app/controllers/index.js` for the first node!
      console.log(node instanceof $.File) // → `true`

      // Let's get contents of the node. `file.read` returns a promise object.
      const content = await node.read('utf8');
      // Let's use some synchronous methods!
      node.appendSync('\na new line!')
          .chmodSync('765')
          // move the file into another directory!
          .appendToSync('/hell'); // or `.moveTo('/hell')`

      console.log(node.pathName) // → '/hell/index.js' for the first node in the list!
  });
})();
```

**Key notes**:
 - `draxt` has only 2 dependencies: [`glob`](https://github.com/isaacs/node-glob) and [`fs-extra`](https://github.com/jprichardson/node-fs-extra) modules.
 - `draxt` uses `glob` patterns to select filesystem objects.
 - Each item in a `draxt` collection is an instance of a [`File`](https://github.com/ramhejazi/draxt/blob/master/docs/File.md), [`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md), or [`SymbolicLink`](https://github.com/ramhejazi/draxt/blob/master/docs/SymbolicLink.md) class, which is a subclass of [`Node`](https://github.com/ramhejazi/draxt/blob/master/docs/Node.md).
 - Every asynchronous method has a synchronous version. E.g., [`node.siblingsSync()`](https://github.com/ramhejazi/draxt/blob/master/docs/Node.md#nodesiblingssyncpattern-options) for `node.siblings()`.
 - `draxt` is a simple constructor function. You can extend/overwrite its methods via its `prototype` property (or its `fn` alias) or by using the [`draxt.extend`](https://github.com/ramhejazi/draxt/blob/master/docs/draxt.md#draxtextendmethods) method.
 
 ```js
 const draxt = require('draxt');
 // add a method (`images`) for filtering image files.
 draxt.fn.images = function() {
     const imgExtensions = ['jpeg', 'jpg', 'png', 'git', ...];
     return this.filter(node => {
        return node.isFile() && imgExtensions.indexOf(node.extension) > -1;
     })
 }
```

## Install

Installing via [npm](https://docs.npmjs.com/getting-started/what-is-npm):

```bash
$ npm i draxt
```

Via [yarn](https://yarnpkg.com/en/):

```bash
$ yarn add draxt
```

## Docs

- [`draxt` APIs](https://github.com/ramhejazi/draxt/blob/master/docs/draxt.md)
- Interfaces
  - [`Node`](https://github.com/ramhejazi/draxt/blob/master/docs/Node.md)
  - [`File`](https://github.com/ramhejazi/draxt/blob/master/docs/File.md)
  - [`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md)
  - [`SymbolicLink`](https://github.com/ramhejazi/draxt/blob/master/docs/SymbolicLink.md)

## Test

```bash
$ npm test
```

## License

[Licensed under MIT.](https://github.com/ramhejazi/draxt/blob/master/LICENSE)
