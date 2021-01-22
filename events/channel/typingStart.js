const { Client, User, Channel, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'events: typingStart',
    /**@param {{channel: Channel | import("discord.js").PartialDMChannel, user: User}}*/
    setContent({ channel, user }) {
        return module.exports.content = new MessageEmbed().setDescription(`**${user.tag}** started typing in ${channel}${(channel.guild ? `, in ${channel.guild.name}` : "")}`);
    },
    /**@param {Client} client
     @param {{channel: Channel | import("discord.js").PartialDMChannel, user: User}}*/
    execute(client, { channel, user }) {

    }
}