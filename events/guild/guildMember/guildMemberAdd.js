const { TextChannel, MessageEmbed, Client, Guild } = require("discord.js");
const { PinguEvent, PinguGuild, PChannel, PinguUser, PinguClient } = require("PinguPackage");

module.exports = {
    ...new PinguEvent('guildMemberAdd',
        async function setContent(member) {
            return module.exports.content = new MessageEmbed().setDescription(`${member.displayName} joined **${member.guild.name}**`);
        },
        async function execute(client, member) {
            if (!client.isLive && member.guild.members.cache.has(PinguClient.Clients.PinguID)) return;

            let pGuild = await PinguGuild.GetPGuild(member.guild);
            let pGuildClient = client.toPClient(pGuild);

            let welcomeChannel = module.exports.getWelcomeChannel(client, member.guild);
            if (welcomeChannel)
                welcomeChannel.send(new MessageEmbed()
                    .setTitle(`Welcome ${member.user.username}!`)
                    .setDescription(`${member} entered ${member.guild.name}.`)
                    .setColor(pGuildClient.embedColor || client.DefaultEmbedColor)
                    .setFooter(`${member.user.tag} is member #${member.guild.members.cache.size}`)
                    .setAuthor(member.displayName, member.user.avatarURL())
                    .setThumbnail(member.guild.iconURL())
                );

            (async function AddToPinguUsers() {
                if (!member.user.bot && !await PinguUser.GetPUser(member.user))
                    PinguUser.WritePUser(client, member.user, module.exports.name,
                        `Added **${member.user.tag}** to PinguUsers`,
                        `Failed to add **${member.user.tag}** to PinguUsers!`
                    );
            })();
        }
    ), ...{
        /**@param {Client} client
         * @param {Guild} guild
         * @returns {Promise<TextChannel>} */
        async getWelcomeChannel(client, guild) {
            let pGuild = await PinguGuild.GetPGuild(guild);
            let welcomePChannel = pGuild.settings.welcomeChannel;
            let welcomeChannel = guild.channels.cache.find(c => c.id == (welcomePChannel && welcomePChannel._id));

            if (!welcomeChannel) {
                //Find a channel which is "welcome", until there are no more channels to look through, then find one named "general" (prioritize welcome channels higher than general, and ensure you don't find #general before #welcome)
                welcomeChannel = guild.channels.cache.find(c => c.isText() && ['welcome', 'door', '🚪'].includes(c.name)) ||
                    guild.systemChannel ||
                    guild.channels.cache.find(c => c.isText() && c.name == 'general');

                pGuild.settings.welcomeChannel = new PChannel(welcomeChannel);

                if (welcomeChannel) {
                    PinguGuild.UpdatePGuild(client, { settings: pGuild.settings }, pGuild, module.exports.name,
                        `Successfully added welcome channel to **${guild.name}**'s pGuild.`,
                        `Error adding welcome channel to **${guild.name}**'s pGuild`
                    );
                }
            }
            return welcomeChannel;
        }
    }
};