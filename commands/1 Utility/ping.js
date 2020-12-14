const { Message } = require('discord.js');
const { DiscordPermissions } = require('../../PinguPackage');

module.exports = {
    name: 'ping',
    description: `Tells you the latency`,
    usage: '',
    id: 1,
    examples: null,
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {Message} message @param {string[]} args*/
    async execute(message, args) {
        let sent = await message.channel.send(`Calculating...`);
        let latency = sent.createdTimestamp - message.createdTimestamp;
        console.log(`Ping: ${latency}`);

        sent.edit(
            `My latency: ${latency}ms\n` +
            `Discord API latency: ${message.client.ws.ping}ms`
        );
    }
}