const { MessageEmbed } = require("discord.js");
const { PinguEvent, ReactionRole } = require("PinguPackage");

module.exports = new PinguEvent('messageReactionRemoveAll',
    async function setContent(client, { id, url }) {
        return module.exports.content = new MessageEmbed({ description: `Removed all reactions from [message](${url}), ${id}` })
    },
    async function execute(client, message) {
        ReactionRole.OnReactionRemoveAll(message, client);
    }
);