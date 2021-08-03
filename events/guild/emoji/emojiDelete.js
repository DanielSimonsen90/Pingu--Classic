const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require('PinguPackage');

module.exports = new PinguEvent('emojiDelete',
    async function setContent(cilent, emote) {
        const { guild } = emote;

        if (!guild.me.hasPermission('VIEW_AUDIT_LOG'))
            return module.exports.content = new MessageEmbed({ description: `${emote} was deleted` })

        let auditLogs = await guild.fetchAuditLogs({ type: 'EMOJI_DELETE' })
        let { executor } = auditLogs.entries.first();

        return module.exports.content = new MessageEmbed({ description: `${emote} was deleted by ${executor}` })
    }
);