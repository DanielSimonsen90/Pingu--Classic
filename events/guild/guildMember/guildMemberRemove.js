const { GuildMember, Client, MessageEmbed } = require("discord.js");
const { PinguUser, PinguLibrary, PinguEvents } = require("../../../PinguPackage");

module.exports = {
    name: 'events: guildMemberRemove',
    /**@param {{member: GuildMember}}*/
    async setContent({ member }) {
        let kicked = await PinguEvents.GetAuditLogs(member.guild, 'MEMBER_KICK');
        let banned = await PinguEvents.GetAuditLogs(member.guild, 'MEMBER_BAN_ADD');

        return module.exports.content = new MessageEmbed()
            .setDescription((kicked != PinguEvents.noAuditLog && banned != PinguEvents.noAuditLog ?
                `${member.user.tag} left ${member.guild.name}` :
                `${member.user.tag} was ${(kicked != PinguEvents.noAuditLog ? `kicked by ${kicked}` : `banned by ${banned}`)}`)
            );
    },
    /**@param {Client} client
     @param {{member: GuildMember}}*/
    execute(client, { member }) {
        if (member.user.bot) return;
        let welcomeChannel = require('./guildMemberAdd').getWelcomeChannel(client, member.guild);
        if (welcomeChannel)
            welcomeChannel.send(`**${member.displayName}** ${(member.displayName != member.user.username ? `(${member.user.username})` : ``)}has left ${member.guild.name}...`);

        UpdateSharedServers();

        function UpdateSharedServers() {
            let pUser = PinguUser.GetPUser(member.user);
            pUser.sharedServers = pUser.sharedServers.filter(guild => guild.id != member.guild.id);

            if (pUser.sharedServers.length == 0)
                PinguUser.DeletePUser(member.user, async () =>
                    PinguLibrary.pUserLog(client, module.exports.name, `Successfully deleted **${pUser.tag}** from Pingu Users.`)
                );
            else PinguUser.UpdatePUsersJSON(client, member.user, module.exports.name, `Successfully removed **${member.guild.name}** from **${pUser.tag}**'s SharedServers.`)
        }
    }
}