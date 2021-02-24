const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require('PinguPackage');

module.exports = new PinguEvent('inviteDelete',
    async function setContent(invite) {
        if (!invite.guild.me.hasPermission('VIEW_AUDIT_LOG')) return module.exports.content = new MessageEmbed().setDescription(`Invite, ${invite.code}, was deleted.`);

        let auditLogs = await invite.guild.fetchAuditLogs({ type: 'INVITE_DELETE' });
        let { executor } = auditLogs.entries.first();

        return module.exports.content = new MessageEmbed().setDescription(`Invite link, ${invite.code}, was deleted by ${executor}`);
    }
);