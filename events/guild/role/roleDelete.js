const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('roleDelete',
    async function setContent(client, role) {
        if (!role.guild.me.hasPermission('VIEW_AUDIT_LOG'))
            return module.exports.content = new MessageEmbed({ description: `${role} was deleted.` })

        let auditLogs = await role.guild.fetchAuditLogs({ type: 'ROLE_DELETE' });
        let executor = auditLogs.entries.first()?.executor;

        return module.exports.content = new MessageEmbed({ description: `${role} was deleted${(executor ? ` by ${executor}` : "")}.` })
    }
);