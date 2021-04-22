const { DMChannel, GuildChannel, MessageEmbed } = require("discord.js");
const { PinguEvent } = require('PinguPackage');

module.exports = new PinguEvent('channelCreate',
    async function setContent(channel) {
        return module.exports.content = channel.guild ? AsGuildChannel(channel) : AsDMChannel(channel);

        /**@param {GuildChannel} channel*/
        function AsGuildChannel(channel) {
            return new MessageEmbed().setDescription(`Created ${channel.type}-channel **#${channel}** (${channel.id})`);
        }
        /**@param {DMChannel} channel*/
        function AsDMChannel(channel) {
            return new MessageEmbed().setDescription(`DM Between **${channel.client.user.tag}** & **${channel.recipient}** was created.`);
        }
    }
);