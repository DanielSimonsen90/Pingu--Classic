const { PinguCommand } = require('PinguPackage');
module.exports = new PinguCommand('restart', 'DevOnly', `Relogs me`, null, async ({ message }) => {
    await require('./pull').execute({ message });
    process.exit(1);
})