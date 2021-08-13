const { PinguEvent } = require('PinguPackage');

module.exports = new PinguEvent('emojiDelete',
    async function setContent(cilent, embed, emote) {
        const { guild } = emote;

        if (!guild.me.permissions.has('VIEW_AUDIT_LOG'))
            return module.exports.content = embed.setDescription(`${emote} was deleted`);

        let auditLogs = await guild.fetchAuditLogs({ type: 'EMOJI_DELETE' })
        let { executor } = auditLogs.entries.first();

        return module.exports.content = embed.setDescription(`${emote} was deleted by ${executor}`);
    }
);