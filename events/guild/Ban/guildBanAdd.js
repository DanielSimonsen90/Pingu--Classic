const { MessageEmbed } = require("discord.js");
const { PinguEvent, EmbedField } = require("PinguPackage");

module.exports = new PinguEvent('guildBanAdd',
    async function setContent(client, guild, user) {
        if (!guild.me.hasPermission('VIEW_AUDIT_LOG')) {
            return module.exports.content = new MessageEmbed({ description: `${user} was unbanned` })
        }

        let banAudits = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' });
        let { executor, reason, createdAt } = banAudits.entries.find(e => e.target.id == user.id);

        let pGuild = client.pGuilds.get(guild);
        let pGuildClient = client.toPClient(pGuild);

        return module.exports.content = new MessageEmbed({
            description: `**${user}** was unbanned.`,
            color: pGuildClient.embedColor || client.DefaultEmbedColor,
            fields: [
                new EmbedField(`Banned Since`, createdAt, true),
                new EmbedField(`Banned By`, executor, true),
                new EmbedField(`Ban Reason`, reason, true)
            ]
        })
    }
);