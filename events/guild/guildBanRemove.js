const { Client, Guild, User, MessageEmbed } = require("discord.js");
const { PinguLibrary, PinguUser, PinguGuild } = require("../../PinguPackage");

module.exports = {
    name: 'events: guildBanRemove',
    /**@param {{guild: Guild, user: User}}*/
    async setContent({ guild, user }) {
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

        return module.exports.content = new MessageEmbed()
            .setDescription(`**${user.tag}** was unbanned.`)
            .setColor(PinguGuild.GetPGuild(guild).embedColor)
            .addField(`Banned Since`, ban.banSince, true)
            .addField(`Banned By`, ban.by, true)
            .addField(`Ban Reason`, ban.reason, true)
            .addField(`Unbanned At`, ban.unBanSince, true)
            .addField(`Unbanned By`, ban.unbannedBy, true)

    },
    /**@param {Client} client
     @param {{guild: Guild, user: User}}*/
    execute(client, { guild, user }) {

    }
}