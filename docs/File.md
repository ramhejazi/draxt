# Interfaces / File
Extends [`Node`](https://github.com/ramhejazi/draxt/blob/master/docs/Node.md) | [Inherited methods](#inherited-methods-from-node)

[`File`](https://github.com/ramhejazi/draxt/blob/master/docs/File.md) class which extends the [`Node`](https://github.com/ramhejazi/draxt/blob/master/docs/Node.md) class is an interface representing pathNames
that their [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats)'s `.isFile()` method returns `true`.
### Syntax
```js
const file = new File(pathName [, stats]);
```
### Properties
- **`file.nodeName`** (`string`)
Name of the node: `'File'`.

- **`file.NODE_TYPE`** (`number`)
Code number for the node: `2`.

- **`file.pathName`** (`string`)
Absolute pathName of the node. Example: `'/app/readme.md'`.

- **`file.baseName`** (`string`)
baseName of the node. Example: `'readme.md'`.

- **`file.name`** (`string`)
Name of the node without the possible extension. Example `'readme'`.

- **`file.extension`** (`string`|`undefined`)
Extension of the node without `.`. Example: `'js'`.

- **`file.parentPath`** (`string`)
pathName of the parent directory of the node.

- **`file.rootPath`** (`string`)
Root path of the file system.

- **`file._stats`** (`object`|`undefined`)
Cached instance of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.

- **`file.fs`** (`object`)
Refers to [`fs-extra`](https://github.com/jprichardson/node-fs-extra) package.

- **`file.glob`** (`object`)
Refers to [`glob`](https://github.com/isaacs/node-glob) package.

## Methods
#### [`file.ensure()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/File.js#30)
Ensure the file node exists on file system.
Wrapper for [`fs-extra.ensureFile`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureFile.md).

→ `promise`
<br><br>
#### [`file.ensureSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/File.js#39)
Ensure the file node exists on file system synchronously.
Wrapper for `fs.ensureFileSync`.

→ `node`
<br><br>
#### [`file.append()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/File.js#49)
Asynchronously append data to a file, creating the file if it does not yet exist. `data` can be a string or a Buffer.
Wrapper for `fs.appendFile`.

→ `promise`
<br><br>
#### [`file.appendSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/File.js#57)
Wrapper for `fs.appendFileSync`.

→ `node`
<br><br>
#### [`file.read()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/File.js#66)
Promisified wrapper for `fs.readFile`.

→ `promise` Promise object representing contents of the file.
<br><br>
#### [`file.readSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/File.js#74)
Wrapper for `fs.readFileSync`.

→ `any`
<br><br>
#### [`file.truncate()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/File.js#82)
Promisified wrapper for `fs.truncate`

→ `promise`
<br><br>
#### [`file.truncateSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/File.js#90)
Wrapper for `fs.truncateSync`.

→ `node`
<br><br>
#### [`file.write()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/File.js#99)
Promisified `fs.writeFile`

→ `promise`
<br><br>
#### [`file.writeSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/File.js#108)
Wrapper for `fs.writeFileSync`.

→ `node`
<br><br>
### Inherited Methods from [`Node`](https://github.com/ramhejazi/draxt/blob/master/docs/Node.md)
#### [`file.getPathName()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#66)
Get the node's pathName.

→ `string`
<br><br>
#### [`file.getBaseName()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#74)
Get the node's baseName.

→ `string`
<br><br>
#### [`file.getExtension()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#82)
Get the node's extension.

→ `string`
<br><br>
#### [`file.getName()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#91)
Get name of the node.
For [`File`](https://github.com/ramhejazi/draxt/blob/master/docs/File.md) nodes the `name` property is the name of file without possible extension.

→ `string`
<br><br>
#### [`file.getParentPath()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#99)
Get the node's parent directory pathName.

→ `string`
<br><br>
#### [`file.getCachedStats()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#109)
Get cached [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) instance for the node. Returns `undefined` when there
is no cached stats for the node. This happens only when the node is created
manually by user without passing a stats object.

→ `object `|` undefined`
<br><br>
#### [`file.getStatProp(propName)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#122)
- `propName` (`string`)

Get a stat property's value from cached [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.
The method returns `undefined` when there is no cached stats.
```js
// Get `blksize` property of fs.Stats instance cached for the node.
const node_ctime = node.getStatProp('blksize');
```

→ `any`
<br><br>
#### [`file.getAccessTime()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#130)
Get "access time" of the node. Returns [`atime`](https://nodejs.org/api/fs.html#fs_stats_atime) property of the cached stats.

→ `date`
<br><br>
#### [`file.getModifiedTime()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#138)
Get "modified time" of the node. Returns [`mtime`](https://nodejs.org/api/fs.html#fs_stats_mtime) property of the cached stats.

→ `date`
<br><br>
#### [`file.getBirthTime()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#146)
Get "birthday time" of the node. Returns [`birthtime`](https://nodejs.org/api/fs.html#fs_stats_birthtime) property of the cached stats.

→ `date`
<br><br>
#### [`file.getChangeTime()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#154)
Get "change time" of the node. Returns [`ctime`](https://nodejs.org/api/fs.html#fs_stats_ctime) property of the cached stats.

→ `date`
<br><br>
#### [`file.getSize()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#163)
Get size of the node.
Size is simply the `size` property of the cached [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) instance.

→ `number`
<br><br>
#### [`file.isDirectory()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#171)
Is the node a directory?

→ `boolean`
<br><br>
#### [`file.isFile()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#179)
Is the node a file?

→ `boolean`
<br><br>
#### [`file.isSymbolicLink()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#187)
Is the node a symbolic link?

→ `boolean`
<br><br>
#### [`file.isDotFile()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#195)
Is the node a dot file? i.e. does the node's name begin with dot character.

→ `boolean`
<br><br>
#### [`file.renewStats()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#203)
Asynchronously renew stats of the node. Uses [`fs.lstat`](https://nodejs.org/api/fs.html#fs_fs_lstat_path_options_callback).

→ `promise` A fresh [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) instance for the node.
<br><br>
#### [`file.renewStatsSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#215)
Synchronously renew stats of the node. Uses [`fs.lstatSync`](https://nodejs.org/api/fs.html#fs_fs_lstatsync_path_options).

→ `node`
<br><br>
#### [`file.getOctalPermissions()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#227)
Get octal representation of the node's permissions.
```js
node.getOctalPermissions() // → "755"
```

→ `string`
<br><br>
#### [`file.getPermissions()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#244)
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
#### [`file.access([mode])`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#288)
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
#### [`file.accessSync([mode])`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#298)
- `mode` (`integer`)&nbsp;&nbsp;Default: `fs.constants.F_OK`

Wrapper for [`fs.accessSync`](https://nodejs.org/api/fs.html#fs_fs_accesssync_path_mode).

→ `node` this
<br><br>
#### [`file.chmod(mode)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#308)
- `mode` (`integer`)

Wrapper for promisified [`fs.chmod`](https://nodejs.org/api/fs.html#fs_fs_chmod_path_mode_callback).

→ `promise`
<br><br>
#### [`file.chmodSync(mode)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#318)
- `mode` (`integer`)

Wrapper for [`fs.chmodSync`](https://nodejs.org/api/fs.html#fs_fs_chmodsync_path_mode).

→ `node` this
<br><br>
#### [`file.lchmod(mode)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#328)
- `mode` (`integer`)

Wrapper for promisified [`fs.lchmod`](https://nodejs.org/api/fs.html#fs_fs_lchmod_path_mode_callback).

→ `promise`
<br><br>
#### [`file.lchmodSync(mode)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#338)
- `mode` (`integer`)

Wrapper for [`fs.lchmodSync`](https://nodejs.org/api/fs.html#fs_fs_lchmodsync_path_mode).

→ `node`
<br><br>
#### [`file.chown(uid, gid)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#349)
- `uid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The user id
- `gid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The group id

Wrapper for promisified [`fs.chown`](https://nodejs.org/api/fs.html#fs_fs_chown_path_uid_gid_callback).

→ `promise`
<br><br>
#### [`file.chownSync(uid, gid)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#360)
- `uid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The user id
- `gid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The group id

Wrapper for [`fs.chownSync`](https://nodejs.org/api/fs.html#fs_fs_chownsync_path_uid_gid).

→ `node` The file node
<br><br>
#### [`file.lchown(uid, gid)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#371)
- `uid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The user id
- `gid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The group id

Wrapper for promisified [`fs.lchown`](https://nodejs.org/api/fs.html#fs_fs_lchown_path_uid_gid_callback).

→ `promise`
<br><br>
#### [`file.lchownSync(uid, gid)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#382)
- `uid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The user id
- `gid` (`integer`)&nbsp;&nbsp;–&nbsp;&nbsp;The group id

Wrapper for [`fs.lchownSync`](https://nodejs.org/api/fs.html#fs_fs_lchownsync_path_uid_gid).

→ `node` The file node
<br><br>
#### [`file.exists()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#392)
Does node exist on file system?
Uses [`fs.access`](https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback) instead of the deprecated [`fs.exists`](https://nodejs.org/api/fs.html#fs_fs_exists_path_callback) method.

→ `promise.<boolean>`
<br><br>
#### [`file.existsSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#403)
Does node exist on file system?
Wrapper for [`fs.existsSync`](https://nodejs.org/api/fs.html#fs_fs_existssync_path).

→ `boolean`
<br><br>
#### [`file.stat()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#411)
Wrapper for promisified [`fs.stat`](https://nodejs.org/api/fs.html#fs_fs_stat_path_options_callback).

→ `promise` Promise representing instance of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.
<br><br>
#### [`file.statSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#419)
Wrapper for [`fs.statSync`](https://nodejs.org/api/fs.html#fs_fs_statsync_path_options).

→ `object` Instance of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.
<br><br>
#### [`file.lstat()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#427)
Wrapper for promisified [`fs.lstat`](https://nodejs.org/api/fs.html#fs_fs_lstat_path_options_callback).

→ `promise` Promise representing instance of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.
<br><br>
#### [`file.lstatSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#435)
Wrapper for [`fs.lstatSync`](https://nodejs.org/api/fs.html#fs_fs_lstatsync_path_options).

→ `object` Instance of [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) for the node.
<br><br>
#### [`file.link(newPath)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#444)
- `newPath` (`string `|` Buffer `|` URL`)

Wrapper for promisified [`fs.link`](https://nodejs.org/api/fs.html#fs_fs_link_existingpath_newpath_callback).

→ `Promise`
<br><br>
#### [`file.linkSync(newPath)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#454)
- `newPath` (`string `|` buffer `|` URL`)

Wrapper for [`fs.linkSync`](https://nodejs.org/api/fs.html#fs_fs_linksync_existingpath_newpath).

→ `node`
<br><br>
#### [`file.rename(newPath)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#466)
- `newPath` (`string `|` Buffer `|` URL`)

Asynchronously rename node to the pathname provided as newPath.
In the case that `newPath` already exists, it will be overwritten.
Wrapper for promisified [`fs.rename`](https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback).

→ `promise`
<br><br>
#### [`file.renameSync(newPath)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#478)
- `newPath` (`string `|` Buffer `|` URL`)

Wrapper for [`fs.renameSync`](https://nodejs.org/api/fs.html#fs_fs_renamesync_oldpath_newpath).

→ `node`
<br><br>
#### [`file.utimes(atime, mtime)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#490)
- `atime` (`number `|` string `|` Date`)
- `mtime` (`number `|` string `|` Date`)

Wrapper for promisified [`fs.utimes`](https://nodejs.org/api/fs.html#fs_fs_utimes_path_atime_mtime_callback).

→ `promise`
<br><br>
#### [`file.utimesSync(atime, mtime)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#501)
- `atime` (`number `|` string `|` Date`)
- `mtime` (`number `|` string `|` Date`)

Wrapper for [`fs.utimesSync`](https://nodejs.org/api/fs.html#fs_fs_utimessync_path_atime_mtime).

→ `node`
<br><br>
#### [`file.copy(destPath, options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#522)
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
#### [`file.copySync(destPath, options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#533)
- `destPath` (`string`)&nbsp;&nbsp;–&nbsp;&nbsp;Destination path.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`fs-extra.copySync`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy-sync.md).

Wrapper for [`fs-extra.copySync`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy-sync.md).

→ `node`
<br><br>
#### [`file.moveTo(targetDir, options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#557)
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
#### [`file.moveToSync(targetDir, options)`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#580)
- `targetDir` (`object `|` string`)&nbsp;&nbsp;–&nbsp;&nbsp;[`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md) instance or absolute path of the target directory.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`fs-extra.move`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/move.md).

Synchronous version of `node.moveTo`.

→ `node`
<br><br>
#### [`file.appendTo()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#590)
Alias for `node.moveTo`.
<br><br>
#### [`file.appendToSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#599)
Alias for `node.moveToSync`.

→ `node`
<br><br>
#### [`file.siblings([patten, options])`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#610)
- `patten` (`string`)&nbsp;&nbsp;Default: `'*'`&nbsp;&nbsp;–&nbsp;&nbsp;Optional [`glob`](https://github.com/isaacs/node-glob) pattern.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`glob`](https://github.com/isaacs/node-glob) package.

Asynchronously select siblings of the node.
Uses [`glob`](https://github.com/isaacs/node-glob) package.

→ `promise.<draxt>` Promise representing a [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.
<br><br>
#### [`file.siblingsSync([pattern, options])`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#629)
- `pattern` (`string`)&nbsp;&nbsp;Default: `'*'`&nbsp;&nbsp;–&nbsp;&nbsp;Optional [`glob`](https://github.com/isaacs/node-glob) pattern.
- `options` (`object`)&nbsp;&nbsp;–&nbsp;&nbsp;Options for [`glob`](https://github.com/isaacs/node-glob) package.

Synchronously select siblings of the node.
Uses [`glob`](https://github.com/isaacs/node-glob) package.

→ `draxt` A [`draxt`](https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md) collection.
<br><br>
#### [`file.remove()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#645)
Remove the node from file system! [`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md) nodes can have contents. Like `rm -rf`.
Wrapper for [`fs-extra.remove`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/remove.md).

→ `promise`
<br><br>
#### [`file.removeSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#654)
Wrapper for [`fs-extra.removeSync`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/remove-sync.md).

→ `node`
<br><br>
#### [`file.parent()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#670)
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
#### [`file.parentSync()`](https://github.com/ramhejazi/draxt/blob/master/src/interfaces/Node.js#681)
Synchronously get parent directory node of the node.

→ `node` A [`Directory`](https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md) instance.
<br><br>