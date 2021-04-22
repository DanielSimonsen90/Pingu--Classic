const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('channelDelete',
    async function setContent(channel) {
        let channelDeleted = `#${channel.name} was deleted`;
        if (!channel.guild || !channel.guild.me.hasPermission('VIEW_AUDIT_LOG')) return module.exports.content = new MessageEmbed().setDescription(`${channelDeleted}.`);

        let audits = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE' });
        let { executor } = audits.entries.first();

        return module.exports.content = new MessageEmbed().setDescription(`${channelDeleted} by ${executor}`);
    }
);