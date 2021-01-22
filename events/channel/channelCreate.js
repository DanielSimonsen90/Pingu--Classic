const { Client, DMChannel, GuildChannel, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'events: channelCreate',
    /**@param {{channel: DMChannel | GuildChannel}}*/
    setContent({ channel }) {
        return module.exports.content = channel.guild ? AsGuildChannel(channel) : AsDMChannel(channel);

        /**@param {GuildChannel} channel*/
        function AsGuildChannel(channel) {
            return new MessageEmbed().setDescription(`Created ${channel.type}-channel **${channel}** (${channel.id})`);
        }
        /**@param {DMChannel} channel*/
        function AsDMChannel(channel) {
            return new MessageEmbed().setDescription(`DM Between **${channel.client.user.tag}** & **${channel.recipient}** was created.`);
        }
    },
    /**@param {Client} client
     * @param {{channel: DMChannel | GuildChannel}}*/
    execute(client, { channel }) {

    }
}
