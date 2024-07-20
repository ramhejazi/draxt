/* global describe, beforeEach, afterEach, it*/
const {File} = require('../../src/draxt').Node;
const {expect} = require('chai');

describe('File', () => {
    describe('initialization', () => {
        it('new and .isFile() method', () => {
            const file = new File('/fake/fakepath/module.md', {});
            expect(file.isFile()).to.eql(true);
            expect(file.isDirectory()).to.eql(false);
            expect(file.isSymbolicLink()).to.eql(false);
            expect(file.NODE_TYPE).to.eql(2);
            expect(file.nodeName).to.eql('File');
        });
    });

    describe('fs methods', () => {
        beforeEach(() => {
            const {execSync} = require('child_process');
            const pre = `
								rm -r /tmp/fake_dir
								mkdir /tmp/fake_dir
								echo 'example content.' > /tmp/fake_dir/example_file.md
								echo 'example content.' > /tmp/fake_dir/another_example_file.md
						`;
            execSync(pre);
        });

        afterEach(() => {
            // vol.reset();
        });

        it('.read() && .readSync()', () => {
            const file = new File('/tmp/fake_dir/example_file.md', {});
            const content = file.readSync('utf8');
            const expectContent = 'example content.\n';
            expect(content).to.eql(expectContent);
            return file.read('utf8').then((content) => {
                expect(content).to.eql(expectContent);
            });
        });

        it('.append() && .appendSync()', () => {
            const file = new File('/tmp/fake_dir/example_file.md', {});
            const ret = file.appendSync(' appended content');
            expect(ret).to.eql(file);
            expect(file.readSync('utf8')).to.eql('example content.\n appended content');
            return file.append('. string').then(() => {
                return file.read('utf8').then((content) => {
                    expect(content).to.eql('example content.\n appended content. string');
                });
            });
        });

        it('.write() && .writeSync()', () => {
            const file = new File('/tmp/fake_dir/example_file.md', {});
            const ret = file.writeSync('new content');
            expect(ret).to.eql(file);
            expect(file.readSync('utf8')).to.eql('new content');
            return file.write('new async written content', () => {
                return file.read('utf8').then((content) => {
                    return expect(content).to.eql('new async written content');
                });
            });
        });

        it('.truncate() && .truncateSync()', () => {
            const file = new File('/tmp/fake_dir/example_file.md', {});
            const ret = file.truncateSync(4);
            expect(ret).to.eql(file);
            expect(file.readSync('utf8')).to.eql('exam');
            return file.truncate().then(() => {
                return file.read('utf8').then((content) => {
                    return expect(content).to.eql('');
                });
            });
        });

        it('.ensure() && .ensureSync()', () => {
            const file = new File('/tmp/fake_dir/non_existent.md');
            const file2 = new File('/tmp/fake_dir/non_existent2.md');
            expect(file.existsSync()).to.eql(false);
            expect(file.ensureSync()).to.eql(file);
            expect(file.existsSync()).to.eql(true);
            // async example
            expect(file2.existsSync()).to.eql(false);
            return file2.ensure().then(() => {
                expect(file2.existsSync()).to.eql(true);
            });
        });
    });
});
