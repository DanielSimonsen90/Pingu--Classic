const { PinguCommand, HandleDecidables } = require('PinguPackage');

module.exports = new PinguCommand('giveaway', 'Utility', 'Giveaway time!', {
    usage: 'setup | list | <time> [winners] [channel] <prize>',
    guildOnly: true,
    examples: ["setup", "list", "10m Discord Nitro", "24h 2w Movie tickets for 2!"],
    permissions: ["ADD_REACTIONS", "MANAGE_MESSAGES"],
    aliases: ["ga"]
}, async ({ client, message, args, pGuild, pGuildClient }) => {
    return HandleDecidables({
        client, message, args, pGuild, pGuildClient,
        decidablesType: 'Giveaway',
        reactionEmojis: ['🤞'],
        config: pGuild.settings.config.decidables.giveawayConfig
    })
});