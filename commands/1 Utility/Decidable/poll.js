const { PinguCommand, HandleDecidables } = require('PinguPackage');

module.exports = new PinguCommand('poll', 'Utility', 'Create a poll for users to react', {
    usage: '<setup> | <list> | <time> [channel] <question>',
    guildOnly: true,
    examples: ["setup", "list", "10m Am I asking a question?"],
    permissions: ["ADD_REACTIONS", "MANAGE_MESSAGES"]
}, async ({ message, args, pGuild, pGuildClient }) => {
    return HandleDecidables({
        message, args, pGuild, pGuildClient,
        decidablesType: 'Poll',
        reactionEmojis: ['👍', '👎'],
        listEmojis: ['⬅️', '🗑️', '➡️', '🛑'],
        config: pGuild.settings.config.decidables.pollConfig
    })
});