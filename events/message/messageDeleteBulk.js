const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require('PinguPackage');

module.exports = new PinguEvent('messageDeleteBulk',
    async function setContent(messages) {
        return module.exports.content = new MessageEmbed().setDescription(`Deleted ${messages.size} messages from ${messages.first().channel}`);
    },
);