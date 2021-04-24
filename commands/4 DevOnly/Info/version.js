const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('version', 'DevOnly', `Sends the version I'm running`, null, async ({ client, message }) => {
    return message.channel.send(`Currently running version **${client.config.version}**`);
});