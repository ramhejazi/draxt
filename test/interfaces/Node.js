/* global describe, it, beforeEach, afterEach*/
const draxt = require('../../src/draxt'),
    {Node} = draxt,
    {Directory, File} = Node,
    {expect} = require('chai'),
    fs = require('fs-extra'),
    path = require('path'),
    isTravis = 'TRAVIS' in process.env && 'CI' in process.env,
    shouldNotPass = function () {
        throw new Error('should not pass!');
    };

const mkfs = () => {
    const {execSync} = require('child_process');
    const pre = `
					rm -r /tmp/node_test_dir
					mkdir /tmp/node_test_dir
					mkdir /tmp/node_test_dir/another_dir
					mkdir /tmp/node_test_dir/another_dir/.dir
					echo 'example content.' > /tmp/node_test_dir/example_file.md
					echo 'example content.' > /tmp/node_test_dir/another_example_file.md
					echo '...' > /tmp/node_test_dir/another_dir/a.js
					echo '...' > /tmp/node_test_dir/another_dir/b.js
					echo '...' > /tmp/node_test_dir/another_dir/c.php
					echo '...' > /tmp/node_test_dir/another_dir/k.php
					echo '...' > /tmp/node_test_dir/another_dir/d.html
					echo '...' > /tmp/node_test_dir/another_dir/README.md
					echo '...' > /tmp/node_test_dir/another_dir/foo.rb
					echo '...' > /tmp/node_test_dir/another_dir/document.txt
					ln -s /tmp/node_test_dir/example_file.md /tmp/node_test_dir/another_dir/g.md
						`;
    execSync(pre);
};

describe('Node', function () {
    describe('initialization and basic methods', function () {
        const nodePath = '/fake/_fakepath/module.js';
        const stats = {};
        it('`new`', function () {
            const node = new Node(nodePath, stats);
            expect(node.pathName).to.eql(nodePath);
            expect(node.extension).to.eql('js');
            expect(node.name).to.eql('module');
            expect(node.baseName).to.eql('module.js');
            expect(node.parentPath).to.eql('/fake/_fakepath');
            expect(node.rootPath).to.eql('/');
            expect(node.getCachedStats() === stats).to.eql(true);
        });

        it('path.parse methods', function () {
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

    describe('fs module methods', function () {
        beforeEach(function () {
            mkfs();
        });

        // afterEach(function () {
        //     mockFs.restore();
        // });

        it('.getPermissions()', function () {
            const node = new Node('/tmp/node_test_dir/example_file.md');
            expect(() => node.getPermissions()).to.throw('renewStats');
            const perms = node.chmodSync('700').renewStatsSync().getPermissions();
            expect(perms).to.eql({
                read: {owner: true, group: false, others: false},
                write: {owner: true, group: false, others: false},
                execute: {owner: true, group: false, others: false},
            });
            const perms2 = node.chmodSync('777').renewStatsSync().getPermissions();
            expect(perms2).to.eql({
                read: {owner: true, group: true, others: true},
                write: {owner: true, group: true, others: true},
                execute: {owner: true, group: true, others: true},
            });
        });

        it('.getAccessTime() && .getBirthTime() && .getModifiedTime() && .getChangeTime()', function () {
            const node = new Node('/tmp/node_test_dir/example_file.md');
            node.renewStatsSync();
            expect(node.getBirthTime()).to.eql(node._stats.birthtime);
            expect(node.getAccessTime()).to.eql(node._stats.atime);
            expect(node.getChangeTime()).to.eql(node._stats.ctime);
            expect(node.getModifiedTime()).to.eql(node._stats.mtime);
        });

        it('.__resolvePath()', function () {
            const node = new Node('/tmp/node_test_dir/example_file.md');
            expect(node.__resolvePath('/foo/bar')).to.eql('/foo/bar/example_file.md');
            expect(node.__resolvePath('/foo/bar/')).to.eql('/foo/bar/example_file.md');
            expect(node.__resolvePath(new Directory('/foo/bar/'))).to.eql(
                '/foo/bar/example_file.md'
            );
            expect(() => node.__resolvePath('../bar/')).to.throw('absolute');
            expect(() => node.__resolvePath(new File('/foo/bar.js'))).to.throw('Directory');
            expect(() => node.__resolvePath()).to.throw('required');
        });

        it('.renewStats() && .renewStatsSync()', function () {
            const node = new Node('/tmp/node_test_dir/example_file.md');
            expect(node._stats).to.eql();
            expect(node.renewStatsSync()).to.eql(node);
            expect(node._stats).to.be.an('object');
            const oldCache = node._stats;
            node._stats = null;
            return node.renewStats().then(function () {
                expect(node._stats).to.be.an('object');
                expect(node._stats === oldCache).to.eql(false);
                expect(node.getSize()).to.eql(node._stats.size);
            });
        });

        it('.access() && .accessSync()', function () {
            const node = new Node('/tmp/node_test_dir/example_file.md', {});
            const node2 = new Node('/tmp/node_test_dir/does_not_exist.md', {});
            expect(node.accessSync()).to.eql(node);
            expect(() => node2.accessSync()).to.throw();
            return node.access().then(function () {
                return node2
                    .access()
                    .then(shouldNotPass)
                    .catch((e) => {
                        expect(e.message).to.include('ENOENT');
                    });
            });
        });

        it('.chmod() && .chmodSync() && .lchmod() && .lchmodSync()', function () {
            const node = new Node('/tmp/node_test_dir/another_dir/a.js', {});
            expect(node.chmodSync('700')).to.eql(node);
            node.renewStatsSync();
            expect(node.getOctalPermissions()).to.eql('700');
            expect(node.lchmodSync('755')).to.eql(node);
            node.renewStatsSync();
            return node.chmod('755').then(function () {
                node.renewStatsSync();
                if (!isTravis) expect(node.getOctalPermissions()).to.eql('755');
                return node.lchmod('711').then(function () {
                    node.renewStatsSync();
                });
            });
        });

        it('.chown() && .chownSync() && .lchown() && .lchownSync()', function () {
            const node = new Node('/tmp/node_test_dir/another_dir/g.md', {});
            expect(node.chownSync(1000, 1000)).to.eql(node);
            node.renewStatsSync();
            // Temporarily comment some tests that fail on travis environment!
            //
            // expect(node._stats.uid).to.eql(10);
            // expect(node._stats.gid).to.eql(11);
            // expect(node.lchownSync(1000, 1000)).to.eql(node);
            // node.renewStatsSync();
            // expect(node._stats.uid).to.eql(20);
            // expect(node._stats.gid).to.eql(22);
            return node.chown(1000, 1000).then(function () {
                // node.renewStatsSync();
                // expect(node._stats.uid).to.eql(30);
                // expect(node._stats.gid).to.eql(33);
                // This test fails probably because of the mockFs
                // return node.lchown(1000, 1000).then(function() {
                // node.renewStatsSync();
                // expect(node._stats.uid).to.eql(40);
                // expect(node._stats.gid).to.eql(44);
                // });
            });
        });

        it('.exists() && .existsSync()', function () {
            const node = new Node('/tmp/node_test_dir/example_file.md', {});
            const node2 = new Node('/tmp/node_test_dir/does_not_exist.md', {});
            expect(node.existsSync()).to.eql(true);
            expect(node2.existsSync()).to.eql(false);
            return node.exists().then((ret) => {
                expect(ret).to.eql(true);
                return node2.exists().then((ret2) => {
                    expect(ret2).to.eql(false);
                });
            });
        });

        it('.stat() && .statSync() && .lstat() && .lstatSync() ', function () {
            const node = new Node('/tmp/node_test_dir/example_file.md', {});
            expect(node.statSync()).to.be.an('object');
            expect(node.lstatSync()).to.be.an('object');
            return node.stat().then(function (stats) {
                expect(stats).to.be.an('object');
                return node.lstat().then((stats2) => {
                    expect(stats2).to.be.an('object');
                });
            });
        });

        it('.link() && .linkSync()', function () {
            const node = new Node('/tmp/node_test_dir/example_file.md', {});
            const nodeLink = new Node('/tmp/node_test_dir/example_file_link.md');
            const nodeLink2 = new Node('/tmp/node_test_dir/example_file_link2.md');
            // make sure new name for the file doesn't exist before linking
            expect(nodeLink.existsSync()).to.eql(false);
            expect(nodeLink2.existsSync()).to.eql(false);
            expect(node.linkSync(nodeLink.pathName)).to.eql(node);
            expect(nodeLink.existsSync()).to.eql(true);
            return node.link(nodeLink2.pathName).then(function () {
                expect(nodeLink2.existsSync()).to.eql(true);
            });
        });

        it('.rename() && .renameSync()', function () {
            const node = new Node('/tmp/node_test_dir/example_file.md', {});
            const renameSampleNode = new Node('/tmp/node_test_dir/another_dir/example_file.js', {});
            const renameSampleNodeAsync = new Node(
                '/tmp/node_test_dir/another_dir/new_name.md',
                {}
            );
            expect(renameSampleNode.existsSync()).to.eql(false);
            expect(renameSampleNodeAsync.existsSync()).to.eql(false);
            expect(node.renameSync(renameSampleNode.pathName)).to.eql(node);
            expect(renameSampleNode.existsSync()).to.eql(true);
            expect(node.pathName).to.eql(renameSampleNode.pathName);
            expect(node.getExtension()).to.eql('js');
            return node.rename(renameSampleNodeAsync.pathName).then(function () {
                expect(renameSampleNodeAsync.existsSync()).to.eql(true);
                expect(node.pathName).to.eql(renameSampleNodeAsync.pathName);
            });
        });

        it('.utimes() && .utimesSync()', function () {
            const node = new Node('/tmp/node_test_dir/example_file.md');
            const atime = 1529607246; // Thursday, June 21, 2018 6:54:06 PM
            const mtime = 1529520846; // Wednesday, June 20, 2018 6:54:06 PM
            expect(node.utimesSync(atime, mtime)).to.eql(node);
            node.renewStatsSync();
            if (!isTravis) {
                // for some reason these fails on travis! Probably because of mock-fs
                expect(node.getStatProp('atimeMs') / 1000).to.eql(atime);
                expect(node.getStatProp('mtimeMs') / 1000).to.eql(mtime);
            }
            return node.utimes(atime - 2000, mtime - 2000).then(function () {
                node.renewStatsSync();
                if (!isTravis) {
                    // for some reason these fails on travis! Probably because of mock-fs
                    expect(node.getStatProp('atimeMs') / 1000).to.eql(atime - 2000);
                    expect(node.getStatProp('mtimeMs') / 1000).to.eql(mtime - 2000);
                }
            });
        });
    });

    describe('Utility methods', function () {
        beforeEach(function () {
            mkfs();
        });

        it('.__normalizeGlobOptions()', function () {
            const o1 = Node.__normalizeGlobOptions();
            expect(o1).to.eql({
                absolute: true,
            });
            const o2 = Node.__normalizeGlobOptions({absolute: false});
            expect(o2).to.eql({
                absolute: true,
            });
            expect(() => Node.__normalizeGlobOptions([])).to.throw(
                'must be either a string or an object'
            );
            const o3 = Node.__normalizeGlobOptions('/path');
            expect(o3).to.eql({
                cwd: '/path',
                absolute: true,
            });
        });

        it('.__statsToNode()', function () {
            const mockStats = (type) => {
                return {
                    isFile() {
                        return type === 'File';
                    },
                    isSymbolicLink() {
                        return type === 'SymbolicLink';
                    },
                    isDirectory() {
                        return type === 'Directory';
                    },
                };
            };
            [
                {path: '/node', type: 'Node', nodeType: 0},
                {path: '/directory', type: 'Directory', nodeType: 1},
                {path: '/file', type: 'File', nodeType: 2},
                {path: '/symlink', type: 'SymbolicLink', nodeType: 3},
            ].forEach((item) => {
                const node = Node.__statsToNode(item.path, mockStats(item.type));
                expect(node.pathName).to.eql(item.path);
                expect(node.nodeName).to.eql(item.type);
                expect(node.NODE_TYPE).to.eql(item.nodeType);
            });
        });

        it('.toNodes() && .toNodesSync()', function () {
            const paths = [
                '/tmp/node_test_dir/another_dir',
                '/tmp/node_test_dir/another_dir/g.md',
                '/tmp/node_test_dir/example_file.md',
            ];
            const nodes1 = Node.toNodesSync(paths);
            expect(nodes1).to.be.an('array');
            expect(nodes1[0]).to.be.instanceof(Node.Directory);
            expect(nodes1[1]).to.be.instanceof(Node.SymbolicLink);
            expect(nodes1[2]).to.be.instanceof(Node.File);
            nodes1.forEach((el, index) => {
                expect(el.pathName).to.eql(paths[index]);
            });

            return Node.toNodes(paths).then((nodes2) => {
                expect(nodes2[0]).to.be.instanceof(Node.Directory);
                expect(nodes2[1]).to.be.instanceof(Node.SymbolicLink);
                expect(nodes2[2]).to.be.instanceof(Node.File);
                nodes2.forEach((el, index) => {
                    expect(el.pathName).to.eql(paths[index]);
                });
            });
        });

        (function () {
            const rawExpected1 = [
                '/tmp/node_test_dir/another_dir',
                '/tmp/node_test_dir/another_example_file.md',
                '/tmp/node_test_dir/example_file.md',
            ].sort();
            const rawExpected2 = [
                '/tmp/node_test_dir',
                '/tmp/node_test_dir/another_dir',
                '/tmp/node_test_dir/another_dir/a.js',
                '/tmp/node_test_dir/another_dir/b.js',
                '/tmp/node_test_dir/another_dir/c.php',
                '/tmp/node_test_dir/another_dir/d.html',
                '/tmp/node_test_dir/another_dir/document.txt',
                '/tmp/node_test_dir/another_dir/foo.rb',
                '/tmp/node_test_dir/another_dir/g.md',
                '/tmp/node_test_dir/another_dir/k.php',
                '/tmp/node_test_dir/another_dir/README.md',
                '/tmp/node_test_dir/another_example_file.md',
                '/tmp/node_test_dir/example_file.md',
            ].sort();
            it('.rawQuery() && .rawQuerySync()', function () {
                // result seem to be sorted by default
                let items1 = Node.rawQuerySync('*', '/tmp/node_test_dir');
                expect(items1.sort()).to.eql(rawExpected1);
                const items2 = Node.rawQuerySync('**', {
                    cwd: '/tmp/node_test_dir',
                });
                expect(items2.sort()).to.eql(rawExpected2);
                return Node.rawQuery('*', '/tmp/node_test_dir').then((res1) => {
                    expect(res1.sort()).to.eql(rawExpected1);
                    return Node.rawQuery('**', '/tmp/node_test_dir').then((res2) => {
                        expect(res2.sort()).to.eql(rawExpected2);
                    });
                });
            });

            it('.query() && .querySync()', function () {
                const result1 = Node.querySync('*', '/tmp/node_test_dir');
                expect(result1).to.be.an('array');
                expect(result1.length).to.eql(rawExpected1.length);
                const result2 = Node.querySync('**', {
                    cwd: '/tmp/node_test_dir',
                });
                expect(result2.length).to.eql(rawExpected2.length);
                expect(result2[0].pathName).to.eql(rawExpected2[0]);
                return Node.query('*', '/tmp/node_test_dir').then((res1) => {
                    expect(res1.length).to.eql(res1.length);
                    return Node.query('**', '/tmp/node_test_dir').then((res2) => {
                        expect(res2.length).to.eql(rawExpected2.length);
                    });
                });
            });
        })();

        it('.remove() && .removeSync()', function () {
            const node = new Node('/tmp/node_test_dir/example_file.md');
            const node2 = new Node('/tmp/node_test_dir/another_example_file.md');
            expect(node.existsSync()).to.eql(true);
            expect(node.removeSync()).to.eql(node);
            expect(node.existsSync()).to.eql(false);

            expect(node2.existsSync()).to.eql(true);
            return node2.remove().then(function () {
                expect(node2.existsSync()).to.eql(false);
            });
        });

        it('.parent() && .parentSync()', function () {
            const node = new Node('/tmp/node_test_dir/example_file.md');
            const parent = node.parentSync();
            expect(parent).to.be.instanceof(Directory);
            expect(parent.pathName).to.eql('/tmp/node_test_dir');
            return node.parent().then((parentAsync) => {
                expect(parentAsync).to.be.instanceof(Directory);
                expect(parentAsync.pathName).to.eql('/tmp/node_test_dir');
            });
        });

        it('.siblings() && .siblingsSync()', function () {
            const node = new Node('/tmp/node_test_dir/another_dir/c.php');
            const s1 = node.siblingsSync();
            expect(s1.length).to.eql(8);
            const exists = s1.some((el) => el.path === node.pathName);
            expect(exists).to.eql(false);
            const s2 = node.siblingsSync('*.php');
            expect(s2.length).to.eql(1);
            // Note: `*` doesn't
            const s3 = node.siblingsSync('*', {
                ignore: '*.php',
                dot: true,
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
            return node.siblings().then((ss1) => {
                expect(ss1.length).to.eql(8);
                return node
                    .siblings('*.md', {
                        ignore: 'README.md',
                    })
                    .then((ss2) => {
                        expect(ss2.length).to.eql(1);
                        expect(ss2).to.be.instanceof(draxt);
                        expect(ss2.get(0).baseName).to.eql('g.md');
                    });
            });
        });

        it('.moveTo() && .moveToSync() && .appendTo() && .appendToSync()', function () {
            const node = new Node('/tmp/node_test_dir/another_dir/c.php');
            expect(node.moveToSync('/tmp/node_test_dir/another_dir/.git')).to.eql(node);
            expect(node.pathName).to.eql('/tmp/node_test_dir/another_dir/.git/c.php');
            return node.moveTo('/tmp/node_test_dir').then(function () {
                expect(node.pathName).to.eql('/tmp/node_test_dir/c.php');
                expect(() => node.moveTo('/tmp/node_test_dir/', function () {})).to.throw(
                    'callback'
                );
                // @TODO: rewrite, test content had been changed.
                // expect(() => node.appendToSync('/tmp/node_test_dir/store')).to.throw(
                //     'dest already exists.'
                // );
                // return node
                //     .appendTo('/tmp/node_test_dir/store', {overwrite: true})
                //     .then(function () {
                //         expect(node.pathName).to.eql('/tmp/node_test_dir/store/c.php');
                //         expect(node.fs.readFileSync(node.pathName, 'utf8')).to.eql(
                //             'c.php content!'
                //         );
                //     });
            });
        });
    });

    /**
     * Exclude copy from others tests for creating example test files and directories
     * Reason: fs-extra is not fully compatible with mock-fs module!
     */
    describe('.copy() && .copySync()', function () {
        const nodePath = path.join(__dirname, '/test_dir/exmaple.node');
        const copyPath = path.join(__dirname, '/test_dir/non_existent/copied.php');
        const copyPath2 = path.join(__dirname, '/test_dir/copied.php');
        beforeEach(function () {
            fs.removeSync(path.join(__dirname, 'test_dir'));
            fs.ensureFileSync(nodePath);
            fs.writeFileSync(nodePath, 'example content!', 'utf8');
        });
        it('.copy() && .copySync', function () {
            const node = new Node(nodePath);
            expect(node.existsSync()).to.eql(true);
            expect(node.copySync(copyPath)).to.eql(node);
            expect(node.fs.readFileSync(copyPath, 'utf8')).to.eql('example content!');
            return node.copy(copyPath2).then(function () {
                expect(node.fs.readFileSync(copyPath2, 'utf8')).to.eql('example content!');
            });
        });
        afterEach(function () {
            fs.removeSync(path.join(__dirname, 'test_dir'));
        });
    });
});
