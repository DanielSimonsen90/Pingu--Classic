const { Client, Guild, User } = require("discord.js");
const { PinguLibrary, PinguUser } = require("PinguPackage");

module.exports = {
    name: 'events: guildBanAdd',
    /**@param {{guild: Guild, user: User}}*/
    async setContent({ guild, user }) {
        let banAudits = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' });
        let banAudit = banAudits.entries.find(e => e.target.id == user.id);

        let ban = {
            by: banAudit.executor,
            reason: banAudit.reason,
            banSince: banAudit.createdAt,
        }

        return module.exports.content = new MessageEmbed()
            .setDescription(`**${user.tag}** was unbanned.`)
            .setColor(PinguGuild.GetPGuild(guild).embedColor)
            .addField(`Banned Since`, ban.banSince, true)
            .addField(`Banned By`, ban.by, true)
            .addField(`Ban Reason`, ban.reason, true)
    },
    /**@param {Client} client
     @param {{guild: Guild, user: User}}*/
    execute(client, { guild, user }) {

    }
}