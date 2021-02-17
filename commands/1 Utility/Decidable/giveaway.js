const { Message } = require('discord.js'),
    { DiscordPermissions, HandleDecidables, DecidablesTypes, PinguGuild, PClient } = require('PinguPackage');

module.exports = {
    name: 'giveaway',
    description: 'Giveaway time!',
    usage: 'setup | list | <time> [winners] [channel] <prize>',
    guildOnly: true,
    id: 1,
    examples: ["setup", "list", "10m Discord Nitro", "24h 2w Movie tickets for 2!"],
    permissions: [
        DiscordPermissions.SEND_MESSAGES,
        DiscordPermissions.MANAGE_MESSAGES,
        DiscordPermissions.ADD_REACTIONS
    ],
    aliases: ["ga"],
    /**@param {{message: Message, args: string[], pGuild: PinguGuild, pGuildClient: PClient}}*/
    async execute({ message, args, pGuild, pGuildClient }) {
        return await HandleDecidables({
            message, args, pGuild, pGuildClient,
            decidablesType: DecidablesTypes.Giveaway,
            reactionEmojis: ['🤞'],
            listEmojis: ['⬅️', '🗑️', '➡️', '🛑'],
            config: pGuild.giveawayConfig
        })
    },
};