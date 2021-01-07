const { Message } = require('discord.js');
const { DiscordPermissions, PinguLibrary } = require('../../PinguPackage');

module.exports = {
    name: 'ping',
    description: `Tells you the latency`,
    usage: '',
    id: 1,
    examples: null,
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message}}*/
    async execute({ message }) {
        let sent = await message.channel.send(`Calculating...`);
        let latency = sent.createdTimestamp - message.createdTimestamp;
        PinguLibrary.ConsoleLog(`Ping: ${latency}ms`);

        sent.edit(
            `My latency: ${latency}ms\n` +
            `Discord API latency: ${message.client.ws.ping}ms`
        );
    }
}