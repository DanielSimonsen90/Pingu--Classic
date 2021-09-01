const { PinguCommand,  TimeLeftObject } = require('PinguPackage');

module.exports = new PinguCommand('uptime', 'Utility', `Shows the uptime for Pingu`, {
    aliases: ["online"],
}, async ({ client, message, args, pAuthor, pGuild, pGuildClient }) => {
    const now = Date.now();
    const uptimestamp = now + client.uptime;
    const uptime = new TimeLeftObject(new Date(now), new Date(uptimestamp));

    return message.channel.send(`I have been online for ${uptime.toString()}`);
})