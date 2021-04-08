const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('pull', 'DevOnly', `Pulls from Repos`, null, async ({ message }) => {
	require('shelljs').exec('git pull');
	await message.react('👌');
	return message;
})