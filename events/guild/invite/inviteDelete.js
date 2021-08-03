const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require('PinguPackage');

module.exports = new PinguEvent('inviteDelete',
    async function setContent(client, { code, guild }) {
        if (!guild.me.hasPermission('VIEW_AUDIT_LOG')) return module.exports.content = new MessageEmbed({ description: `Invite, ${code}, was deleted.` })

        let auditLogs = await guild.fetchAuditLogs({ type: 'INVITE_DELETE' });
        let { executor } = auditLogs.entries.first();

        return module.exports.content = new MessageEmbed({ description: `Invite link, ${code}, was deleted by ${executor}` })
    }
);