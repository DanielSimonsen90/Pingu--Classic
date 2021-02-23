const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require('PinguPackage');

module.exports = new PinguEvent('inviteDelete',
    async function setContent(invite) {
        let auditLogs = await invite.guild.fetchAuditLogs({ type: 'INVITE_DELETE' });
        let { executor } = auditLogs.entries.first();

        return module.exports.content = new MessageEmbed().setDescription(`Invite link, ${invite.code}, was deleted by ${executor}`);
    }
);