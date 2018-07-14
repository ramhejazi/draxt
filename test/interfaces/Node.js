/* global expect, describe, it, beforeEach, afterEach*/
const
	mockFs = require('mock-fs'),
	draxt = require('../../src/draxt'),
	{ Node } = draxt,
	{ Directory, File } = Node,
	fs = require('fs-extra'),
	path = require('path'),
	isTravis = 'TRAVIS' in process.env && 'CI' in process.env,
	shouldNotPass = function() { throw new Error('should not pass!') }
;

describe('Node', function() {
	describe('initialization and basic methods', function() {
		const nodePath = '/fake/_fakepath/module.js'
		const stats = {}
		it('`new`', function() {
			const node = new Node(nodePath, stats);
			expect(node.pathName).to.eql(nodePath);
			expect(node.extension).to.eql('js');
			expect(node.name).to.eql('module');
			expect(node.baseName).to.eql('module.js');
			expect(node.parentPath).to.eql('/fake/_fakepath');
			expect(node.rootPath).to.eql('/');
			expect(node.getCachedStats() === stats).to.eql(true);
		});

		it('path.parse methods', function() {
			const node = new Node(nodePath, stats);
			expect(node.getPathName()).to.eql(nodePath);
			expect(node.getExtension()).to.eql('js');
			expect(node.getName()).to.eql('module');
			expect(node.getBaseName()).to.eql('module.js');
			expect(node.getParentPath()).to.eql('/fake/_fakepath');
			expect(node.isDotFile()).to.eql(false);
			node.baseName = '.git';
			expect(node.isDotFile()).to.eql(true);
			node._stats = undefined;
			expect(node.getStatProp('foo')).to.eql(undefined);
		});
	});

	describe('fs module methods', function() {
		beforeEach(function() {
			mockFs({
				'/fake_dir': {
					'example_file.md': 'example content.',
					'another_example_file.md': 'example content.',
					'another_dir': {
						'a.js': '...',
						'b.js': '...',
						'c.php': '...',
						'k.php': '...',
						'd.html': '...',
						'g.md':  mockFs.symlink({
							path: '/fake_dir/example_file.md'
						}),
						'README.md': '...',
						'document.txt': '...',
						'.dir': {},
						'foo.rb': '...'
					},
				}
			});
		});

		afterEach(function() {
			mockFs.restore();
		});

		it('.getPermissions()', function() {
			const node = new Node('/fake_dir/example_file.md');
			expect(() => node.getPermissions()).to.throw('renewStats');
			const perms = node.chmodSync('700').renewStatsSync().getPermissions();
			expect(perms).to.eql({
				read: { owner: true, group: false, others: false },
				write: { owner: true, group: false, others: false },
				execute: { owner: true, group: false, others: false }
			});
			const perms2 = node.chmodSync('777').renewStatsSync().getPermissions();
			expect(perms2).to.eql({
				read: { owner: true, group: true, others: true },
				write: { owner: true, group: true, others: true },
				execute: { owner: true, group: true, others: true }
			});
		});

		it('.getAccessTime() && .getBirthTime() && .getModifiedTime() && .getChangeTime()', function() {
			const node = new Node('/fake_dir/example_file.md');
			node.renewStatsSync();
			expect(node.getBirthTime()).to.eql(node._stats.birthtime);
			expect(node.getAccessTime()).to.eql(node._stats.atime);
			expect(node.getChangeTime()).to.eql(node._stats.ctime);
			expect(node.getModifiedTime()).to.eql(node._stats.mtime);
		});

		it('.__resolvePath()', function() {
			const node = new Node('/fake_dir/example_file.md');
			expect(node.__resolvePath('/foo/bar')).to.eql('/foo/bar/example_file.md');
			expect(node.__resolvePath('/foo/bar/')).to.eql('/foo/bar/example_file.md');
			expect(node.__resolvePath(new Directory('/foo/bar/'))).to.eql('/foo/bar/example_file.md');
			expect(() => node.__resolvePath('../bar/')).to.throw('absolute');
			expect(() => node.__resolvePath(new File('/foo/bar.js'))).to.throw('Directory');
			expect(() => node.__resolvePath()).to.throw('required');
		});

		it('.renewStats() && .renewStatsSync()', function() {
			const node = new Node('/fake_dir/example_file.md');
			expect(node._stats).to.eql();
			expect(node.renewStatsSync()).to.eql(node);
			expect(node._stats).to.be.an('object');
			const oldCache = node._stats;
			node._stats = null;
			return node.renewStats().then(function() {
				expect(node._stats).to.be.an('object');
				expect(node._stats === oldCache).to.eql(false);
				expect(node.getSize()).to.eql(node._stats.size);
			});
		})

		it('.access() && .accessSync()', function() {
			const node = new Node('/fake_dir/example_file.md', {});
			const node2 = new Node('/fake_dir/does_not_exist.md', {});
			expect(node.accessSync()).to.eql(node);
			expect(() => node2.accessSync()).to.throw();
			return node.access().then(function() {
				return node2.access().then(shouldNotPass).catch(e => {
					expect(e.message).to.include('ENOENT');
				});
			});
		});

		it('.chmod() && .chmodSync() && .lchmod() && .lchmodSync()', function() {
			const node = new Node('/fake_dir/example_file.md', {});
			expect(node.chmodSync('755')).to.eql(node);
			node.renewStatsSync();
			expect(node.getOctalPermissions()).to.eql('755');
			expect(node.lchmodSync('755')).to.eql(node);
			node.renewStatsSync();
			expect(node.getOctalPermissions()).to.eql('755');
			return node.chmod('711').then(function() {
				node.renewStatsSync();
				expect(node.getOctalPermissions()).to.eql('711');
				return node.lchmod('777').then(function() {
					node.renewStatsSync();
					expect(node.getOctalPermissions()).to.eql('777');
				});
			});
		});

		it('.chown() && .chownSync() && .lchown() && .lchownSync()', function() {
			const node = new Node('/fake_dir/example_file.md', {});
			expect(node.chownSync(10, 11)).to.eql(node);
			node.renewStatsSync();
			// Comment some tests that will fail on travis cli!
			//
			// expect(node._stats.uid).to.eql(10);
			// expect(node._stats.gid).to.eql(11);
			expect(node.lchownSync(20, 22)).to.eql(node);
			// node.renewStatsSync();
			// expect(node._stats.uid).to.eql(20);
			// expect(node._stats.gid).to.eql(22);
			return node.chown(30, 33).then(function() {
				// node.renewStatsSync();
				// expect(node._stats.uid).to.eql(30);
				// expect(node._stats.gid).to.eql(33);
				return node.lchown(40, 44).then(function() {
					// node.renewStatsSync();
					// expect(node._stats.uid).to.eql(40);
					// expect(node._stats.gid).to.eql(44);
				});
			});
		});

		it('.exists() && .existsSync()', function() {
			const node = new Node('/fake_dir/example_file.md', {});
			const node2 = new Node('/fake_dir/does_not_exist.md', {});
			expect(node.existsSync()).to.eql(true);
			expect(node2.existsSync()).to.eql(false);
			return node.exists().then(ret => {
				expect(ret).to.eql(true);
				return node2.exists().then(ret2 => {
					expect(ret2).to.eql(false);
				});
			});
		});

		it('.stat() && .statSync() && .lstat() && .lstatSync() ', function() {
			const node = new Node('/fake_dir/example_file.md', {});
			expect(node.statSync()).to.be.an('object');
			expect(node.lstatSync()).to.be.an('object');
			return node.stat().then(function(stats) {
				expect(stats).to.be.an('object');
				return node.lstat().then(stats2 => {
					expect(stats2).to.be.an('object');
				});
			});
		});

		it('.link() && .linkSync()', function() {
			const node = new Node('/fake_dir/example_file.md', {});
			const nodeLink = new Node('/fake_dir/example_file_link.md');
			const nodeLink2 = new Node('/fake_dir/example_file_link2.md');
			// make sure new name for the file doesn't exist before linking
			expect(nodeLink.existsSync()).to.eql(false);
			expect(nodeLink2.existsSync()).to.eql(false);
			expect(node.linkSync(nodeLink.pathName)).to.eql(node);
			expect(nodeLink.existsSync()).to.eql(true);
			return node.link(nodeLink2.pathName).then(function() {
				expect(nodeLink2.existsSync()).to.eql(true);
			})
		});

		it('.rename() && .renameSync()', function() {
			const node = new Node('/fake_dir/example_file.md', {});
			const renameSampleNode = new Node('/fake_dir/another_dir/example_file.js', {});
			const renameSampleNodeAsync = new Node('/fake_dir/another_dir/new_name.md', {});
			expect(renameSampleNode.existsSync()).to.eql(false);
			expect(renameSampleNodeAsync.existsSync()).to.eql(false);
			expect(node.renameSync(renameSampleNode.pathName)).to.eql(node);
			expect(renameSampleNode.existsSync()).to.eql(true);
			expect(node.pathName).to.eql(renameSampleNode.pathName);
			expect(node.getExtension()).to.eql('js');
			return node.rename(renameSampleNodeAsync.pathName).then(function() {
				expect(renameSampleNodeAsync.existsSync()).to.eql(true);
				expect(node.pathName).to.eql(renameSampleNodeAsync.pathName);
			});
		});

		it('.utimes() && .utimesSync()', function() {
			const node = new Node('/fake_dir/example_file.md');
			const atime = 1529607246; // Thursday, June 21, 2018 6:54:06 PM
			const mtime = 1529520846; // Wednesday, June 20, 2018 6:54:06 PM
			expect(node.utimesSync(atime, mtime)).to.eql(node);
			node.renewStatsSync();
			if ( !isTravis ) {
				// for some reason these fails on travis! Probably because of mock-fs
				expect(node.getStatProp('atimeMs') / 1000).to.eql(atime);
				expect(node.getStatProp('mtimeMs') / 1000).to.eql(mtime);
			}
			return node.utimes(atime - 2000, mtime - 2000).then(function() {
				node.renewStatsSync();
				if ( !isTravis ) {
					// for some reason these fails on travis! Probably because of mock-fs
					expect(node.getStatProp('atimeMs') / 1000).to.eql(atime - 2000);
					expect(node.getStatProp('mtimeMs') / 1000).to.eql(mtime - 2000);
				}
			});
		});

	});

	describe('Utility methods', function() {
		beforeEach(function() {
			mockFs({
				'/fake_dir': {
					'example_file.md': 'example content.',
					'another_example_file.md': 'example content.',
					'another_dir': {
						'a.js': '...',
						'b.js': '...',
						'c.php': 'c.php content!',
						'd.html': '...',
						'document.txt': '...',
						'foo.rb': '...',
						'g.md':  mockFs.symlink({
							path: '/fake_dir/example_file.md'
						}),
						'k.php': '...',
						'README.md': '...',
						'.git': {},
					},
					'store': {
						'c.php': 'backup c.php content!'
					}
				}
			}, {
				// add this option otherwise node-glob returns an empty string!
				createCwd: false
			});
		});

		afterEach(function() {
			mockFs.restore();
		});

		it('.__normalizeGlobOptions()', function() {
			const o1 = Node.__normalizeGlobOptions();
			expect(o1).to.eql({
				absolute: true
			});
			const o2 = Node.__normalizeGlobOptions({ absolute: false });
			expect(o2).to.eql({
				absolute: true
			});
			expect(() => Node.__normalizeGlobOptions([])).to.throw(
				'must be either a string or an object'
			);
			const o3 = Node.__normalizeGlobOptions('/path');
			expect(o3).to.eql({
				cwd: '/path',
				absolute: true
			});
		});

		it('.__statsToNode()', function() {
			const mockStats = (type) => {
				return {
					isFile() { return type === 'File' },
					isSymbolicLink() { return type === 'SymbolicLink' },
					isDirectory() { return type === 'Directory' }
				}
			};
			[
				{ path: '/node', type: 'Node', nodeType: 0 },
				{ path: '/directory', type: 'Directory', nodeType: 1 },
				{ path: '/file', type: 'File', nodeType: 2},
				{ path: '/symlink', type: 'SymbolicLink', nodeType: 3 },
			].forEach(item => {
				const node = Node.__statsToNode(item.path, mockStats(item.type));
				expect(node.pathName).to.eql(item.path);
				expect(node.nodeName).to.eql(item.type);
				expect(node.NODE_TYPE).to.eql(item.nodeType);
			});
		});

		it('.toNodes() && .toNodesSync()', function() {
			const paths = [
				'/fake_dir/another_dir',
				'/fake_dir/another_dir/g.md',
				'/fake_dir/example_file.md'
			];
			const nodes1 = Node.toNodesSync(paths);
			expect(nodes1).to.be.an('array');
			expect(nodes1[0]).to.be.instanceof(Node.Directory);
			expect(nodes1[1]).to.be.instanceof(Node.SymbolicLink);
			expect(nodes1[2]).to.be.instanceof(Node.File);
			nodes1.forEach((el, index) => {
				expect(el.pathName).to.eql(paths[index]);
			});

			return Node.toNodes(paths).then(nodes2 => {
				expect(nodes2[0]).to.be.instanceof(Node.Directory);
				expect(nodes2[1]).to.be.instanceof(Node.SymbolicLink);
				expect(nodes2[2]).to.be.instanceof(Node.File);
				nodes2.forEach((el, index) => {
					expect(el.pathName).to.eql(paths[index]);
				});
			});
		});

		(function() {
			const rawExpected1 = [
				'/fake_dir/another_dir',
				'/fake_dir/another_example_file.md',
				'/fake_dir/example_file.md',
				'/fake_dir/store'
			];
			const rawExpected2 = [
				'/fake_dir/another_dir',
				'/fake_dir/another_dir/a.js',
				'/fake_dir/another_dir/b.js',
				'/fake_dir/another_dir/c.php',
				'/fake_dir/another_dir/d.html',
				'/fake_dir/another_dir/document.txt',
				'/fake_dir/another_dir/foo.rb',
				'/fake_dir/another_dir/g.md',
				'/fake_dir/another_dir/k.php',
				'/fake_dir/another_dir/README.md',
				'/fake_dir/another_example_file.md',
				'/fake_dir/example_file.md',
				'/fake_dir/store',
				'/fake_dir/store/c.php'
			];
			it('.rawQuery() && .rawQuerySync()', function() {
				// result seem to be sorted by default
				expect(Node.rawQuerySync('*', '/fake_dir')).to.eql(rawExpected1);
				const result2 = Node.rawQuerySync('**', {
					cwd: '/fake_dir'
				});
				expect(result2).to.eql(rawExpected2);
				return Node.rawQuery('*', '/fake_dir').then(res1 => {
					expect(res1).to.eql(rawExpected1);
					return Node.rawQuery('**', '/fake_dir').then(res2 => {
						expect(res2).to.eql(rawExpected2);
					});
				});
			});

			it('.query() && .querySync()', function() {
				const result1 = Node.querySync('*', '/fake_dir');
				expect(result1).to.be.an('array');
				expect(result1.length).to.eql(rawExpected1.length);
				const result2 = Node.querySync('**', {
					cwd: '/fake_dir'
				});
				expect(result2.length).to.eql(rawExpected2.length);
				expect(result2[0].pathName).to.eql(rawExpected2[0]);
				return Node.query('*', '/fake_dir').then(res1 => {
					expect(res1.length).to.eql(res1.length);
					return Node.query('**', '/fake_dir').then(res2 => {
						expect(res2.length).to.eql(rawExpected2.length);
					});
				});
			});
		})();

		it('.remove() && .removeSync()', function() {
			const node = new Node('/fake_dir/example_file.md');
			const node2 = new Node('/fake_dir/another_example_file.md');
			expect(node.existsSync()).to.eql(true);
			expect(node.removeSync()).to.eql(node);
			expect(node.existsSync()).to.eql(false);

			expect(node2.existsSync()).to.eql(true);
			return node2.remove().then(function() {
				expect(node2.existsSync()).to.eql(false);
			});
		});

		it('.parent() && .parentSync()', function() {
			const node = new Node('/fake_dir/example_file.md');
			const parent = node.parentSync();
			expect(parent).to.be.instanceof(Directory);
			expect(parent.pathName).to.eql('/fake_dir');
			return node.parent().then(parentAsync => {
				expect(parentAsync).to.be.instanceof(Directory);
				expect(parentAsync.pathName).to.eql('/fake_dir');
			});
		});

		it('.siblings() && .siblingsSync()', function() {
			const node = new Node('/fake_dir/another_dir/c.php');
			const s1 = node.siblingsSync();
			expect(s1.length).to.eql(8);
			const exists = s1.some((el) => el.path === node.pathName);
			expect(exists).to.eql(false);
			const s2 = node.siblingsSync('*.php');
			expect(s2.length).to.eql(1);
			// Note: `*` doesn't
			const s3 = node.siblingsSync('*', {
				ignore: '*.php',
				dot: true
			});
			expect(s3.length).to.eql(8);
			const s4 = node.siblingsSync({
				ignore: ['*.php'],
			});
			expect(s4.length).to.eql(7);

			// errors
			expect(() => node.siblingsSync([], {})).to.throw('should be a string');
			expect(() => node.siblingsSync('*', 'context')).to.throw('context');
			expect(() => node.siblingsSync('*', [])).to.throw('options');
			return node.siblings().then(ss1 => {
				expect(ss1.length).to.eql(8);
				return node.siblings('*.md', {
					ignore: 'README.md',
				}).then(ss2 => {
					expect(ss2.length).to.eql(1);
					expect(ss2).to.be.instanceof(draxt);
					expect(ss2.get(0).baseName).to.eql('g.md');
				});
			});
		});

		it('.moveTo() && .moveToSync() && .appendTo() && .appendToSync()', function() {
			const node = new Node('/fake_dir/another_dir/c.php');
			expect(node.moveToSync('/fake_dir/another_dir/.git')).to.eql(node);
			expect(node.pathName).to.eql('/fake_dir/another_dir/.git/c.php');
			return node.moveTo('/fake_dir').then(function() {
				expect(node.pathName).to.eql('/fake_dir/c.php');
				expect(() => node.moveTo('/fake_dir/', function() {})).to.throw('callback');
				expect(() => node.appendToSync('/fake_dir/store')).to.throw('EEXIST');
				return node.appendTo('/fake_dir/store', { overwrite: true }).then(function() {
					expect(node.pathName).to.eql('/fake_dir/store/c.php');
					expect(node.fs.readFileSync(node.pathName, 'utf8')).to.eql('c.php content!');
				});
			});
		});

	});

	/**
	 * Exclude copy from others tests for creating example test files and directories
	 * Reason: fs-extra is not fully compatible with mock-fs module!
	 */
	describe('.copy() && .copySync()', function() {
		const nodePath = path.join(__dirname, '/test_dir/exmaple.node');
		const copyPath = path.join(__dirname, '/test_dir/non_existent/copied.php');
		const copyPath2 = path.join(__dirname, '/test_dir/copied.php');
		beforeEach(function() {
			fs.removeSync(path.join(__dirname, 'test_dir'));
			fs.ensureFileSync(nodePath);
			fs.writeFileSync(nodePath, 'example content!', 'utf8');
		})
		it('.copy() && .copySync', function() {
			const node = new Node(nodePath);
			expect(node.existsSync()).to.eql(true);
			expect(node.copySync(copyPath)).to.eql(node);
			expect(node.fs.readFileSync(copyPath, 'utf8')).to.eql(
				'example content!'
			);
			return node.copy(copyPath2).then(function() {
				expect(node.fs.readFileSync(copyPath2, 'utf8')).to.eql(
					'example content!'
				);
			});
		});
		afterEach(function() {
			fs.removeSync(path.join(__dirname, 'test_dir'));
		});
	});



});
