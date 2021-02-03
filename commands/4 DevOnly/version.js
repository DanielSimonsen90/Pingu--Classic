const { Message } = require('discord.js');
const { PinguLibrary, PinguGuild, PinguUser, DiscordPermissions, PClient } = require('../../PinguPackage');

module.exports = {
    name: 'version',
    description: 'Sends version of Pingu',
    usage: '',
    guildOnly: false,
    id: 4,
    examples: [""],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message, args: string[], pAuthor: PinguUser, pGuild: PinguGuild, pGuildClient: PClient}}*/
    execute({ message, args, pAuthor, pGuild, pGuildClient }) {
        message.channel.send(`Currently running version ${require('../../config.json').version}`)
    }
}