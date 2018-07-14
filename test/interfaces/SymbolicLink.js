/* global expect, describe, beforeEach, afterEach, it*/
const mockFs = require('mock-fs');
const { SymbolicLink } = require('../../src/draxt').Node;

describe('SymbolicLink', () => {
	describe('initialization and basic methods', () => {
		const nodePath = '/fake/_fakepath'
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
			mockFs({
				'/fake_dir': {
					'example_file.md': 'example content.',
					'childdir': {
						'sym1.md':  mockFs.symlink({
							path: '/fake_dir/example_file.md'
						}),
						'sym2': mockFs.symlink({
							path: '/fake_dir/non_existent.md'
						})
					},
				}
			});
		});

		afterEach(() => {
			mockFs.restore();
		});

		it('.readlink() && .readlink()', () => {
			const sym1 = new SymbolicLink('/fake_dir/childdir/sym1.md');
			const sym2 = new SymbolicLink('/fake_dir/childdir/sym2');
			expect(sym1.readlinkSync()).to.eql('/fake_dir/example_file.md');
			return sym2.readlink().then(pathName => {
				expect(pathName).to.eql('/fake_dir/non_existent.md');
			});
		});

		it('.isBroken() && .isBrokenSync()', () => {
			const sym1 = new SymbolicLink('/fake_dir/childdir/sym1.md');
			const sym2 = new SymbolicLink('/fake_dir/childdir/sym2');
			expect(sym1.isBrokenSync()).to.eql(false);
			return sym2.isBroken().then(ret => {
				expect(ret).to.eql(true);
			});
		});

	});
});