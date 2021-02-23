const { MessageEmbed } = require("discord.js");
const { PinguUser, PinguLibrary, PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('guildMemberRemove',
    async function setContent(member) {
        let kicked = await PinguEvent.GetAuditLogs(member.guild, 'MEMBER_KICK');
        let banned = await PinguEvent.GetAuditLogs(member.guild, 'MEMBER_BAN_ADD');

        return module.exports.content = new MessageEmbed()
            .setDescription((kicked != PinguEvent.noAuditLog && banned != PinguEvent.noAuditLog ?
                `${member.user.tag} left ${member.guild.name}` :
                `${member.user.tag} was ${(kicked != PinguEvent.noAuditLog ? `kicked by ${kicked}` : `banned by ${banned}`)}`)
            );
    },
    async function execute(client, member) {
        if (client.user.id == PinguLibrary.Clients.BetaID && member.guild.members.cache.has(PinguLibrary.Clients.PinguID)) return;

        let welcomeChannel = await require('./guildMemberAdd').getWelcomeChannel(client, member.guild);
        if (welcomeChannel)
            welcomeChannel.send(`**${member.displayName}** ${(member.displayName != member.user.username ? `(${member.user.username})` : ``)}has left ${member.guild.name}...`);

        UpdateSharedServers();

        async function UpdateSharedServers() {
            if (member.user.bot) return;
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
);