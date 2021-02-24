const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require('PinguPackage');

module.exports = new PinguEvent('emojiDelete',
    async function setContent(emote) {
        if (!emote.guild.me.hasPermission('VIEW_AUDIT_LOG'))
            return module.exports.content = new MessageEmbed().setDescription(`${emote} was deleted`);

        let auditLogs = await emote.guild.fetchAuditLogs({ type: 'EMOJI_DELETE' })
        let { executor } = auditLogs.entries.first();

        return module.exports.content = new MessageEmbed().setDescription(`${emote} was deleted by ${executor}`);
    }
);