/* global expect, describe, beforeEach, afterEach, it*/
const mockFs = require('mock-fs');
const Draxt = require('../../src/draxt');
const {expect} = require('chai');
const {Directory, File} = Draxt.Node;
const shouldNotPass = function () {
    throw new Error('should not pass!');
};

describe('Directory', function () {
    describe('initialization and basic methods', function () {
        const nodePath = '/fake/_fakepath';
        const stats = {};
        it('`new`', function () {
            const node = new Directory(nodePath, stats);
            expect(node.pathName).to.eql(nodePath);
            expect(node.extension).to.eql('');
            expect(node.name).to.eql('_fakepath');
            expect(node.baseName).to.eql('_fakepath');
            expect(node.parentPath).to.eql('/fake');
            expect(node.getCachedStats() === stats).to.eql(true);
        });

        it('path.parse methods', function () {
            const node = new Directory(nodePath, stats);
            expect(node.getPathName()).to.eql(nodePath);
            expect(node.getExtension()).to.eql('');
            expect(node.getName()).to.eql('_fakepath');
            expect(node.getBaseName()).to.eql('_fakepath');
            expect(node.getParentPath()).to.eql('/fake');
        });
    });

    describe('fs methods', function () {
        beforeEach(function () {
            mockFs(
                {
                    '/fake_dir': {
                        'example_file.md': 'example content.',
                        empty_dir: {},
                        empty_dir2: {},
                        non_empty_dir: {
                            'file.rb': 'content',
                            foo: {
                                'bar.js': {},
                            },
                            '.git': {},
                        },
                        non_empty_dir2: {
                            'file.md': 'content',
                        },
                    },
                },
                {
                    // add this option otherwise node-glob returns an empty string!
                    createCwd: false,
                }
            );
        });

        afterEach(function () {
            mockFs.restore();
        });

        it('.rmdir() & .rmdirSync() & .ensure() & .ensureSync()', function () {
            const dir = new Directory('/fake_dir/empty_dir');
            const dir2 = new Directory('/fake_dir/non_empty_dir');
            expect(dir.existsSync()).to.eql(true);
            expect(dir.rmdirSync()).to.eql(dir);
            expect(dir.existsSync()).to.eql(false);
            // recreate the dir
            expect(dir.ensureSync()).to.eql(dir);
            // make sure the generated node is a directory
            expect(dir.renewStatsSync().isDirectory()).to.eql(true);
            expect(dir.existsSync()).to.eql(true);

            // rmdir should throw en error for non-empty dirs
            expect(function () {
                dir2.rmdirSync();
            }).to.throw('ENOTEMPTY');

            return dir.rmdir().then(function () {
                expect(dir.existsSync()).to.eql(false);
                return dir.ensure().then(function () {
                    expect(dir.existsSync()).to.eql(true);
                    expect(dir.renewStatsSync().isDirectory()).to.eql(true);
                    return dir2
                        .rmdir()
                        .then(shouldNotPass)
                        .catch((e) => {
                            expect(e.message).to.have.string('ENOTEMPTY');
                        });
                });
            });
        });

        it('.readdir() & .readdirSync() & .read() & .readSync()', function () {
            const dir = new Directory('/fake_dir/non_empty_dir');
            const expected = ['.git', 'file.rb', 'foo'];
            expect(dir.readSync()).to.eql(expected);
            return dir.read().then((ret) => {
                expect(ret).to.eql(expected);
            });
        });

        it('isEmpty() & .isEmptySync()', function () {
            const dir = new Directory('/fake_dir/empty_dir');
            const dir2 = new Directory('/fake_dir/non_empty_dir');
            expect(dir.isEmptySync()).to.eql(true);
            expect(dir2.isEmptySync()).to.eql(false);
            return dir.isEmpty().then((empty) => {
                expect(empty).to.eql(true);
                return dir2.isEmpty().then((empty) => {
                    expect(empty).to.eql(false);
                });
            });
        });

        it('.empty() & .emptySync()', function () {
            const expected = ['.git', 'file.rb', 'foo'];
            const dir = new Directory('/fake_dir/non_empty_dir');
            const dir2 = new Directory('/fake_dir/non_empty_dir2');
            expect(dir.readSync()).to.eql(expected);
            expect(dir.emptySync()).to.eql(dir);
            expect(dir.readSync()).to.eql([]);
            expect(dir2.readSync()).to.eql(['file.md']);
            return dir2.empty().then(function () {
                expect(dir2.readSync()).to.eql([]);
            });
        });

        it('__normalizeAppendNodes', function () {
            const method = Directory.__normalizeAppendNodes;
            const d = Draxt([new File('file.ext'), new Directory('dirname')]);
            expect(method(d)).to.eql(d.items);
            const d2 = ['str', new File('doo')];
            expect(method(d2)).to.eql(d2);
            const d3 = new File('');
            expect(method(d3)).to.eql([d3]);
            expect(method('path')).to.eql(['path']);
            expect(method(d.items)).to.eql(d.items);
            expect(() => method(new Date())).to.throw();
        });

        it('.append() & .appendSync()', function () {
            const col = [
                new File('/fake_dir/non_empty_dir/file.rb'),
                '/fake_dir/non_empty_dir/foo',
            ];
            // the directory will be created!
            const dir = new Directory('/fake_dir/empty_dir');
            expect(dir.appendSync(col)).to.eql(dir);
            // expect node to have it's new path!
            expect(col[0].pathName).to.eql('/fake_dir/empty_dir/file.rb');
            expect(dir.readSync()).to.eql(['file.rb', 'foo']);
            expect(new Directory('/fake_dir/non_empty_dir').readSync()).to.eql(['.git']);
            // col2
            const col2 = Draxt([new File('/fake_dir/example_file.md')]);
            return dir.append(col2).then(function () {
                expect(col2.get(0).pathName).eql('/fake_dir/empty_dir/example_file.md');
                return dir.append('/fake_dir/non_empty_dir2');
            });
        });

        it('.children() & .childrenSync()', function () {
            const dir = new Directory('/fake_dir/non_empty_dir');
            const ret = dir.childrenSync();
            expect(ret).to.be.instanceof(Draxt);
            expect(ret.length).to.eql(2);
            const ret2 = dir.childrenSync('*.rb');
            expect(ret2.length).to.eql(1);
            expect(ret2.get(0)).to.be.instanceof(File);
            expect(ret2.get(0).baseName).to.eql('file.rb');
            const ret3 = dir.childrenSync({dot: true});
            expect(ret3.length).to.eql(3);

            return dir.children().then((set) => {
                expect(set).to.be.instanceof(Draxt);
                expect(set.length).to.eql(2);
                expect(set.get(0).baseName).to.eql('file.rb');
                return dir.children('f*').then((set2) => {
                    expect(set2.length).to.eql(2);
                });
            });
        });

        it('.find() & .findSync()', function () {
            const dir = new Directory('/fake_dir');
            const ret = dir.findSync('*');
            expect(ret).to.be.instanceof(Draxt);
            expect(ret.length).to.eql(5);
            const ret2 = dir.findSync('**');
            expect(ret2.length).to.eql(9);
            const ret3 = dir.findSync('**', {dot: true});
            expect(ret3.length).to.eql(10);
            return dir.find('*').then((set) => {
                expect(set).to.be.instanceof(Draxt);
                expect(set.length).to.eql(5);
                return dir.find('**', {dot: true}).then((set2) => {
                    expect(set2.length).to.eql(10);
                });
            });
        });
    });
});
