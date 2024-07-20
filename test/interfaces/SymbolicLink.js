/* global describe, beforeEach, it*/
const {SymbolicLink} = require('../../src/draxt').Node;
const {expect} = require('chai');

describe('SymbolicLink', () => {
    describe('initialization and basic methods', () => {
        const nodePath = '/fake/_fakepath';
        const stats = {};
        it('`new`', () => {
            const node = new SymbolicLink(nodePath, stats);
            expect(node.pathName).to.eql(nodePath);
            expect(node.extension).to.eql('');
            expect(node.name).to.eql('_fakepath');
            expect(node.baseName).to.eql('_fakepath');
            expect(node.parentPath).to.eql('/fake');
            expect(node.getCachedStats() === stats).to.eql(true);
        });

        it('path.parse methods', () => {
            const node = new SymbolicLink(nodePath, stats);
            expect(node.getPathName()).to.eql(nodePath);
            expect(node.getExtension()).to.eql('');
            expect(node.getName()).to.eql('_fakepath');
            expect(node.getBaseName()).to.eql('_fakepath');
            expect(node.getParentPath()).to.eql('/fake');
        });
    });

    describe('fs methods', () => {
        beforeEach(() => {
            const {execSync} = require('child_process');
            const pre = `
								rm -r /tmp/fake_dir
								mkdir /tmp/fake_dir
								mkdir /tmp/fake_dir/childdir
								echo 'example content.' > /tmp/fake_dir/example_file.md
								ln -s /tmp/fake_dir/example_file.md /tmp/fake_dir/childdir/sym1.md
								ln -s /tmp/fake_dir/non_existent.md /tmp/fake_dir/childdir/sym2
						`;
            execSync(pre);
        });

        // afterEach(() => {
        //     vol.reset();
        // });

        it('.readlink() && .readlink()', () => {
            const sym1 = new SymbolicLink('/tmp/fake_dir/childdir/sym1.md');
            const sym2 = new SymbolicLink('/tmp/fake_dir/childdir/sym2');
            expect(sym1.readlinkSync()).to.eql('/tmp/fake_dir/example_file.md');
            return sym2.readlink().then((pathName) => {
                expect(pathName).to.eql('/tmp/fake_dir/non_existent.md');
            });
        });

        it('.isBroken() && .isBrokenSync()', () => {
            const sym1 = new SymbolicLink('/tmp/fake_dir/childdir/sym1.md');
            const sym2 = new SymbolicLink('/tmp/fake_dir/childdir/sym2');
            expect(sym1.isBrokenSync()).to.eql(false);
            return sym2.isBroken().then((ret) => {
                expect(ret).to.eql(true);
            });
        });
    });
});
