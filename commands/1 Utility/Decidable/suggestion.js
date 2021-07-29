const { PinguCommand, HandleDecidables } = require('PinguPackage');

module.exports = new PinguCommand('suggestion', 'Utility', 'Suggest something', {
    usage: '<setup> | <list> | [#channel] <suggestion>',
    guildOnly: true,
    examples: ["setup", "list", "Give more Nitro away"],
    permissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
    aliases: ["suggest"]
}, async ({ client, message, args, pGuild, pGuildClient }) => {
    return HandleDecidables({
        client, message, args, pGuild, pGuildClient,
        decidablesType: 'Suggestion',
        reactionEmojis: ['👍', '👎'],
        config: pGuild.settings.config.decidables.suggestionConfig
    })
});