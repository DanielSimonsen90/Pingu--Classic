const { PinguCommand, HandleDecidables } = require('PinguPackage');
const { usage, examples, permissions } = require('../../../1 Utility/Decidable/giveaway');

module.exports = new PinguCommand('theme', 'GuildSpecific', `Themes for Danho's Discord`, {
    usage, examples, permissions,
    guildOnly: true,
    specificGuildID: '405763731079823380',
}, async ({ client, message, args, pGuild, pGuildClient }) => {
    return HandleDecidables({
        client, message, args, pGuild, pGuildClient,
        decidablesType: 'Theme',
        reactionEmojis: ['🎭'],
        config: pGuild.settings.config.decidables.themeConfig
    })
});