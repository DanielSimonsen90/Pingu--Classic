const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('channelDelete',
    async function setContent(channel) {
        if (!channel.guild || !channel.guild.me.hasPermission('VIEW_AUDIT_LOG')) return module.exports.content = new MessageEmbed().setDescription(`#${channel.name} was deleted.`);

        let audits = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE' });
        let { executor } = audits.entries.first();

        return module.exports.content = new MessageEmbed().setDescription(`${channel.name} was deleted by ${executor}`)
    }
);