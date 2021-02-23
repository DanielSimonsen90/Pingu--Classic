const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('guildIntegrationsUpdate',
    async function setContent(guild) {
        return module.exports.content = new MessageEmbed().setDescription(`Integration Updated`);
    }
);