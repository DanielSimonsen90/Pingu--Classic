const { PinguCommand, HandleDecidables } = require('PinguPackage');

module.exports = new PinguCommand('giveaway', 'Utility', 'Giveaway time!', {
    usage: 'setup | list | <time> [winners] [channel] <prize>',
    guildOnly: true,
    examples: ["setup", "list", "10m Discord Nitro", "24h 2w Movie tickets for 2!"],
    permissions: ["ADD_REACTIONS", "MANAGE_MESSAGES"],
    aliases: ["ga"]
}, async ({ message, args, pGuild, pGuildClient }) => {
    return await HandleDecidables({
        message, args, pGuild, pGuildClient,
        decidablesType: 'Giveaway',
        reactionEmojis: ['🤞'],
        listEmojis: ['⬅️', '🗑️', '➡️', '🛑'],
        config: pGuild.settings.config.decidables.giveawayConfig
    })
});