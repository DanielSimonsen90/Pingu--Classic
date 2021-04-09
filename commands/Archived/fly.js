const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('fly', 'Fun', 'The ability to fly', null, async ({ message }) => {
    return message.channel.send(`Are you aware of the fact I'm a literal penguin?...`);
});