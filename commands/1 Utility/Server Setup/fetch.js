const { Message } = require('discord.js');
const { PinguLibrary, PinguGuild, PinguUser, DiscordPermissions, PClient } = require('PinguPackage');

module.exports = {
    name: 'fetch',
    description: 'Fetches provided message id, and saves the message in cache',
    usage: '<message id>',
    guildOnly: true,
    id: 1,
    examples: [""],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    aliases: [""],
    /**@param {{message: Message, args: string[], pAuthor: PinguUser, pGuild: PinguGuild, pGuildClient: PClient}}*/
    async execute({ message, args, pAuthor, pGuild, pGuildClient }) {
        if (!args[0]) return message.channel.send(`Message ID not provided!`);
        else if (isNaN(parseInt(args[0]))) {
            let id = args[0].split('/')[6];
            if (!id) return message.channel.send(`Please provide a proper message id!`);
            args[0] = id;
        }

        if (PinguLibrary.PermissionCheck(message, [DiscordPermissions.READ_MESSAGE_HISTORY]) != PinguLibrary.PermissionGranted)
            return message.channel.send(`I don't have permission to **read message history** here!`);

        let fetched = await message.channel.messages.fetch(args[0]).catch(_ => null);
        if (!fetched) return message.channel.send(`I couldn't fetch that message!`);

        return message.channel.send(`Message fetched!\n${fetched.url}`);

    }
}