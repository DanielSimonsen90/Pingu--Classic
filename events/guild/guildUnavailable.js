const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('guildUnavailable',
    async function setContent(guild) {
        return module.exports.content = new MessageEmbed().setDescription(`**${guild.name}** is now unavailable.`);
    }
)
