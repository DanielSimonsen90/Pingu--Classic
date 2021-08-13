const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('roleDelete',
    async function setContent(client, embed, role) {
        if (!role.guild.me.permissions.has('VIEW_AUDIT_LOG'))
            return module.exports.content = embed.setDescription(`${role} was deleted.`);

        let auditLogs = await role.guild.fetchAuditLogs({ type: 'ROLE_DELETE' });
        let executor = auditLogs.entries.first()?.executor;

        return module.exports.content = embed.setDescription(`${role} was deleted${(executor ? ` by ${executor}` : "")}.`);
    }
);