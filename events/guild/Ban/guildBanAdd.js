const { PinguEvent, EmbedField } = require("PinguPackage");

module.exports = new PinguEvent('guildBanAdd',
    async function setContent(client, embed, ban) {
        const { guild, user, reason } = ban;

        if (!guild.me.permissions.has('VIEW_AUDIT_LOG')) {
            return module.exports.content = embed.setDescription(`${user} was unbanned`);
        }

        let banAudits = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' });
        let { executor, createdAt } = banAudits.entries.find(e => e.target.id == user.id && e.reason == reason);

        let pGuild = client.pGuilds.get(ban);
        let pGuildClient = client.toPClient(pGuild);

        return module.exports.content = embed
            .setDescription(`**${user}** was unbanned.`)
            .setColor(pGuildClient.embedColor || client.DefaultEmbedColor)
            .addFields([
                new EmbedField(`Banned Since`, createdAt, true),
                new EmbedField(`Banned By`, executor, true),
                new EmbedField(`Ban Reason`, reason, true)
            ])
    }
);