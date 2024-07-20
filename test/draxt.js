/* global describe, it, beforeEach, afterEach*/
const draxt = require('../src/draxt'),
    {expect} = require('chai'),
    {execSync} = require('child_process'),
    {Node} = draxt;

const contentList = ['a.js', 'another_dir', 'another_example_file.md', 'b.md', 'example_file.md'];
const mkfs = () => {
    const pre = `
					rm -r /tmp/draxt_test_dir
					mkdir /tmp/draxt_test_dir
					echo 'example content' > /tmp/draxt_test_dir/example_file.md
					echo 'example content' > /tmp/draxt_test_dir/another_example_file.md
					mkdir /tmp/draxt_test_dir/another_dir
					echo '...' > /tmp/draxt_test_dir/a.js
					ln -s /tmp/draxt_test_dir/another_example_file /tmp/draxt_test_dir/b.md
				`;
    execSync(pre);
};
describe('draxt', function () {
    beforeEach(function () {
        mkfs();
    });

    afterEach(function () {
        mkfs();
    });

    it('basic initialization', function () {
        expect(draxt()).to.be.instanceof(draxt);
        expect(draxt().length).to.eql(0);
        expect(() => draxt(['str'])).to.throw('Invalid value for `items` parameter');
        const items_one = [new Node('pathName')];
        const d_one = draxt(items_one);
        expect(d_one.length).to.eql(1);
        expect(d_one.items).to.eql(items_one);
        expect(draxt.fn).to.eql(draxt.prototype);
    });

    it('initialization with query', function () {
        return draxt('/tmp/draxt_test_dir/*').then((d) => {
            expect(d).to.be.instanceof(draxt);
            expect(d.length).to.eql(5);
            expect(draxt(d).items).to.eql(d.items);
            expect(draxt(d).length).to.eql(d.length);
            // make sure the `items` parameter has been cloned!
            expect(draxt(d).items === d.items).to.eql(false);
        });
    });

    it('.sync()', function () {
        const result = draxt.sync('/tmp/draxt_test_dir');
        expect(result).to.be.instanceof(draxt);
        expect(result.length).to.eql(1);
        expect(draxt.sync('/tmp/draxt_test_dir/*').length).to.eql(5);
    });

    it('.extend()', function () {
        const exampleFunc = function () {
            return 'exampleFunc';
        };
        draxt.extend({
            exampleFunc,
        });
        expect(draxt.prototype.exampleFunc).to.eql(exampleFunc);
        expect(draxt.fn.exampleFunc).to.eql(exampleFunc);
    });

    it('.add()', function () {
        const d = draxt();
        expect(d.length).to.eql(0);
        const node = new Node('pathName');
        d.add(node);
        expect(d.length).to.eql(1);
        // should not add a duplicate item!
        d.add(node);
        expect(d.length).to.eql(1);
        d.add(new Node('pathName'));
        expect(d.length).to.eql(1);
        d.add(new Node('pathName2'));
        expect(d.length).to.eql(2);
        const d2 = draxt([new Node('pathName3')]);
        d.add(d2);
        expect(d.length).to.eql(3);
    });

    it('.get()', function () {
        const d = draxt.sync('/tmp/draxt_test_dir/*');
        const node = d.get();
        expect(node).to.be.an('array');
        expect(node).to.be.eql(d.items);
        expect(d.get(0)).to.be.eql(d.items[0]);
    });

    it('.first() && .last()', function () {
        const d = draxt.sync('/tmp/draxt_test_dir/*');
        expect(d.first()).to.eql(d.items[0]);
        expect(d.last()).to.eql(d.items.pop());
    });

    it('.has()', function () {
        const d = draxt.sync('/tmp/draxt_test_dir/*');
        expect(d.has('/tmp/draxt_test_dir/another_dir')).to.eql(true);
        expect(d.has(new Node('/tmp/draxt_test_dir/another_dir'))).to.eql(true);
        expect(d.has('/tmp/draxt_test_dir/non_existent')).to.eql(false);
    });

    it('.slice()', function () {
        const d = draxt.sync('/tmp/draxt_test_dir/**');
        expect(d.length).to.eql(6);
        const d2 = d.slice(0, 4);
        expect(d2).to.be.instanceof(draxt);
        expect(d2.length).to.be.eql(4);
        const d3 = d.slice(-1);
        expect(d3.length).to.eql(1);
        expect(d3.get(0)).to.be.instanceof(Node);
    });

    it('.filter()', function () {
        const d = draxt.sync('/tmp/draxt_test_dir/**');
        const d2 = d.filter((node) => {
            return node.isFile();
        });
        expect(d2).to.be.instanceof(draxt);
        expect(d === d2).to.eql(false);
        expect(d2.length).to.eql(3);
    });

    it('.map()', function () {
        const d = draxt.sync('/tmp/draxt_test_dir/*');
        const res = d.map((node) => node.baseName);
        res.sort();
        expect(res.length).to.eql(d.length);
        expect(res).to.be.an('array');
        expect(res).to.eql(contentList);
    });

    it('.mapAsync', function () {
        const d = draxt.sync('/tmp/draxt_test_dir/*');
        const res = d.mapAsync((node) => {
            return new Promise((res) => {
                setTimeout(() => res(node.baseName), 30);
            });
        });
        expect(res).to.be.instanceof(Promise);
        return res.then((baseNames) => {
            baseNames.sort();
            expect(baseNames).to.eql(contentList);
        });
    });

    it('.each() && .forEach()', function () {
        const d = draxt.sync('/tmp/draxt_test_dir/*');
        expect(d.each).to.be.eql(d.forEach);
        const res = [];
        expect(d.forEach((node) => res.push(node.baseName))).to.eql(d);
        res.sort();
        expect(res).to.eql(contentList);
    });

    it('.some', function () {
        const d = draxt.sync('/tmp/draxt_test_dir/*');
        const res = d.some((node) => node.baseName === 'another_dir');
        const res2 = d.some((node) => node.baseName === 'non_existent');
        expect(res).to.eql(true);
        expect(res2).to.eql(false);
    });

    it('.sort() && .reverse()', function () {
        const d = draxt.sync('/tmp/draxt_test_dir/*');
        const originalNodesBackup = d.get().slice();
        expect(d.reverse().get()).to.eql(originalNodesBackup.reverse());
    });

    it('.directories()', function () {
        const d = draxt.sync('/tmp/draxt_test_dir/**');
        const dirs = d.directories();
        expect(dirs.length).to.eql(2);
        expect(dirs === d).to.eql(false);
    });

    it('.files()', function () {
        const d = draxt.sync('/tmp/draxt_test_dir/**');
        const files = d.files();
        expect(files.length).to.eql(3);
        expect(files === d).to.eql(false);
    });

    it('.symlinks()', function () {
        const d = draxt.sync('/tmp/draxt_test_dir/**');
        const symlinks = d.symlinks();
        expect(symlinks.length).to.eql(1);
        expect(symlinks).to.be.instanceof(draxt);
    });

    it('.empty()', function () {
        const d = draxt.sync('/tmp/draxt_test_dir/**');
        expect(d.length).to.eql(6);
        expect(d.empty()).to.eql(d);
        expect(d.length).to.eql(0);
    });

    it('.drop()', function () {
        const d = draxt.sync('/tmp/draxt_test_dir/**');
        expect(d.length).to.eql(6);
        d.drop('/tmp/draxt_test_dir/example_file.md');
        expect(d.length).to.eql(5);
        d.drop([new Node('/tmp/draxt_test_dir/another_example_file.md'), '/non_existent']);
        expect(d.length).to.eql(4);
        const d2 = draxt.sync('/tmp/draxt_test_dir/another_dir/*');
        d.drop(d2);
        expect(d.length).to.eql(4);
        d.drop(new Node('/tmp/draxt_test_dir'));
        expect(d.length).to.eql(3);
        expect(() => d.drop(new Date())).to.throw('Invalid paramter passed to');
    });
});
