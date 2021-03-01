const { PinguCommand } = require('PinguPackage');
module.exports = new PinguCommand('login', 'DevOnly', `Relogs me`, null, async () => {
    var shell = require('shelljs');
    shell.exec('git pull');
    process.exit(1);
})