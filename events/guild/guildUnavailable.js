const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('guildUnavailable',
    async function setContent(client, guild) {
        return module.exports.content = new MessageEmbed({ description: `**${guild}** is now unavailable.` })
    }
)
