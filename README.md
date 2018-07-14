<div align="center">
	<h1>draxt.js</h1>
	<a href="https://travis-ci.org/ramhejazi/draxt">
 		<img src="https://img.shields.io/travis/ramhejazi/draxt.svg">
	</a>
	<a href="https://www.npmjs.com/package/draxt">
		<img alt="draxt npm version" src="https://img.shields.io/npm/v/draxt.svg?style=flat-square">
	</a>
	<a href="https://www.npmjs.com/package/draxt">
		<img alt="draxt downloads count" src="https://img.shields.io/npm/dt/draxt.svg?style=flat-square">
	</a>
	<a href="https://coveralls.io/github/ramhejazi/draxt">
		<img alt="draxt coverage status" src="https://coveralls.io/repos/github/ramhejazi/draxt/badge.svg">
	</a>
	<a href="https://packagephobia.now.sh/badge?p=draxt">
		<img alt="draxt installation size" src="https://packagephobia.now.sh/badge?p=draxt">
	</a>
	<a href="https://github.com/ramhejazi/draxt/blob/master/LICENSE">
		<img alt="draxt license" src="https://img.shields.io/npm/l/draxt.svg">
	</a>
</div>
<br>

`draxt` is a jQuery-like utility module for selecting and manipulating file system's objects in node.js environment.
It uses [`glob`](https://en.wikipedia.org/wiki/Glob_(programming)) patterns as it's "selector engine". `draxt` also provides several DOM-like interfaces representing
file system's objects that use promisified [`fs`](https://nodejs.org/api/fs.html) module's APIs.

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
    .each(async (node) => {
      // `node` is instance of `File` class. Because it's a file!
      console.log(node instanceof $.File) // → `true`
      // Let's get contents of the node. `file.read` returns a promise object.
      const content = await node.read('utf8');
      // Let's use some synchronous methods!
      node.appendSync('\na new line!')
          .chmodSync('765');
  });
})();
```

**Key notes**:
 - `draxt` has 2 dependencies: [`glob`](https://github.com/isaacs/node-glob) and [`fs-extra`](https://github.com/jprichardson/node-fs-extra) modules.
 - `draxt` uses `glob` patterns for selecting file system objects.
 - Each item in `draxt` collections is an instance of [`File`](https://github.com/ramhejazi/draxt/blob/master/docs/File.md), [`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md), [`SymbolicLink`](https://github.com/ramhejazi/draxt/blob/master/docs/SymbolicLink.md) classes which are sub-classes of `Node` class.

## Install
 Installing via [npm](https://docs.npmjs.com/getting-started/what-is-npm):
 ```bash
 npm i draxt
 ```

 Via [yarn](https://yarnpkg.com/en/) package manager:
 ```bash
 yarn add draxt
 ```

## Docs
- [`draxt` APIs](https://github.com/ramhejazi/draxt/blob/master/docs/draxt.md)
- Interfaces
  - [`Node` class APIs](https://github.com/ramhejazi/draxt/blob/master/docs/Node.md)
  - [`File` class APIs](https://github.com/ramhejazi/draxt/blob/master/docs/File.md)
  - [`Directory` class APIs](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md)
  - [`SymbolicLink` class APIs](https://github.com/ramhejazi/draxt/blob/master/docs/SymbolicLink.md)

## Test
```bash
npm test
```

## License

[Licensed under MIT.](https://github.com/ramhejazi/draxt/blob/master/LICENSE)
