const { Message } = require('discord.js');
const { HandleDecidables, PinguGuild, PinguUser, DiscordPermissions, PClient, DecidablesTypes, PinguLibrary } = require('PinguPackage');

module.exports = {
    name: 'suggestion',
    description: 'Suggest something',
    usage: '<setup> | <list> | [#channel] <suggestion>',
    guildOnly: true,
    id: 1,
    examples: [""],
    permissions: [
        DiscordPermissions.SEND_MESSAGES,
        DiscordPermissions.ADD_REACTIONS,
        DiscordPermissions.MANAGE_MESSAGES
    ],
    aliases: ["suggest"],
    /**@param {{message: Message, args: string[], pAuthor: PinguUser, pGuild: PinguGuild, pGuildClient: PClient}}*/
    async execute({ message, args, pAuthor, pGuild, pGuildClient }) {
        return await HandleDecidables({
            message, args, pGuild, pGuildClient,
            decidablesType: DecidablesTypes.Suggestion,
            reactionEmojis: [PinguLibrary.SavedServers.DanhoMisc(client).emojis.cache.find(e => e.name == 'Checkmark'), '❌'],
            listEmojis: ['⬅️', '🗑️', '➡️', '🛑'],
            config: pGuild.suggestionConfig
        })
    }
}
