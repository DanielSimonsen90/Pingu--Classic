const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand(`events`, `DevOnly`, `Lists all events I'm listening to`, {
    aliases: ['commands']
}, async ({ client, message, args, pAuthor, pGuildMember, pGuild, pGuildClient }) => {
    const isEvents = message.content.toLowerCase().includes('events');

    return message.channel.send(`I'm currently listening to:\n${(isEvents ? client.subscribedEvents : client.commands).map(e => `${e}\n`)}`);
})