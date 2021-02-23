const { MessageEmbed } = require("discord.js");
const { PinguEvent, PinguLibrary, PinguGuild, EmbedField } = require("PinguPackage");

module.exports = new PinguEvent('guildBanAdd',
    async function setContent(guild, user) {
        let banAudits = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' });
        let banAudit = banAudits.entries.find(e => e.target.id == user.id);

        let ban = {
            by: banAudit.executor,
            reason: banAudit.reason,
            banSince: banAudit.createdAt,
        }

        let pGuild = await PinguGuild.GetPGuild(guild);
        let pGuildClient = PinguGuild.GetPClient(guild.client, pGuild);

        return module.exports.content = new MessageEmbed()
            .setDescription(`**${user.tag}** was unbanned.`)
            .setColor(pGuildClient.embedColor || PinguLibrary.DefaultEmbedColor)
            .addFields([
                new EmbedField(`Banned Since`, ban.banSince, true),
                new EmbedField(`Banned By`, ban.by, true),
                new EmbedField(`Ban Reason`, ban.reason, true)
            ]);
    }
);