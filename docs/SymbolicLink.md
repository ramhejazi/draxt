# Interfaces / SymbolicLink
Extends [`Node`](https://github.com/ramhejazi/draxt/blob/master/docs/Node.md) | [Inherited methods](#inherited-methods-from-node)

[`SymbolicLink`](https://github.com/ramhejazi/draxt/blob/master/docs/SymbolicLink.md) class which extends the [`Node`](https://github.com/ramhejazi/draxt/blob/master/docs/Node.md) class is an interface representing pathNames
that their [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats)'s `.isSymbolicLink()` method returns `true`.
### Syntax
```js
const symbolicLink = new SymbolicLink(pathName [, stats]);
```
### Properties
- **`symbolicLink.nodeName`** (`string`)
Name of the node: `'SymbolicLink'`.

- **`symbolicLink.NODE_TYPE`** (`number`)
Code number for the node: `3`.

- **`symbolicLink.pathName`** (`string`)
Absolute pathName of the node. Example: `'/app/readme.md'`.

- **`symbolicLink.baseName`** (`string`)
baseName of the node. Example: `'readme.md'`.

- **`symbolicLink.name`** (`string`)
Name of the node without the possible extension. Example `'readme'`.

- **`symbolicLink.extension`** (`string`|`undefined`)
Extension of the node without `.`. Example: `'js'`.

- **`symbolicLink.parentPath`** (`string`)
pathName of the parent directory of the node.

- **`symbolicLink.rootPath`** (`string`)
Root path of the file system.

- **`symbolicLink._stats`** (`object`|`undefined`)
Cached instance of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.

- **`symbolicLink.fs`** (`object`)
Refers to [`fs-extra`](https://github.com/jprichardson/node-fs-extra) package.

- **`symbolicLink.glob`** (`object`)
Refers to [`glob`](https://github.com/isaacs/node-glob) package.

## Methods
#### [`symbolicLink.isBroken()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/SymbolicLink.js#29)
Is the symlink broken?

→ `promise.<boolean>`
<br><br>
#### [`symbolicLink.isBrokenSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/SymbolicLink.js#39)
Synchronous version of `symbolicLink.isBroken` method.

→ `boolean`
<br><br>
#### [`symbolicLink.readlink(options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/SymbolicLink.js#49)
- `options` (`string `|` object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`fs.readlinkSync`](https://nodejs.org/api/fs.html#fs_fs_readlinksync_path_options).

Asynchronously read the value of the symbolic link.
Wrapper for [`fs.readlink`](https://nodejs.org/api/fs.html#fs_fs_readlink_path_options_callback).

→ `promise.<(string|buffer)>`
<br><br>
#### [`symbolicLink.readlinkSync(options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/SymbolicLink.js#59)
- `options` (`string `|` object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`fs.readlinkSync`](https://nodejs.org/api/fs.html#fs_fs_readlinksync_path_options).

Synchronously read the value of the symbolic link.
Wrapper for [`fs.readlinkSync`](https://nodejs.org/api/fs.html#fs_fs_readlinksync_path_options).

→ `string `|` buffer`
<br><br>
### Inherited Methods from [`Node`](https://github.com/ramhejazi/draxt/blob/master/docs/Node.md)
#### [`symbolicLink.getPathName()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#66)
Get the node's pathName.

→ `string`
<br><br>
#### [`symbolicLink.getBaseName()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#74)
Get the node's baseName.

→ `string`
<br><br>
#### [`symbolicLink.getExtension()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#82)
Get the node's extension.

→ `string`
<br><br>
#### [`symbolicLink.getName()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#91)
Get name of the node.
For [`File`](https://github.com/ramhejazi/draxt/blob/master/docs/File.md) nodes the `name` property is the name of file without possible extension.

→ `string`
<br><br>
#### [`symbolicLink.getParentPath()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#99)
Get the node's parent directory pathName.

→ `string`
<br><br>
#### [`symbolicLink.getCachedStats()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#109)
Get cached [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) instance for the node. Returns `undefined` when there
is no cached stats for the node. This happens only when the node is created
manually by user without passing a stats object.

→ `object `|` undefined`
<br><br>
#### [`symbolicLink.getStatProp(propName)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#122)
- `propName` (`string`)

Get a stat property's value from cached [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.
The method returns `undefined` when there is no cached stats.
```js
// Get `blksize` property of fs.Stats instance cached for the node.
const node_ctime = node.getStatProp('blksize');
```

→ `any`
<br><br>
#### [`symbolicLink.getAccessTime()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#130)
Get "access time" of the node. Returns [`atime`](https://nodejs.org/api/fs.html#fs_stats_atime) property of the cached stats.

→ `date`
<br><br>
#### [`symbolicLink.getModifiedTime()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#138)
Get "modified time" of the node. Returns [`mtime`](https://nodejs.org/api/fs.html#fs_stats_mtime) property of the cached stats.

→ `date`
<br><br>
#### [`symbolicLink.getBirthTime()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#146)
Get "birthday time" of the node. Returns [`birthtime`](https://nodejs.org/api/fs.html#fs_stats_birthtime) property of the cached stats.

→ `date`
<br><br>
#### [`symbolicLink.getChangeTime()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#154)
Get "change time" of the node. Returns [`ctime`](https://nodejs.org/api/fs.html#fs_stats_ctime) property of the cached stats.

→ `date`
<br><br>
#### [`symbolicLink.getSize()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#163)
Get size of the node.
Size is simply the `size` property of the cached [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) instance.

→ `number`
<br><br>
#### [`symbolicLink.isDirectory()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#171)
Is the node a directory?

→ `boolean`
<br><br>
#### [`symbolicLink.isFile()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#179)
Is the node a file?

→ `boolean`
<br><br>
#### [`symbolicLink.isSymbolicLink()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#187)
Is the node a symbolic link?

→ `boolean`
<br><br>
#### [`symbolicLink.isDotFile()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#195)
Is the node a dot file? i.e. does the node's name begin with dot character.

→ `boolean`
<br><br>
#### [`symbolicLink.renewStats()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#203)
Asynchronously renew stats of the node. Uses [`fs.lstat`](https://nodejs.org/api/fs.html#fs_fs_lstat_path_options_callback).

→ `promise` A fresh [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) instance for the node.
<br><br>
#### [`symbolicLink.renewStatsSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#215)
Synchronously renew stats of the node. Uses [`fs.lstatSync`](https://nodejs.org/api/fs.html#fs_fs_lstatsync_path_options).

→ `node`
<br><br>
#### [`symbolicLink.getOctalPermissions()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#227)
Get octal representation of the node's permissions.
```js
node.getOctalPermissions() // → "755"
```

→ `string`
<br><br>
#### [`symbolicLink.getPermissions()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#244)
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
#### [`symbolicLink.access([mode])`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#288)
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
#### [`symbolicLink.accessSync([mode])`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#298)
- `mode` (`integer`)&nbsp;&nbsp;Default: `fs.constants.F_OK`

Wrapper for [`fs.accessSync`](https://nodejs.org/api/fs.html#fs_fs_accesssync_path_mode).

→ `node` this
<br><br>
#### [`symbolicLink.chmod(mode)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#308)
- `mode` (`integer`)

Wrapper for promisified [`fs.chmod`](https://nodejs.org/api/fs.html#fs_fs_chmod_path_mode_callback).

→ `promise`
<br><br>
#### [`symbolicLink.chmodSync(mode)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#318)
- `mode` (`integer`)

Wrapper for [`fs.chmodSync`](https://nodejs.org/api/fs.html#fs_fs_chmodsync_path_mode).

→ `node` this
<br><br>
#### [`symbolicLink.lchmod(mode)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#328)
- `mode` (`integer`)

Wrapper for promisified [`fs.lchmod`](https://nodejs.org/api/fs.html#fs_fs_lchmod_path_mode_callback).

→ `promise`
<br><br>
#### [`symbolicLink.lchmodSync(mode)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#338)
- `mode` (`integer`)

Wrapper for [`fs.lchmodSync`](https://nodejs.org/api/fs.html#fs_fs_lchmodsync_path_mode).

→ `node`
<br><br>
#### [`symbolicLink.chown(uid, gid)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#349)
- `uid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The user id
- `gid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The group id

Wrapper for promisified [`fs.chown`](https://nodejs.org/api/fs.html#fs_fs_chown_path_uid_gid_callback).

→ `promise`
<br><br>
#### [`symbolicLink.chownSync(uid, gid)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#360)
- `uid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The user id
- `gid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The group id

Wrapper for [`fs.chownSync`](https://nodejs.org/api/fs.html#fs_fs_chownsync_path_uid_gid).

→ `node` The file node
<br><br>
#### [`symbolicLink.lchown(uid, gid)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#371)
- `uid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The user id
- `gid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The group id

Wrapper for promisified [`fs.lchown`](https://nodejs.org/api/fs.html#fs_fs_lchown_path_uid_gid_callback).

→ `promise`
<br><br>
#### [`symbolicLink.lchownSync(uid, gid)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#382)
- `uid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The user id
- `gid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The group id

Wrapper for [`fs.lchownSync`](https://nodejs.org/api/fs.html#fs_fs_lchownsync_path_uid_gid).

→ `node` The file node
<br><br>
#### [`symbolicLink.exists()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#392)
Does node exist on file system?
Uses [`fs.access`](https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback) instead of the deprecated [`fs.exists`](https://nodejs.org/api/fs.html#fs_fs_exists_path_callback) method.

→ `promise.<boolean>`
<br><br>
#### [`symbolicLink.existsSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#403)
Does node exist on file system?
Wrapper for [`fs.existsSync`](https://nodejs.org/api/fs.html#fs_fs_existssync_path).

→ `boolean`
<br><br>
#### [`symbolicLink.stat()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#411)
Wrapper for promisified [`fs.stat`](https://nodejs.org/api/fs.html#fs_fs_stat_path_options_callback).

→ `promise` Promise representing instance of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.
<br><br>
#### [`symbolicLink.statSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#419)
Wrapper for [`fs.statSync`](https://nodejs.org/api/fs.html#fs_fs_statsync_path_options).

→ `object` Instance of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.
<br><br>
#### [`symbolicLink.lstat()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#427)
Wrapper for promisified [`fs.lstat`](https://nodejs.org/api/fs.html#fs_fs_lstat_path_options_callback).

→ `promise` Promise representing instance of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.
<br><br>
#### [`symbolicLink.lstatSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#435)
Wrapper for [`fs.lstatSync`](https://nodejs.org/api/fs.html#fs_fs_lstatsync_path_options).

→ `object` Instance of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.
<br><br>
#### [`symbolicLink.link(newPath)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#444)
- `newPath` (`string `|` Buffer `|` URL`)

Wrapper for promisified [`fs.link`](https://nodejs.org/api/fs.html#fs_fs_link_existingpath_newpath_callback).

→ `Promise`
<br><br>
#### [`symbolicLink.linkSync(newPath)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#454)
- `newPath` (`string `|` buffer `|` URL`)

Wrapper for [`fs.linkSync`](https://nodejs.org/api/fs.html#fs_fs_linksync_existingpath_newpath).

→ `node`
<br><br>
#### [`symbolicLink.rename(newPath)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#466)
- `newPath` (`string `|` Buffer `|` URL`)

Asynchronously rename node to the pathname provided as newPath.
In the case that `newPath` already exists, it will be overwritten.
Wrapper for promisified [`fs.rename`](https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback).

→ `promise`
<br><br>
#### [`symbolicLink.renameSync(newPath)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#478)
- `newPath` (`string `|` Buffer `|` URL`)

Wrapper for [`fs.renameSync`](https://nodejs.org/api/fs.html#fs_fs_renamesync_oldpath_newpath).

→ `node`
<br><br>
#### [`symbolicLink.utimes(atime, mtime)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#490)
- `atime` (`number `|` string `|` Date`)
- `mtime` (`number `|` string `|` Date`)

Wrapper for promisified [`fs.utimes`](https://nodejs.org/api/fs.html#fs_fs_utimes_path_atime_mtime_callback).

→ `promise`
<br><br>
#### [`symbolicLink.utimesSync(atime, mtime)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#501)
- `atime` (`number `|` string `|` Date`)
- `mtime` (`number `|` string `|` Date`)

Wrapper for [`fs.utimesSync`](https://nodejs.org/api/fs.html#fs_fs_utimessync_path_atime_mtime).

→ `node`
<br><br>
#### [`symbolicLink.copy(destPath, options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#522)
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
#### [`symbolicLink.copySync(destPath, options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#533)
- `destPath` (`string`)&nbsp;&nbsp;–&nbsp;&nbsp;Destination path.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`fs-extra.copySync`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy-sync.md).

Wrapper for [`fs-extra.copySync`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy-sync.md).

→ `node`
<br><br>
#### [`symbolicLink.moveTo(targetDir, options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#557)
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
#### [`symbolicLink.moveToSync(targetDir, options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#580)
- `targetDir` (`object `|` string`)&nbsp;&nbsp;–&nbsp;&nbsp;[`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md) instance or absolute path of the target directory.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`fs-extra.move`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/move.md).

Synchronous version of `node.moveTo`.

→ `node`
<br><br>
#### [`symbolicLink.appendTo()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#590)
Alias for `node.moveTo`.
<br><br>
#### [`symbolicLink.appendToSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#599)
Alias for `node.moveToSync`.

→ `node`
<br><br>
#### [`symbolicLink.siblings([patten, options])`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#610)
- `patten` (`string`)&nbsp;&nbsp;Default: `'*'`&nbsp;&nbsp;–&nbsp;&nbsp;Optional [`glob`](https://github.com/isaacs/node-glob) pattern.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`glob`](https://github.com/isaacs/node-glob) package.

Asynchronously select siblings of the node.
Uses [`glob`](https://github.com/isaacs/node-glob) package.

→ `promise.<draxt>` Promise representing a [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.
<br><br>
#### [`symbolicLink.siblingsSync([pattern, options])`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#629)
- `pattern` (`string`)&nbsp;&nbsp;Default: `'*'`&nbsp;&nbsp;–&nbsp;&nbsp;Optional [`glob`](https://github.com/isaacs/node-glob) pattern.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`glob`](https://github.com/isaacs/node-glob) package.

Synchronously select siblings of the node.
Uses [`glob`](https://github.com/isaacs/node-glob) package.

→ `draxt` A [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.
<br><br>
#### [`symbolicLink.remove()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#645)
Remove the node from file system! [`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md) nodes can have contents. Like `rm -rf`.
Wrapper for [`fs-extra.remove`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/remove.md).

→ `promise`
<br><br>
#### [`symbolicLink.removeSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#654)
Wrapper for [`fs-extra.removeSync`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/remove-sync.md).

→ `node`
<br><br>
#### [`symbolicLink.parent()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#670)
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
#### [`symbolicLink.parentSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#681)
Synchronously get parent directory node of the node.

→ `node` A [`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md) instance.
<br><br>