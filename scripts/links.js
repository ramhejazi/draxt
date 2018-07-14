/**
 * A list of texts and links used for creating links for docs
 * The point of existence: Making source code more readable by not including
 * awkward links.
 */
module.exports = {
	// fs.Stats
	'fs.Stats': 'https://nodejs.org/api/fs.html#fs_class_fs_stats',
	'atime': 'https://nodejs.org/api/fs.html#fs_stats_atime',
	'mtime': 'https://nodejs.org/api/fs.html#fs_stats_mtime',
	'ctime': 'https://nodejs.org/api/fs.html#fs_stats_ctime',
	'birthtime': 'https://nodejs.org/api/fs.html#fs_stats_birthtime',
	'blksize': 'https://nodejs.org/api/fs.html#fs_stats_blksize',

	// fs original methods
	'fs.access': 'https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback',
	'fs.accessSync': 'https://nodejs.org/api/fs.html#fs_fs_accesssync_path_mode',
	'fs.chmod': 'https://nodejs.org/api/fs.html#fs_fs_chmod_path_mode_callback',
	'fs.chmodSync': 'https://nodejs.org/api/fs.html#fs_fs_chmodsync_path_mode',
	'fs.lchmod': 'https://nodejs.org/api/fs.html#fs_fs_lchmod_path_mode_callback',
	'fs.lchmodSync': 'https://nodejs.org/api/fs.html#fs_fs_lchmodsync_path_mode',
	'fs.chown': 'https://nodejs.org/api/fs.html#fs_fs_chown_path_uid_gid_callback',
	'fs.chownSync': 'https://nodejs.org/api/fs.html#fs_fs_chownsync_path_uid_gid',
	'fs.lchown': 'https://nodejs.org/api/fs.html#fs_fs_lchown_path_uid_gid_callback',
	'fs.lchownSync': 'https://nodejs.org/api/fs.html#fs_fs_lchownsync_path_uid_gid',
	'fs.exists': 'https://nodejs.org/api/fs.html#fs_fs_exists_path_callback',
	'fs.existsSync': 'https://nodejs.org/api/fs.html#fs_fs_existssync_path',
	'fs.stat': 'https://nodejs.org/api/fs.html#fs_fs_stat_path_options_callback',
	'fs.statSync': 'https://nodejs.org/api/fs.html#fs_fs_statsync_path_options',
	'fs.lstat': 'https://nodejs.org/api/fs.html#fs_fs_lstat_path_options_callback',
	'fs.lstatSync': 'https://nodejs.org/api/fs.html#fs_fs_lstatsync_path_options',
	'fs.link': 'https://nodejs.org/api/fs.html#fs_fs_link_existingpath_newpath_callback',
	'fs.linkSync': 'https://nodejs.org/api/fs.html#fs_fs_linksync_existingpath_newpath',
	'fs.rename': 'https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback',
	'fs.renameSync': 'https://nodejs.org/api/fs.html#fs_fs_renamesync_oldpath_newpath',
	'fs.utimes': 'https://nodejs.org/api/fs.html#fs_fs_utimes_path_atime_mtime_callback',
	'fs.utimesSync': 'https://nodejs.org/api/fs.html#fs_fs_utimessync_path_atime_mtime',
	'fs.rmdir': 'https://nodejs.org/api/fs.html#fs_fs_rmdir_path_callback',
	'fs.rmdirSync': 'https://nodejs.org/api/fs.html#fs_fs_rmdirsync_path',
	'fs.readdir': 'https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback',
	'fs.readdirSync': 'https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options',
	'fs.readlink': 'https://nodejs.org/api/fs.html#fs_fs_readlink_path_options_callback',
	'fs.readlinkSync': 'https://nodejs.org/api/fs.html#fs_fs_readlinksync_path_options',

	// fs-extra
	'fs-extra': 'https://github.com/jprichardson/node-fs-extra',
	'fs-extra.copy': 'https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md',
	'fs-extra.copySync': 'https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy-sync.md',
	'fs-extra.remove': 'https://github.com/jprichardson/node-fs-extra/blob/master/docs/remove.md',
	'fs-extra.removeSync': 'https://github.com/jprichardson/node-fs-extra/blob/master/docs/remove-sync.md',
	'fs-extra.move': 'https://github.com/jprichardson/node-fs-extra/blob/master/docs/move.md',
	'fs-extra.moveSync': 'https://github.com/jprichardson/node-fs-extra/blob/master/docs/move-sync.md',
	'fs-extra.ensureDir': 'https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureDir.md',
	'fs-extra.ensureDirSync': 'https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureDir-sync.md',
	'fs-extra.ensureFile': 'https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureFile.md',
	'fs-extra.ensureFileSync': 'https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureFile-sync.md',
	'fs-extra.emptyDir': 'https://github.com/jprichardson/node-fs-extra/blob/master/docs/emptyDir.md',
	'fs-extra.emptyDirSync': 'https://github.com/jprichardson/node-fs-extra/blob/master/docs/emptyDir-sync.md',

	'glob': 'https://github.com/isaacs/node-glob',
	'$(selector, context)': 'http://api.jquery.com/jQuery/#jQuery-selector-context',

	'Node': 'https://github.com/ramhejazi/draxt/blob/master/docs/Node.md',
	'Directory': 'https://github.com/ramhejazi/draxt/blob/master/docs/Directory.md',
	'File': 'https://github.com/ramhejazi/draxt/blob/master/docs/File.md',
	'SymbolicLink': 'https://github.com/ramhejazi/draxt/blob/master/docs/SymbolicLink.md',

	'Draxt': 'https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md',
	'draxt': 'https://github.com/ramhejazi/draxt/blob/master/docs/Draxt.md'
}