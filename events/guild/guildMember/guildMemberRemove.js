const { MessageEmbed } = require("discord.js");
const { PinguUser, PinguEvent, PinguClient } = require("PinguPackage");

module.exports = new PinguEvent('guildMemberRemove',
    async function setContent(member) {
        if (!member.guild.me.hasPermission('VIEW_AUDIT_LOG'))
            return module.exports.content = new MessageEmbed()
                .setDescription(`${member.displayName} (${member.user.tag}, ${member.id}) is no longer a part of ${member.guild.name}`)

        let kicked = await PinguEvent.GetAuditLogs(member.guild, 'MEMBER_KICK');
        let banned = await PinguEvent.GetAuditLogs(member.guild, 'MEMBER_BAN_ADD');

        return module.exports.content = new MessageEmbed()
            .setDescription((kicked != PinguEvent.noAuditLog && banned != PinguEvent.noAuditLog ?
                `${member.user.tag} left ${member.guild.name}` :
                `${member.user.tag} was ${(kicked != PinguEvent.noAuditLog ? `kicked by ${kicked}` : `banned by ${banned}`)}`)
            );
    },
    async function execute(client, member) {
        if (!client.isLive && member.guild.members.cache.has(PinguClient.Clients.PinguID)) return;

        let welcomeChannel = await require('./guildMemberAdd').getWelcomeChannel(client, member.guild);
        if (welcomeChannel) welcomeChannel.send(`**${member.displayName}** ${(member.displayName != member.user.username ? `(${member.user.username})` : ``)}has left ${member.guild.name}...`);

        (async function UpdateSharedServers() {
            if (member.user.bot) return;
            let pUser = await PinguUser.GetPUser(member.user);
            pUser.sharedServers = pUser.sharedServers.filter(guild => guild._id != member.guild.id);

            await PinguUser.UpdatePUser(client, { sharedServers: pUser.sharedServers }, pUser, module.exports.name,
                `Successfully removed **${member.guild.name}** from **${pUser.tag}**'s SharedServers.`,
                `Failed to remove **${member.guild.name}** from **${pUser.tag}**'s SharedServers.`,
            );
        })();
    }
);