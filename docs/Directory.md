# Interfaces / Directory
Extends [`Node`](https://github.com/ramhejazi/draxt/blob/master/docs/Node.md) | [Inherited methods](#inherited-methods-from-node)

[`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md) class which extends the [`Node`](https://github.com/ramhejazi/draxt/blob/master/docs/Node.md) class is an interface representing pathNames
that their [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats)'s `.isDirectory()` method returns `true`.
### Syntax
```js
const directory = new Directory(pathName [, stats]);
```
### Properties
- **`directory.nodeName`** (`string`)
Name of the node: `'Directory'`.

- **`directory.NODE_TYPE`** (`number`)
Code number for the node: `1`.

- **`directory.pathName`** (`string`)
Absolute pathName of the node. Example: `'/app/readme.md'`.

- **`directory.baseName`** (`string`)
baseName of the node. Example: `'readme.md'`.

- **`directory.name`** (`string`)
Name of the node without the possible extension. Example `'readme'`.

- **`directory.extension`** (`string`|`undefined`)
Extension of the node without `.`. Example: `'js'`.

- **`directory.parentPath`** (`string`)
pathName of the parent directory of the node.

- **`directory.rootPath`** (`string`)
Root path of the file system.

- **`directory._stats`** (`object`|`undefined`)
Cached instance of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.

- **`directory.fs`** (`object`)
Refers to [`fs-extra`](https://github.com/jprichardson/node-fs-extra) package.

- **`directory.glob`** (`object`)
Refers to [`glob`](https://github.com/isaacs/node-glob) package.

## Methods
#### [`directory.append(nodes [, options])`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#40)
- `nodes` (`draxt `|` node `|` string `|` array.<(node|string)>`)&nbsp;&nbsp;–&nbsp;&nbsp;Accepts various parameters:
    - [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.
    - a node instance.
    - pathNames of a file or directory.
    - array of node instances.
    - array of absolute pathNames of files/directories.
    - a mixed array of nodePaths and absolute pathNames of files/directories.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`fs-extra.move`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/move.md).

Append/move passed directories into this directory node.
Uses `node.moveTo` which uses [`fs-extra.move`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/move.md).

→ `promise.<nodes>` Promise representing array of moved nodes.
<br><br>
#### [`directory.appendSync(nodes [, options])`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#56)
- `nodes` (`draxt `|` array.<(node|string)> `|` string`)
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`fs-extra.move`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/move.md).

Synchronous version of `directory.append`.

→ `node` The `directory` node.
<br><br>
#### [`directory.children([pattern, options])`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#73)
- `pattern` (`string`)&nbsp;&nbsp;Default: `'*'`&nbsp;&nbsp;–&nbsp;&nbsp;Glob pattern relative to the directory. The pattern
is used against `baseName` of directory child nodes.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`glob`](https://github.com/isaacs/node-glob) package.

Asynchronously select children of the directory by using [`glob`](https://github.com/isaacs/node-glob) package and
return a [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.

→ `promise.<draxt>`
<br><br>
#### [`directory.childrenSync([selector, options])`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#90)
- `selector` (`string`)&nbsp;&nbsp;–&nbsp;&nbsp;Optional selector
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for glob package

Synchronous version of `directory.children`.

→ `draxt`
<br><br>
#### [`directory.empty()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#107)
Ensures that a directory is empty. Deletes directory contents if the directory
is not empty. If the directory does not exist, it is created.
The directory itself is not deleted.
Wrapper for [`fs-extra.emptyDir`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/emptyDir.md).

→ `promise`
<br><br>
#### [`directory.emptySync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#116)
Synchronous version of `directory.empty` method.
Wrapper for [`fs-extra.emptyDirSync`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/emptyDir-sync.md).

→ `node`
<br><br>
#### [`directory.ensure()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#127)
Asynchronously ensure directory exists.
Wrapper for [`fs-extra.ensureDir`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureDir.md).

→ `promise`
<br><br>
#### [`directory.ensureSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#136)
Synchronously ensure directory exists.
Wrapper for [`fs-extra.ensureDirSync`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureDir-sync.md).

→ `node`
<br><br>
#### [`directory.isEmpty()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#145)
Is directory empty?

→ `promise.<boolean>`
<br><br>
#### [`directory.isEmptySync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#155)
Synchronous version of `directory.isEmpty` method.

→ `boolean`
<br><br>
#### [`directory.find(pattern, options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#166)
- `pattern` (`string`)&nbsp;&nbsp;–&nbsp;&nbsp;Glob pattern.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`glob`](https://github.com/isaacs/node-glob) package.

Find matching decendants of the directory node.
Uses [`glob`](https://github.com/isaacs/node-glob) package.

→ `Promise.<draxt>`
<br><br>
#### [`directory.findSync(selector, options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#181)
- `selector` (`string`)
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`glob`](https://github.com/isaacs/node-glob) package.

Synchronous version of `directory.find` method.

→ `draxt`
<br><br>
#### [`directory.readdir(options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#194)
- `options` (`string `|` object`)

Wrapper for promisified [`fs.readdir`](https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback).

→ `promise`
<br><br>
#### [`directory.readdirSync(options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#203)
- `options` (`string `|` object`)

Wrapper for [`fs.readdirSync`](https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options).

→ `array`
<br><br>
#### [`directory.read(options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#212)
- `options` (`string `|` object`)

Alias for `directory.readdir` method.

→ `promise`
<br><br>
#### [`directory.readSync(options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#221)
- `options` (`string `|` object`)

Alias for `directory.readdirSync` method.

→ `array`
<br><br>
#### [`directory.rmdir()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#230)
Wrapper for promisified [`fs.rmdir`](https://nodejs.org/api/fs.html#fs_fs_rmdir_path_callback).
Deletes the directory, which must be empty.

→ `promise`
<br><br>
#### [`directory.rmdirSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Directory.js#240)
Wrapper for [`fs.rmdirSync`](https://nodejs.org/api/fs.html#fs_fs_rmdirsync_path).
Deletes the directory, which must be empty.

→ `node`
<br><br>
### Inherited Methods from [`Node`](https://github.com/ramhejazi/draxt/blob/master/docs/Node.md)
#### [`directory.getPathName()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#66)
Get the node's pathName.

→ `string`
<br><br>
#### [`directory.getBaseName()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#74)
Get the node's baseName.

→ `string`
<br><br>
#### [`directory.getExtension()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#82)
Get the node's extension.

→ `string`
<br><br>
#### [`directory.getName()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#91)
Get name of the node.
For [`File`](https://github.com/ramhejazi/draxt/blob/master/docs/File.md) nodes the `name` property is the name of file without possible extension.

→ `string`
<br><br>
#### [`directory.getParentPath()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#99)
Get the node's parent directory pathName.

→ `string`
<br><br>
#### [`directory.getCachedStats()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#109)
Get cached [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) instance for the node. Returns `undefined` when there
is no cached stats for the node. This happens only when the node is created
manually by user without passing a stats object.

→ `object `|` undefined`
<br><br>
#### [`directory.getStatProp(propName)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#122)
- `propName` (`string`)

Get a stat property's value from cached [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.
The method returns `undefined` when there is no cached stats.
```js
// Get `blksize` property of fs.Stats instance cached for the node.
const node_ctime = node.getStatProp('blksize');
```

→ `any`
<br><br>
#### [`directory.getAccessTime()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#130)
Get "access time" of the node. Returns [`atime`](https://nodejs.org/api/fs.html#fs_stats_atime) property of the cached stats.

→ `date`
<br><br>
#### [`directory.getModifiedTime()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#138)
Get "modified time" of the node. Returns [`mtime`](https://nodejs.org/api/fs.html#fs_stats_mtime) property of the cached stats.

→ `date`
<br><br>
#### [`directory.getBirthTime()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#146)
Get "birthday time" of the node. Returns [`birthtime`](https://nodejs.org/api/fs.html#fs_stats_birthtime) property of the cached stats.

→ `date`
<br><br>
#### [`directory.getChangeTime()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#154)
Get "change time" of the node. Returns [`ctime`](https://nodejs.org/api/fs.html#fs_stats_ctime) property of the cached stats.

→ `date`
<br><br>
#### [`directory.getSize()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#163)
Get size of the node.
Size is simply the `size` property of the cached [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) instance.

→ `number`
<br><br>
#### [`directory.isDirectory()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#171)
Is the node a directory?

→ `boolean`
<br><br>
#### [`directory.isFile()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#179)
Is the node a file?

→ `boolean`
<br><br>
#### [`directory.isSymbolicLink()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#187)
Is the node a symbolic link?

→ `boolean`
<br><br>
#### [`directory.isDotFile()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#195)
Is the node a dot file? i.e. does the node's name begin with dot character.

→ `boolean`
<br><br>
#### [`directory.renewStats()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#203)
Asynchronously renew stats of the node. Uses [`fs.lstat`](https://nodejs.org/api/fs.html#fs_fs_lstat_path_options_callback).

→ `promise` A fresh [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) instance for the node.
<br><br>
#### [`directory.renewStatsSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#215)
Synchronously renew stats of the node. Uses [`fs.lstatSync`](https://nodejs.org/api/fs.html#fs_fs_lstatsync_path_options).

→ `node`
<br><br>
#### [`directory.getOctalPermissions()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#227)
Get octal representation of the node's permissions.
```js
node.getOctalPermissions() // → "755"
```

→ `string`
<br><br>
#### [`directory.getPermissions()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#244)
Get permissions of the node for owner, group and others by converting `mode`
property of cached stats into an object.
```js
node.getPermissions()
// →
{
  read: { owner: true, group: true, others: false },
  write: { owner: true, group: true, others: false },
  execute: { owner: true, group: true, others: false }
}
```

→ `object`
<br><br>
#### [`directory.access([mode])`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#288)
- `mode` (`integer`)&nbsp;&nbsp;Default: `fs.constants.F_OK`

Asynchronously tests a user's permissions for the file or directory.
Wrapper for promisified [`fs.access`](https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback).
```js
// Check if the node is readable.
node.access(node.fs.constants.R_OK).then(() => {
  // node is readable
}).catch(e => {
  // node is not readable
});
```

→ `promise`
<br><br>
#### [`directory.accessSync([mode])`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#298)
- `mode` (`integer`)&nbsp;&nbsp;Default: `fs.constants.F_OK`

Wrapper for [`fs.accessSync`](https://nodejs.org/api/fs.html#fs_fs_accesssync_path_mode).

→ `node` this
<br><br>
#### [`directory.chmod(mode)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#308)
- `mode` (`integer`)

Wrapper for promisified [`fs.chmod`](https://nodejs.org/api/fs.html#fs_fs_chmod_path_mode_callback).

→ `promise`
<br><br>
#### [`directory.chmodSync(mode)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#318)
- `mode` (`integer`)

Wrapper for [`fs.chmodSync`](https://nodejs.org/api/fs.html#fs_fs_chmodsync_path_mode).

→ `node` this
<br><br>
#### [`directory.lchmod(mode)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#328)
- `mode` (`integer`)

Wrapper for promisified [`fs.lchmod`](https://nodejs.org/api/fs.html#fs_fs_lchmod_path_mode_callback).

→ `promise`
<br><br>
#### [`directory.lchmodSync(mode)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#338)
- `mode` (`integer`)

Wrapper for [`fs.lchmodSync`](https://nodejs.org/api/fs.html#fs_fs_lchmodsync_path_mode).

→ `node`
<br><br>
#### [`directory.chown(uid, gid)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#349)
- `uid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The user id
- `gid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The group id

Wrapper for promisified [`fs.chown`](https://nodejs.org/api/fs.html#fs_fs_chown_path_uid_gid_callback).

→ `promise`
<br><br>
#### [`directory.chownSync(uid, gid)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#360)
- `uid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The user id
- `gid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The group id

Wrapper for [`fs.chownSync`](https://nodejs.org/api/fs.html#fs_fs_chownsync_path_uid_gid).

→ `node` The file node
<br><br>
#### [`directory.lchown(uid, gid)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#371)
- `uid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The user id
- `gid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The group id

Wrapper for promisified [`fs.lchown`](https://nodejs.org/api/fs.html#fs_fs_lchown_path_uid_gid_callback).

→ `promise`
<br><br>
#### [`directory.lchownSync(uid, gid)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#382)
- `uid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The user id
- `gid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The group id

Wrapper for [`fs.lchownSync`](https://nodejs.org/api/fs.html#fs_fs_lchownsync_path_uid_gid).

→ `node` The file node
<br><br>
#### [`directory.exists()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#392)
Does node exist on file system?
Uses [`fs.access`](https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback) instead of the deprecated [`fs.exists`](https://nodejs.org/api/fs.html#fs_fs_exists_path_callback) method.

→ `promise.<boolean>`
<br><br>
#### [`directory.existsSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#403)
Does node exist on file system?
Wrapper for [`fs.existsSync`](https://nodejs.org/api/fs.html#fs_fs_existssync_path).

→ `boolean`
<br><br>
#### [`directory.stat()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#411)
Wrapper for promisified [`fs.stat`](https://nodejs.org/api/fs.html#fs_fs_stat_path_options_callback).

→ `promise` Promise representing instance of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.
<br><br>
#### [`directory.statSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#419)
Wrapper for [`fs.statSync`](https://nodejs.org/api/fs.html#fs_fs_statsync_path_options).

→ `object` Instance of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.
<br><br>
#### [`directory.lstat()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#427)
Wrapper for promisified [`fs.lstat`](https://nodejs.org/api/fs.html#fs_fs_lstat_path_options_callback).

→ `promise` Promise representing instance of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.
<br><br>
#### [`directory.lstatSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#435)
Wrapper for [`fs.lstatSync`](https://nodejs.org/api/fs.html#fs_fs_lstatsync_path_options).

→ `object` Instance of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.
<br><br>
#### [`directory.link(newPath)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#444)
- `newPath` (`string `|` Buffer `|` URL`)

Wrapper for promisified [`fs.link`](https://nodejs.org/api/fs.html#fs_fs_link_existingpath_newpath_callback).

→ `Promise`
<br><br>
#### [`directory.linkSync(newPath)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#454)
- `newPath` (`string `|` buffer `|` URL`)

Wrapper for [`fs.linkSync`](https://nodejs.org/api/fs.html#fs_fs_linksync_existingpath_newpath).

→ `node`
<br><br>
#### [`directory.rename(newPath)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#466)
- `newPath` (`string `|` Buffer `|` URL`)

Asynchronously rename node to the pathname provided as newPath.
In the case that `newPath` already exists, it will be overwritten.
Wrapper for promisified [`fs.rename`](https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback).

→ `promise`
<br><br>
#### [`directory.renameSync(newPath)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#478)
- `newPath` (`string `|` Buffer `|` URL`)

Wrapper for [`fs.renameSync`](https://nodejs.org/api/fs.html#fs_fs_renamesync_oldpath_newpath).

→ `node`
<br><br>
#### [`directory.utimes(atime, mtime)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#490)
- `atime` (`number `|` string `|` Date`)
- `mtime` (`number `|` string `|` Date`)

Wrapper for promisified [`fs.utimes`](https://nodejs.org/api/fs.html#fs_fs_utimes_path_atime_mtime_callback).

→ `promise`
<br><br>
#### [`directory.utimesSync(atime, mtime)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#501)
- `atime` (`number `|` string `|` Date`)
- `mtime` (`number `|` string `|` Date`)

Wrapper for [`fs.utimesSync`](https://nodejs.org/api/fs.html#fs_fs_utimessync_path_atime_mtime).

→ `node`
<br><br>
#### [`directory.copy(destPath, options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#522)
- `destPath` (`string`)&nbsp;&nbsp;–&nbsp;&nbsp;Destination path.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`fs-extra.copy`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md).

Asynchronously copy the node. [`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md) instances can have contents. Like `cp -r`.
When directory doesn't exist, it's created!
Wrapper for [`fs-extra.copy`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md).
```js
// creating a `File` instance. `File` class extends the `Node` class!
const file = new File('/app/resources/style.css');
file.copy('/app/backup/backup_style.css').then(() => {
  // file has been copied successfully!
}).catch(e => {
  // There was an error!
});
```

→ `promise`
<br><br>
#### [`directory.copySync(destPath, options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#533)
- `destPath` (`string`)&nbsp;&nbsp;–&nbsp;&nbsp;Destination path.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`fs-extra.copySync`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy-sync.md).

Wrapper for [`fs-extra.copySync`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy-sync.md).

→ `node`
<br><br>
#### [`directory.moveTo(targetDir, options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#557)
- `targetDir` (`object `|` string`)&nbsp;&nbsp;–&nbsp;&nbsp;[`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md) instance or absolute path of the target directory.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`fs-extra.move`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/move.md).

Move node to another location. `baseName` property of the node is joined
with `targetDir` param for resolving the final path for the node.
The method on success updates path-related properties of the node,
but node's cached stats (if any) is not refreshed!
For updating node's stats, user can call `node.renewStats()` or `node.renewStatsSync()`
methods after moving the node.
Uses [`fs-extra.move`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/move.md).
```js
const node = new File('/app/resources/style.css');
const dir = new Directory('/app/target_dir');
node.moveTo(dir || '/app/target_dir').then(() => {
  // node has been moved into '/app/target_dir' directory!
  node.getPathName(); // → '/app/target_dir/style.css'
});
```

→ `promise`
<br><br>
#### [`directory.moveToSync(targetDir, options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#580)
- `targetDir` (`object `|` string`)&nbsp;&nbsp;–&nbsp;&nbsp;[`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md) instance or absolute path of the target directory.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`fs-extra.move`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/move.md).

Synchronous version of `node.moveTo`.

→ `node`
<br><br>
#### [`directory.appendTo()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#590)
Alias for `node.moveTo`.
<br><br>
#### [`directory.appendToSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#599)
Alias for `node.moveToSync`.

→ `node`
<br><br>
#### [`directory.siblings([patten, options])`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#610)
- `patten` (`string`)&nbsp;&nbsp;Default: `'*'`&nbsp;&nbsp;–&nbsp;&nbsp;Optional [`glob`](https://github.com/isaacs/node-glob) pattern.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`glob`](https://github.com/isaacs/node-glob) package.

Asynchronously select siblings of the node.
Uses [`glob`](https://github.com/isaacs/node-glob) package.

→ `promise.<draxt>` Promise representing a [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.
<br><br>
#### [`directory.siblingsSync([pattern, options])`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#629)
- `pattern` (`string`)&nbsp;&nbsp;Default: `'*'`&nbsp;&nbsp;–&nbsp;&nbsp;Optional [`glob`](https://github.com/isaacs/node-glob) pattern.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`glob`](https://github.com/isaacs/node-glob) package.

Synchronously select siblings of the node.
Uses [`glob`](https://github.com/isaacs/node-glob) package.

→ `draxt` A [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.
<br><br>
#### [`directory.remove()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#645)
Remove the node from file system! [`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md) nodes can have contents. Like `rm -rf`.
Wrapper for [`fs-extra.remove`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/remove.md).

→ `promise`
<br><br>
#### [`directory.removeSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#654)
Wrapper for [`fs-extra.removeSync`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/remove-sync.md).

→ `node`
<br><br>
#### [`directory.parent()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#670)
Asynchronously get parent directory node of the node. It's an async method
as it gets an instance of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the parent node asynchronously!
```js
const file = new File('/app/resources/style.css');
file.parent().then(dir => {
  dir.isDirectory(); // → true
  dir.getPathName(); // → '/app/resources'
});
```

→ `promise.<node>` Promise representing a [`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md) instance.
<br><br>
#### [`directory.parentSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#681)
Synchronously get parent directory node of the node.

→ `node` A [`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md) instance.
<br><br>