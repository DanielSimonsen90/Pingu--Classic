const { Message } = require('discord.js'),
    { PinguGuild, HandleDecidables, DecidablesTypes, DiscordPermissions, PClient } = require('PinguPackage');

module.exports = {
    name: 'poll',
    description: 'Create a poll for users to react',
    usage: '<setup> | <list> | <time> [channel] <question>',
    guildOnly: true,
    id: 1,
    example: ["setup", "list", "10m Am I asking a question?"],
    permissions: [
        DiscordPermissions.SEND_MESSAGES,
        DiscordPermissions.ADD_REACTIONS,
        DiscordPermissions.MANAGE_MESSAGES
    ],
    /**@param {{message: Message, args: string[], pGuild: PinguGuild, pGuildClient: PClient}}*/
    async execute({ message, args, pGuild, pGuildClient }) {
        return await HandleDecidables({
            message, args, pGuild, pGuildClient,
            decidablesType: DecidablesTypes.Poll,
            reactionEmojis: ['👍', '👎'],
            listEmojis: ['⬅️', '🗑️', '➡️', '🛑'],
            config: pGuild.pollConfig
        })
    },
};
