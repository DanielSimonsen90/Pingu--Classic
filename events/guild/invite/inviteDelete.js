const { PinguEvent } = require('PinguPackage');

module.exports = new PinguEvent('inviteDelete',
    async function setContent(client, embed, { code, guild }) {
        if (!guild.me.permissions.has('VIEW_AUDIT_LOG')) return module.exports.content = embed.setDescription(`Invite, ${code}, was deleted.`);

        let auditLogs = await guild.fetchAuditLogs({ type: 'INVITE_DELETE' });
        let { executor } = auditLogs.entries.first();

        return module.exports.content = embed.setDescription(`Invite link, ${code}, was deleted by ${executor}`);
    }
);