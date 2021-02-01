const { GuildMember, TextChannel, MessageEmbed, Client, Guild } = require("discord.js");
const { PinguGuild, PChannel, PinguLibrary, PinguUser, PClient } = require("../../../PinguPackage");

module.exports = {
    name: 'events: guildMemberAdd',
    /**@param {{member: GuildMember}}*/
    setContent({ member }) {
        return module.exports.content = new MessageEmbed().setDescription(`${member.displayName} joined **${member.guild.name}**`);
    },
    /**@param {Client} client
     @param {{member: GuildMember, pGuildClient: PClient}}*/
    execute(client, { member, pGuildClient }) {
        let welcomeChannel = this.getWelcomeChannel(client, member.guild);
        if (welcomeChannel)
            welcomeChannel.send(new MessageEmbed()
                .setTitle(`Welcome ${member.user.username}!`)
                .setDescription(`${member} entered ${member.guild.name}.`)
                .setColor(pGuildClient.embedColor || PinguLibrary.DefaultEmbedColor)
                .setFooter(`${member.user.tag} is member #${member.guild.members.cache.size}`)
                .setAuthor(member.displayName, member.user.avatarURL())
                .setThumbnail(member.guild.iconURL())
            );

        AddToPinguUsers();

        function AddToPinguUsers() {
            if (!member.user.bot && !PinguUser.GetPUser(member.user, true))
                PinguUser.WritePUser(member.user, async pUser =>
                    await PinguLibrary.pUserLog(client, module.exports.name, `Created **${pUser.tag}**.json`)
                );
        }
    },
    /**@param {Client} client
     * @param {Guild} guild
     * @returns {TextChannel} */
    getWelcomeChannel(client, guild) {
            let welcomePChannel = PinguGuild.GetPGuild(guild).welcomeChannel;
            let welcomeChannel = guild.channels.cache.find(c => c.id == (welcomePChannel && welcomePChannel.id));
            if (!welcomeChannel) {
                welcomeChannel = guild.channels.cache.find(c => c.isText() && c.name.includes('welcome')) ||
                    guild.channels.cache.find(c => c.isText() && c.name == 'general');
                if (welcomeChannel) {
                    PinguGuild.GetPGuild(guild).welcomeChannel = new PChannel(welcomeChannel);
                    PinguGuild.UpdatePGuildJSONAsync(client, guild, module.exports.name,
                        `Successfully added welcome channel to **${guild.name}**'s pGuild.`,
                        `Error adding welcome channel to **${guild.name}**'s pGuild`
                    );
                }
            }
            return welcomeChannel;
        }
}