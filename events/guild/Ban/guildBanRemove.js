const { PinguEvent, EmbedField } = require("PinguPackage");

module.exports = new PinguEvent('guildBanRemove',
    async function setContent(client, embed, ban) {
        const { guild, user, reason: unbanReason } = ban;

        if (!guild.me.permissions.has('VIEW_AUDIT_LOG')) {
            return module.exports.content = embed.setDescription(`${user} was unbanned`);
        }

        let banAudits = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' });
        let banAudit = banAudits.entries.find(e => e.target.id == user.id);

        let unBanAudits = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE' });
        let unBanAudit = unBanAudits.entries.find(e => e.target.id == user.id);

        const { executor: by, reason, createdAt: banSince } = banAudit;
        const { executor: unbannedBy, createdAt: unbanSince } = unBanAudit;

        let pGuild = client.pGuilds.get(guild);
        let pGuildClient = client.toPClient(pGuild);

        return module.exports.content = embed
            .setDescription(`**${user}** was unbanned.`)
            .setColor(pGuildClient.embedColor || client.DefaultEmbedColor)
            .addFields([
                new EmbedField(`Banned Since`, banSince, true),
                new EmbedField(`Banned By`, by, true),
                new EmbedField(`Ban Reason`, reason, true),
                new EmbedField(`Unbanned At`, unbanSince, true),
                new EmbedField(`Unbanned By`, unbannedBy, true),
                new EmbedField(`Unban Reason`, unbanReason, true),
            ]);
    }
);