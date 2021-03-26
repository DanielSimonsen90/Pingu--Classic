const { HTMLTheme } = require('fliegdoc');

module.exports = {
	baseUrl: '/',
	outDir: './docs',
	readme: './README.md',
	modules: [
		{
			package: './package.json',
			tsconfig: './tsconfig.json',
			mainFile: './src/index.ts'
		}
	],
	title: 'Documentation - PinguPackage', // appears in the page title and header
	externalLinks: {}, // e.g.: { "GitHub": "https://github.com/fliegwerk/fliegdoc" }
	hidePrivateMembers: true,
	theme: HTMLTheme
};