const { PinguCommand } = require('PinguPackage');
module.exports = new PinguCommand('restart', 'DevOnly', `Relogs me`, null, async ({ message }) => {
    await message.react('👌');
    require('shelljs').exec('git pull');
    process.exit(1);
})