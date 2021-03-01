const { MessageEmbed } = require("discord.js");
const { PinguEvent, PinguLibrary, PinguGuild, ReactionRole } = require("PinguPackage");

module.exports = new PinguEvent('messageReactionRemoveAll',
    async function setContent(message) {
        return module.exports.content = new MessageEmbed().setDescription(`Removed all reactions from message, ${message.id}`);
    },
    async function execute(client, message) {
        ReactionRole.OnReactionRemoveAll(message, client);
    }
);