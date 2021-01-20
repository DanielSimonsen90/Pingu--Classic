const { Client, DMChannel, GuildChannel, MessageEmbed } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: channelCreate',
    /**@param {Client} client
     * @param {{channel: DMChannel | GuildChannel}}*/
    execute(client, { channel }) {
        SetContent(client, channel);


    }
}

/**@param {Client} client
 * @param {DMChannel | GuildChannel} channel*/
function SetContent(client, channel) {
    module.exports.content = channel.guild ? AsGuildChannel(channel) : AsDMChannel(channel);

    /**@param {GuildChannel} channel*/
    function AsGuildChannel(channel) {
        return new MessageEmbed().setDescription(`Created ${channel} (${channel.id}) in **${channel.guild.name}**`);
    }
    /**@param {DMChannel} channel*/
    function AsDMChannel(channel) {
        return new MessageEmbed().setDescription(`DM Between **${client.user.tag}** & **${channel.recipient}** was created.`);
    }
}