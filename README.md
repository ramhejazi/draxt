<div align="center" style="text-align:center">
<a link="https://github.com/ramhejazi/draxt"><img width="300px" style="padding: 20px" alt="draxt.js logo" src="draxt-logo.svg"></a><br>
<a href="https://github.com/ramhejazi/draxt/blob/master/LICENSE"><img alt="draxt license" src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square"></a>
<a href="https://www.npmjs.com/package/draxt"><img alt="npm-link" src="https://img.shields.io/npm/v/draxt.svg?style=flat-square"></a>
<a href="https://coveralls.io/github/ramhejazi/draxt"><img alt="draxt coverage status" src="https://img.shields.io/coveralls/github/ramhejazi/draxt.svg?style=flat-square"></a>
</div>
<br>

`draxt` is a utility module for selecting and manipulating filesystem objects in a Node.js environment.
It uses [glob] patterns as its "selector engine". `draxt` also provides several DOM-like interfaces representing filesystem objects which build on promisified APIs for the [`fs`] and [`fs-extra`] modules.

**Example directory structure:**

```
/app/
 ├── controllers/
 │   └── index.js
 ├── public/
 │   ├── script.js
 │   └── style.css
 └── views/
     └── index.html
```

```js
const $ = require('draxt');

(async () => {
    // Select `/app` directory content and create a new `draxt` collection.
    const $app = await $('/app/**');
    $app
        // Let's filter js files:
        .filter((node) => node.extension === 'js')
        // Now we have a new `draxt` collection with 2 nodes.
        .forEach(async (node, index, allNodes) => {
            // `node` is instance of `File` class. Because it's a file!
            console.log(node.pathName);
            // → '/app/controllers/index.js' for the first node!

            console.log(node instanceof $.File); // → `true`

            // Let's get contents of the node. `file.read` returns a promise object.
            const content = await node.read('utf8');

            // Let's use some synchronous methods!
            node.appendSync('\na new line!')
                .chmodSync('765')
                // move the file into another directory!
                .appendToSync('/tmp'); // or `.moveToSync('/tmp')`

            console.log(node.pathName);
            // → '/hell/index.js' for the first node in the list!

            // get the parent directory of the node.
            // returns a `Directory` instance with the pathName of '/tmp'!
            const parentNode = node.parentSync(); // or `await node.parent()`

            // is the directory empty?
            console.log(parentNode.isEmptySync()); // → `false`
        });
})();
```

**Key notes**:

-   `draxt` has only 2 dependencies: [`glob`] and [`fs-extra`] modules.
-   `draxt` uses `glob` patterns to select filesystem objects.
-   Each item in a `draxt` collection is an instance of a [`File`], [`Directory`], or [`SymbolicLink`] class, which is a subclass of [`Node`].
-   Every asynchronous method has a synchronous version. E.g., [`node.siblingsSync()`] for [`node.siblings()`].
-   `draxt` is a simple constructor function. You can extend/overwrite its methods via its `prototype` property (or its `fn` alias) or by using the [`draxt.extend`] method.

```js
const draxt = require('draxt');
// Add a method (`images`) for filtering image files.
draxt.fn.images = function() {
    const imgExtensions = ['jpeg', 'jpg', 'png', 'git', ...];
    return this.filter(node => {
       return node.isFile() && imgExtensions.indexOf(node.extension) > -1;
    });
}
```

## Install

Installing via [npm]:

```bash
$ npm i draxt
```

Via [yarn]:

```bash
$ yarn add draxt
```

## Docs

-   [`draxt` APIs][draxt-doc]
-   Interfaces
    -   [`Node`]
    -   [`File`]
    -   [`Directory`]
    -   [`SymbolicLink`]

## Test

```bash
$ npm test
```

## License

[Licensed under MIT.][license]

[repo]: https://github.com/ramhejazi/draxt
[logo]: draxt-logo.jpg
[license]: https://github.com/ramhejazi/draxt/blob/master/LICENSE
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[coverall]: https://coveralls.io/github/ramhejazi/draxt
[coverall-badge]: https://img.shields.io/coveralls/github/ramhejazi/draxt.svg?style=flat-square
[npm-link]: https://www.npmjs.com/package/draxt
[npm-badge]: https://img.shields.io/npm/v/draxt.svg?style=flat-square
[travis-link]: https://travis-ci.org/ramhejazi/draxt
[travis-badge]: https://img.shields.io/travis/ramhejazi/draxt.svg?style=flat-square
[deps-status-link]: https://david-dm.org/ramhejazi/draxt
[deps-status-badge]: https://david-dm.org/ramhejazi/draxt.svg?style=flat-square
[npm]: https://docs.npmjs.com/getting-started/what-is-npm
[yarn]: https://yarnpkg.com/en/
[glob]: https://en.wikipedia.org/wiki/Glob_(programming)
[`fs`]: https://nodejs.org/api/fs.html
[`fs-extra`]: https://github.com/jprichardson/node-fs-extra
[`glob`]: https://github.com/isaacs/node-glob
[Pahlavi language]: https://en.wikipedia.org/wiki/Middle_Persian
[draxt-doc]: https://ramhejazi.github.io/draxt#draxt
[`Node`]: https://ramhejazi.github.io/draxt#interfaces-node
[`File`]: https://ramhejazi.github.io/draxt#interfaces-file
[`Directory`]: https://ramhejazi.github.io/draxt#interfaces-directory
[`SymbolicLink`]: https://ramhejazi.github.io/draxt#interfaces-symboliclink
[`draxt.extend`]: https://ramhejazi.github.io/draxt#draxt-extend
[`node.siblingsSync()`]: https://ramhejazi.github.io/draxt#node-siblings
[`node.siblings()`]: https://ramhejazi.github.io/draxt#node-siblings
