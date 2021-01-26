const { Message } = require('discord.js');
const { PinguLibrary, PinguGuild, PinguUser, DiscordPermissions } = require('../../PinguPackage');

module.exports = {
    name: 'viberate',
    description: 'Pingu be rating your vibe',
    usage: '[user]',
    guildOnly: true,
    id: 2,
    examples: [""],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message, args: string[], pAuthor: PinguUser, pGuild: PinguGuild}}*/
    execute({ message, args, pAuthor, pGuild }) {
        let vibe = Math.floor(Math.random() * 10);
        if (message.mentions.users.first()) {
            var mention = message.mentions.users.first();
        }
        return message.channel.send(`I rate ${(mention ? `${mention.username}'s` : `your`)} vibe to be **${vibe}**! ${(vibe > 7 ? `${(mention ? `They` : `You`)} do be vibin doe!` : ``)}`);
    }
}