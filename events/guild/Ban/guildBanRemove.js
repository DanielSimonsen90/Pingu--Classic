const { MessageEmbed } = require("discord.js");
const { PinguEvent, EmbedField } = require("PinguPackage");

module.exports = new PinguEvent('guildBanRemove',
    async function setContent(client, guild, user) {
        if (!guild.me.hasPermission('VIEW_AUDIT_LOG')) {
            return module.exports.content = new MessageEmbed({ description: `${user} was unbanned` });
        }

        let banAudits = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' });
        let banAudit = banAudits.entries.find(e => e.target.id == user.id);

        let unBanAudits = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE' });
        let unBanAudit = unBanAudits.entries.find(e => e.target.id == user.id);

        const by = banAudit.executor;
        const reason = banAudit.reason;
        const banSince = banAudit.createdAt;
        const unbannedBy = unBanAudit.executor;
        const unbanSince = unBanAudit.createdAt;

        let pGuild = client.pGuilds.get(guild);
        let pGuildClient = client.toPClient(pGuild);

        return module.exports.content = new MessageEmbed({
            description: `**${user}** was unbanned.`,
            color: pGuildClient.embedColor || client.DefaultEmbedColor,
            fields: [
                new EmbedField(`Banned Since`, banSince, true),
                new EmbedField(`Banned By`, by, true),
                new EmbedField(`Ban Reason`, reason, true),
                new EmbedField(`Unbanned At`, unbanSince, true),
                new EmbedField(`Unbanned By`, unbannedBy, true)
            ]
        })
    }
);