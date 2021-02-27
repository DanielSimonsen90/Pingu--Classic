const { PinguCommand, PinguLibrary, HandleDecidables } = require('PinguPackage');
const giveaway = require('../../1 Utility/Decidable/giveaway');

module.exports = new PinguCommand('theme', 'GuildSpecific', `Themes for Danho's Discord`, {
    usage: giveaway.usage,
    guildOnly: true,
    specificGuildID: '405763731079823380',
    examples: giveaway.examples,
    permissions: giveaway.permissions
}, async ({ message, args, pGuild, pGuildClient }) => {
    let deadlyNinja = PinguLibrary.SavedServers.DeadlyNinja(message.client);

    if (!message.guild.id == deadlyNinja.id)
        return message.channel.send(`This command is only for ${deadlyNinja.name}!`);

    return HandleDecidables({
        message, args, pGuild, pGuildClient,
        decidablesType: 'Theme',
        reactionEmojis: ['🎭'],
        listEmojis: ['⬅️', '🗑️', '➡️', '🛑'],
        config: pGuild.settings.config.themeConfig
    })
});