const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require('PinguPackage');

module.exports = new PinguEvent('typingStart',
    async function setContent(channel, user) {
        return module.exports.content = new MessageEmbed().setDescription(`**${user.tag}** started typing in ${channel}${(channel.guild ? `, in ${channel.guild.name}` : "")}`);
    }
);