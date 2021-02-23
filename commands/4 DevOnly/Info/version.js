const { PinguCommand, config } = require('PinguPackage');

module.exports = new PinguCommand('version', 'DevOnly', `Sends the version I'm running`, null, async ({ message }) => {
    return message.channel.send(`Currently running version **${config.version}**`)
});