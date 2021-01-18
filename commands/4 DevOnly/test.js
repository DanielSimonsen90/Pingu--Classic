const { Message } = require('discord.js');
const { PinguLibrary, PinguGuild, PinguUser, DiscordPermissions } = require('../../PinguPackage');

module.exports = {
    name: 'test',
    description: 'Danho test script',
    usage: '',
    guildOnly: false,
    id: 4,
    examples: [""],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message, args: string[], pAuthor: PinguUser, pGuild: PinguGuild}}*/
    execute({ message, args, pAuthor, pGuild }) {
        let msg = "";
        let limit = 0;
        message.guild.channels.cache.forEach(channel => {
            if (limit == 10) return;
            msg += `${channel}: ${channel.position}\n`
            limit++;
        })
        message.channel.send(msg);
    }
}