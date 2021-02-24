const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('sort', 'Utility', 'Alphabetically sorts given values', {
    usage: ' Option1, Option number 2, option3, and so on idk man',
    examples: ['Please, Sort, These, Words']
}, async ({ message, args }) => {
    if (!args || args.length == 1) return message.channel.send(`Give me something to sort!`);

    let arguments = args.join(' ').split(',').sort((a, b) => a > b ? 1 : -1);
    let result = arguments.join(', ');

    PinguLibrary.consoleLog(message.client, `Arguments:\n${arguments}\n\nResult:\n${result}`);
    return message.channel.send(result);
});