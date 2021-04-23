const { PinguCommand, HandleDecidables } = require('PinguPackage');
const giveaway = require('../../../1 Utility/Decidable/giveaway');

module.exports = new PinguCommand('theme', 'GuildSpecific', `Themes for Danho's Discord`, {
    usage: giveaway.usage,
    guildOnly: true,
    specificGuildID: '405763731079823380',
    examples: giveaway.examples,
    permissions: giveaway.permissions
}, async ({ message, args, pGuild, pGuildClient }) => {
    return HandleDecidables({
        message, args, pGuild, pGuildClient,
        decidablesType: 'Theme',
        reactionEmojis: ['🎭'],
        listEmojis: ['⬅️', '🗑️', '➡️', '🛑'],
        config: pGuild.settings.config.decidables.themeConfig
    })
});