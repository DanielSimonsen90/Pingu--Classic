const { Client, GuildEmoji, MessageEmbed } = require("discord.js");
const { PinguEvent } = require('PinguPackage');

module.exports = new PinguEvent('emojiDelete',
    async function setContent(emote) {
        let auditLogs = await emote.guild.fetchAuditLogs({ type: 'EMOJI_DELETE' })
        let { executor } = auditLogs.entries.first();

        return module.exports.content = new MessageEmbed().setDescription(`${emote} was deleted by ${executor}`);
    }
);