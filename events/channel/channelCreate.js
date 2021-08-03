const { DMChannel, GuildChannel, MessageEmbed } = require("discord.js");
const { PinguEvent } = require('PinguPackage');

module.exports = new PinguEvent('channelCreate',
    async function setContent(client, channel) {
        return module.exports.content = channel.guild ? AsGuildChannel(channel) : AsDMChannel(channel);

        /**@param {GuildChannel} channel*/
        function AsGuildChannel(channel) {
            return new MessageEmbed({ description: `Created ${channel.type}-channel **#${channel}** (${channel.id})` })
        }
        /**@param {DMChannel} channel*/
        function AsDMChannel(channel) {
            return new MessageEmbed({ description: `DM Between **${channel.client.user.tag}** & **${channel.recipient}** was created.` });
        }
    }
);