const { PinguCommand, HandleDecidables, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('suggestion', 'Utility', 'Suggest something', {
    usage: '<setup> | <list> | [#channel] <suggestion>',
    guildOnly: true,
    examples: ["setup", "list", "Give more Nitro away"],
    permissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
    aliases: ["suggest"]
}, async ({ message, args, pGuild, pGuildClient }) => {
    return await HandleDecidables({
        message, args, pGuild, pGuildClient,
        decidablesType: 'Suggestion',
        reactionEmojis: [PinguLibrary.SavedServers.DanhoMisc(client).emojis.cache.find(e => e.name == 'Checkmark'), '❌'],
        listEmojis: ['⬅️', '🗑️', '➡️', '🛑'],
        config: pGuild.settings.config.suggestionConfig
    })
});