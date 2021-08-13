const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('guildMemberRemove',
    async function setContent(client, embed, { guild, displayName, user, id }) {
        if (guild.me && !guild.me.permissions.has('VIEW_AUDIT_LOG'))
            return module.exports.content = embed.setDescription(`${displayName} (${user.tag}, ${id}) is no longer a part of ${guild}`);

        let kicked = await PinguEvent.GetAuditLogs(guild, 'MEMBER_KICK');
        let banned = await PinguEvent.GetAuditLogs(guild, 'MEMBER_BAN_ADD');

        return module.exports.content = embed.setDescription(
            kicked != PinguEvent.noAuditLog && banned != PinguEvent.noAuditLog ?
                `${user} left ${guild}` :
                `${user} was ${(kicked != PinguEvent.noAuditLog ? `kicked by ${kicked}` : `banned by ${banned}`)}`
        )
    },
    async function execute(client, { guild, displayName, user }) {
        const pingu = client.clients.get('Live');

        if (!client.isLive && member.guild.members.cache.has(pingu.id) && pingu.presence.status == 'online') return;

        let welcomeChannel = await require('./guildMemberAdd').getWelcomeChannel(client, guild);
        if (welcomeChannel) welcomeChannel.send(`**${displayName}** (${user}) has left ${guild}...`);

        (async function UpdateSharedServers() {
            if (user.bot) return;
            let pUser = client.pUsers.get(user);
            if (!pUser) return;
            pUser.sharedServers = pUser.sharedServers.filter(guild => guild._id != member.guild.id);

            await client.pUsers.update(pUser, module.exports.name, `Removed **${guild}** from **${pUser.tag}**'s SharedServers, after leaving the guild.`)
        })();
    }
);