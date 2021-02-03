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
    async execute(client, { member }) {
        if (member.user.bot) return;
        let welcomeChannel = await require('./guildMemberAdd').getWelcomeChannel(client, member.guild);
        if (welcomeChannel)
            welcomeChannel.send(`**${member.displayName}** ${(member.displayName != member.user.username ? `(${member.user.username})` : ``)}has left ${member.guild.name}...`);

        UpdateSharedServers();

        async function UpdateSharedServers() {
            let pUser = await PinguUser.GetPUser(member.user);
            pUser.sharedServers = pUser.sharedServers.filter(guild => guild._id != member.guild.id);

            return !pUser.sharedServers.length ?
                await PinguUser.DeletePUser(client, member.user, module.exports.name,
                    `Successfully removed **${pUser.tag}** from MongolDB.`,
                    `Failed to remove **${pUser.tag}** from MongolDB`
                ) :
                await PinguUser.UpdatePUser(client, { sharedServers: pUser.sharedServers }, pUser, module.exports.name,
                    `Successfully removed **${member.guild.name}** from **${pUser.tag}**'s SharedServers.`,
                    `Failed to remove **${member.guild.name}** from **${pUser.tag}**'s SharedServers.`,
                );
        }
    }
}