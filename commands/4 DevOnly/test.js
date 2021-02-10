const { Message } = require('discord.js');
const { PinguLibrary, PinguGuild, PinguUser, DiscordPermissions } = require('PinguPackage');

module.exports = {
    name: 'test',
    description: 'Danho test script',
    usage: '',
    guildOnly: false,
    id: 4,
    examples: [""],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message, args: string[], pAuthor: PinguUser, pGuild: PinguGuild}}*/
    async execute({ message, args, pAuthor, pGuild }) {

    }
}