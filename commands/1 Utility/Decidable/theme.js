const { Message } = require('discord.js');
const { PinguLibrary, PinguGuild, PinguUser, DiscordPermissions, PClient, HandleDecidables, DecidablesTypes, PChannel, ThemeConfig } = require('PinguPackage');
const giveaway = require('./giveaway');

module.exports = {
    name: 'themes',
    description: `Themes for Danho's Discord`,
    usage: giveaway.usage,
    guildOnly: true,
    id: 1,
    examples: giveaway.examples,
    permissions: giveaway.permissions,
    aliases: giveaway.aliases,
    /**@param {{message: Message, args: string[], pAuthor: PinguUser, pGuild: PinguGuild, pGuildClient: PClient}}*/
    execute({ message, args, pAuthor, pGuild, pGuildClient }) {
        let deadlyNinja = PinguLibrary.SavedServers.DeadlyNinja(message.client);

        if (!message.guild.id == deadlyNinja.id)
            return message.channel.send(`This command is only for ${deadlyNinja.name}!`);

        return HandleDecidables({
            message, args, pGuild, pGuildClient,
            decidablesType: DecidablesTypes.Theme,
            reactionEmojis: ['🎭'],
            listEmojis: ['⬅️', '🗑️', '➡️', '🛑'],
            config: pGuild.themeConfig
        })
    }
}