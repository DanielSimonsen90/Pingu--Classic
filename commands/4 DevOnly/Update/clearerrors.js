const { PinguCommand } = require('PinguPackage');
const fs = require('fs');

module.exports = new PinguCommand('clearerrors', 'DevOnly', `Clears all errors in folder`, {
    
}, async ({ message }) => {
    const errorPath = '../../../errors';

    const errorFolder = fs.readdirSync(errorPath);
    if (!errorFolder) return message.channel.send(`Error folder not found!`);

    const files = errorFolder.filter(file => file.endsWith('.json'));
    const { length } = files;

    files.forEach(file => fs.unlink(`${errorPath}/${file}`));

    return message.channel.send(`Deleted ${length} errors.`);
})