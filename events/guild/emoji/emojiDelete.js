const { Client, GuildEmoji, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'events: emojiDelete',
    /**@param {{ emote: GuildEmoji }}*/
    async setContent({ emote }) {
        let auditLogs = await emote.guild.fetchAuditLogs({ type: 'EMOJI_DELETE' })
        let { executor } = auditLogs.entries.first();

        return module.exports.content = new MessageEmbed().setDescription(`${emote} was deleted by ${executor}`);
    },
    /**@param {Client} client
     @param {{emote: GuildEmoji}}*/
    execute(client, { emote }) {

    }
}