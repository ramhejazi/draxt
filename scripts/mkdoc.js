const jsdoc = require('jsdoc-api');
const fs = require('fs-extra');
const path = require('path');
const links = require('./links');
const docsPath = path.join(__dirname, '../docs');
const repoPath = 'https://github.com/ramhejazi/draxt/blob/master/src';
const interfaces = [
	'interfaces/Node.js',
	'interfaces/File.js',
	'interfaces/Directory.js',
	'interfaces/SymbolicLink.js',
];

// function log(item) {
// 	console.log(require('util').inspect(item, { depth: null }));
// }

/**
 * @prop {string} clsName Name of class
 * @prop {string} instanceName camelCased class name
 * @prop {object} clsDesc Class description
 * @prop {array} clsPropsDesc Class properties description
 * @prop {object} constructorDesc Class contructor description
 * @prop {array} descs Class method descriptions
 * @prop {string} source Class file's source
 * @prop {array} lines Doc lines
 * @prop {string} srcPath
 */
class Doc {
	constructor(srcPath, baseClsDoc) {
		this.relativeSrcPath = srcPath;
		this.srcPath = path.join(__dirname, '../src', srcPath);
		this.clsName = path.parse(srcPath).name;
		this.instanceName = this.clsName.replace(/[A-Z]/, el => el.toLowerCase());
		this.docPath = path.join(docsPath, this.clsName + '.md');
		this.source = fs.readFileSync(this.srcPath, 'utf8');
		this.lines = [];
		this.baseClsDoc = baseClsDoc;
		this.explain();
		this.add(`# Interfaces / ${this.clsName}`);
		if ( baseClsDoc ) {
			this.add(Doc.linkify(`Extends \`${baseClsDoc.clsName}\` | [Inherited methods](#inherited-methods-from-node)`));
			this.add('');
		}
		this.add(Doc.linkify(this.clsDesc.classdesc));
		this.addSyntax();
		this.addClsProps();
		this.addMethods();
	}

	explain() {
		const descs = jsdoc.explainSync({
			source: this.source
		}).filter(el => el.description || el.classdesc);
		this.clsDesc = descs.shift();
		this.constructorDesc = descs.shift();
		if ( this.baseClsDoc ) {
			const ownPropNames = this.clsDesc.properties.map(el => el.name);
			let parentClsProps = this.baseClsDoc.clsPropsDesc.filter(el => {
				return ownPropNames.indexOf(el.name) === -1;
			});
			this.clsPropsDesc = this.clsDesc.properties.concat(parentClsProps);
		} else {
			this.clsPropsDesc = this.clsDesc.properties;
		}
		this.methods = descs.reduce((ret, el) => {
			if ( el.name.indexOf('_') !== 0 ) {
				if ( el.scope === 'instance' ) {
					ret.instance.push(el);
				} else {
					ret.static.push(el);
				}
			}
			return ret;
		}, { static: [], instance: []});
	}

	add(lines) {
		this.lines = this.lines.concat(lines);
	}

	writeToFile() {
		fs.writeFileSync(this.docPath, this.lines.join('\n'));
	}

	addCodeSnippet(code) {
		this.add(Doc.toSnippet(code));
	}

	addSyntax(useNew = true) {
		this.add('### Syntax');
		const params = Doc.getParamNames(this.constructorDesc);
		const { instanceName, clsName } = this;
		this.addCodeSnippet(
			`const ${instanceName} =${useNew ? ' new' : '' } ${clsName}(${params});`
		);
	}

	static toSnippet(code) {
		return `\`\`\`js\n${code}\n\`\`\``;
	}

	static linkify(desc = '') {
		return desc.replace(/`([a-zA-Z\-., $()]+)`/g, (text, key) => {
			if ( links.hasOwnProperty(key) ) {
				return `[${text}](${links[key]})`;
			}
			return text;
		});
	}

	static getParamNames(method) {
		let params = '';
		if ( method.params ) {
			const required = method.params.filter(el => el.optional !== true).map(el => el.name);
			const optional = method.params.filter(el => el.optional).map(el => el.name);
			params = required.join(', ');
			if ( optional.length ) {
				if (required.length) {
					params += ' [, ';
				} else {
					params = '[';
				}
				params += `${optional.join(', ')}]`;
			}
		}
		return params;
	}

	addExamples(method) {
		const examples = method.examples;
		if ( examples && examples.length ) {
			examples.forEach(example => {
				this.addCodeSnippet(example);
			});
		}
	}

	static getReturnValues(method) {
		const returns = method.returns || method.return;
		let ret, desc;
		if ( returns ) {
			ret = '`' + returns[0].type.names.join(' `|` ') + '`';
			desc = returns[0].description;
			if ( desc ) {
				ret += ` ${Doc.linkify(desc)}`;
			}
		}

		return ret;
	}

	addMethods() {
		if ( this.methods.instance.length ) {
			this.add('## Methods');
			this.methods.instance.forEach(method => this.addMethod(method));
		}
		if ( this.methods.static.length ) {
			this.add('## Methods');
			this.methods.static.forEach(method => this.addMethod(method));
		}
		if ( this.baseClsDoc ) {
			this.add(Doc.linkify(`### Inherited Methods from \`${this.baseClsDoc.clsName}\``));
			this.baseClsDoc.methods.instance.forEach(method => {
				this.addMethod(method, true);
			});
		}
	}

	addParamsList(method) {
		if ( !method.params || method.params.length === 0 ) {
			return;
		}
		method.params.forEach((param) => {
			let def = `- \`${param.name}\``;
			def += ' (`' + param.type.names.join(' `|` ') + '`)';
			if ( param.defaultvalue ) {
				def += `&nbsp;&nbsp;Default: \`${param.defaultvalue}\``;
			}
			if ( param.description ) {
				def += '&nbsp;&nbsp;–&nbsp;&nbsp;' + Doc.linkify(param.description);
			}
			this.add(def);
		});
		this.add('');
	}

	addClsProps() {
		this.add('### Properties');
		this.clsPropsDesc.forEach(el => {
			this.add(`- **\`${this.instanceName}.${el.name}\`** (\`${el.type.names.join('`|`')}\`)`);
			this.add(Doc.linkify(el.description));
			this.add('');
		})
	}

	addMethod(method, inherited = false) {
		let memberof = method.memberof;
		memberof = method.scope === 'instance' ? this.instanceName : this.clsName;
		const methodPath = inherited ? this.baseClsDoc.relativeSrcPath : this.relativeSrcPath;
		const methodSrcLink = `${repoPath}/${methodPath}#L${method.meta.lineno}`;
		const params = Doc.getParamNames(method);
		const rets = Doc.getReturnValues(method);
		let methodDef = `#### [\`${memberof}.${method.name}(${params})\`](${methodSrcLink})`;
		this.add(methodDef);
		this.addParamsList(method);
		this.add(Doc.linkify(method.description));
		this.addExamples(method);
		if (rets) {
			this.add('');
			this.add(`→ ${rets}`);
		}
		this.add('<br><br>');
	}

}

// Generate interface docs!
let nodeDoc = new Doc(interfaces.shift());
nodeDoc.writeToFile();
interfaces.forEach(el => {
	new Doc(el, nodeDoc).writeToFile();
});

// Let's start again! Draxt is not ES6 class and `Doc` will chalk on it!
nodeDoc.lines = ['# draxt.js'];
let doc = nodeDoc;
doc.clsName = 'draxt';
doc.srcPath = path.join(__dirname, '../src/draxt.js');
doc.instanceName = 'draxtCollection';
doc.relativeSrcPath = 'draxt.js';

const source = fs.readFileSync(doc.srcPath, 'utf8');
const descs = jsdoc.explainSync({ source }).filter(el => el.description);
const constructorDesc = descs.shift();
doc.add(Doc.linkify(constructorDesc.description));
doc.addSyntax(false);
doc.addParamsList(constructorDesc);
doc.addExamples(constructorDesc);
const rets = Doc.getReturnValues(constructorDesc);
if (rets) {
	doc.add('');
	doc.add(`→ ${rets}`);
}
doc.add('<br><br>');
doc.add('## Methods');

descs.forEach(el => {
	doc.addMethod(el);
});

fs.writeFileSync(path.join(docsPath, 'draxt.md'), doc.lines.join('\n'));

