const { MessageEmbed } = require("discord.js");
const { ReactionRole, PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('messageDelete',
    async function setContent(message) {
        return module.exports.content = new MessageEmbed().setDescription(`> ${message.content}\n- ${message.author}\n\n...was deleted from ${message.channel}.`);
    },
    async function execute(client, message) {
        ReactionRole.OnMessageDelete(message);
    },
);