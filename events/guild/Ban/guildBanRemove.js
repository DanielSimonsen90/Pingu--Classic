const { MessageEmbed } = require("discord.js");
const { PinguEvent, PinguGuild, EmbedField, PinguClient } = require("PinguPackage");

module.exports = new PinguEvent('guildBanRemove',
    async function setContent(guild, user) {
        if (!guild.me.hasPermission('VIEW_AUDIT_LOG')) {
            return module.exports.content = new MessageEmbed().setDescription(`${user} was unbanned`)
        }

        let banAudits = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' });
        let banAudit = banAudits.entries.find(e => e.target.id == user.id);

        let unBanAudits = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE' });
        let unBanAudit = unBanAudits.entries.find(e => e.target.id == user.id);

        let ban = {
            by: banAudit.executor,
            reason: banAudit.reason,
            banSince: banAudit.createdAt,
            unbannedBy: unBanAudit.executor,
            unBanSince: unBanAudit.createdAt
        }

        let pGuild = await PinguGuild.Get(guild);
        let client = PinguClient.ToPinguClient(guild.client);
        let pGuildClient = client.toPClient(pGuild);

        return module.exports.content = new MessageEmbed()
            .setDescription(`**${user.tag}** was unbanned.`)
            .setColor(pGuildClient.embedColor || client.DefaultEmbedColor)
            .addFields([
                new EmbedField(`Banned Since`, ban.banSince, true),
                new EmbedField(`Banned By`, ban.by, true),
                new EmbedField(`Ban Reason`, ban.reason, true),
                new EmbedField(`Unbanned At`, ban.unBanSince, true),
                new EmbedField(`Unbanned By`, ban.unbannedBy, true)
            ]);
    }
);