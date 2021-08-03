const { TextChannel, MessageEmbed, Guild } = require("discord.js");
const { PinguEvent, PChannel, PinguClient } = require("PinguPackage");

module.exports = {
    ...new PinguEvent('guildMemberAdd',
        async function setContent(client, member) {
            return module.exports.content = new MessageEmbed({ description: `${member} joined **${member.guild}**` })
        },
        async function execute(client, member) {
            const { guild, user, displayName } = member;
            const pingu = await client.users.fetch(client.clients.get('Live').id);

            if (!client.isLive && guild.members.cache.has(pingu.id) && pingu.presence.status == 'online') return;

            let pGuild = client.pGuilds.get(guild);
            let pGuildClient = client.toPClient(pGuild);

            let welcomeChannel = await module.exports.getWelcomeChannel(client, member.guild);
            if (welcomeChannel)
                welcomeChannel.send(new MessageEmbed({
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
    ), ...{
        /**@param {PinguClient} client
         * @param {Guild} guild
         * @returns {Promise<TextChannel>} */
        async getWelcomeChannel(client, guild) {
            let pGuild = client.pGuilds.get(guild);
            let welcomePChannel = pGuild.settings.welcomeChannel;
            let welcomeChannel = guild.channels.cache.get(welcomePChannel._id);

            if (!welcomeChannel) {
                //Find a channel which is "welcome", until there are no more channels to look through, then find one named "general" (prioritize welcome channels higher than general, and ensure you don't find #general before #welcome)
                welcomeChannel = guild.channels.cache.find(c => c.isText() && ['welcome', 'door', '🚪'].includes(c.name)) ||
                    guild.systemChannel ||
                    guild.channels.cache.find(c => c.isText() && c.name == 'general');

                pGuild.settings.welcomeChannel = new PChannel(welcomeChannel);

                if (welcomeChannel) client.pGuilds.update(pGuild, module.exports.name, `Added welcome channel to **${guild}**'s Pingu Guild.`)
            }
            return welcomeChannel;
        }
    }
};