const { DMChannel, GuildChannel } = require("discord.js");
const { PinguEvent } = require('PinguPackage');

module.exports = new PinguEvent('channelCreate',
    async function setContent(client, embed, channel) {
        return module.exports.content = channel.guild ? AsGuildChannel(channel) : AsDMChannel(channel);

        /**@param {GuildChannel} channel*/
        function AsGuildChannel(channel) {
            return embed.setDescription(`Created ${channel.type}-channel **#${channel}** (${channel.id})`)
        }
        /**@param {DMChannel} channel*/
        function AsDMChannel(channel) {
            return embed.setDescription(`DM Between **${channel.client.user.tag}** & **${channel.recipient}** was created.`);
        }
    }
);