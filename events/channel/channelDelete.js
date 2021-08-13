const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('channelDelete',
    async function setContent(client, embed, channel) {
        let channelDeleted = `#${channel.name} was deleted`;
        if (!channel.guild || !channel.guild.me.permissions.has('VIEW_AUDIT_LOG')) return module.exports.content = embed.setDescription(`${channelDeleted}.`);

        let audits = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE' });
        let { executor } = audits.entries.first();

        return module.exports.content = embed.setDescription(`${channelDeleted} by ${executor}`);
    }
);