const { TextChannel, MessageEmbed, Guild } = require("discord.js");
const { PinguEvent, PChannel, PinguClient } = require("PinguPackage");

module.exports = new PinguEvent('guildMemberAdd',
    async function setContent(client, embed, member) {
        return module.exports.content = embed.setDescription(`${member} joined **${member.guild}**`)
    },
    async function execute(client, member) {
        const { guild, user, displayName } = member;
        const pingu = await client.users.fetch(client.clients.get('Live').id);

        if (!client.isLive && guild.members.cache.has(pingu.id) && pingu.presence.status == 'online') return;

        let pGuild = client.pGuilds.get(guild);
        let pGuildClient = client.toPClient(pGuild);

        let welcomeChannel = guild.welcomeChannel()
        if (welcomeChannel)
            welcomeChannel.sendEmbeds(new MessageEmbed({
                title: `Welcome ${user.username}!`,
                description: `${member} entered ${guild}.`,
                color: pGuildClient.embedColor || client.DefaultEmbedColor,
                footer: { text: `${user.tag} is member #${member.guild.members.cache.size}` },
                author: {
                    text: displayName,
                    iconURL: user.avatarURL()
                },
                thumbnail: { url: guild.iconURL() }
            }));

        if (member.guild.id == '848623399739195463') {
            member.roles.add('848625869853556806');
        }

    }
);