const { MessageEmbed } = require("discord.js");
const { PinguEvent, ReactionRole } = require("PinguPackage");

module.exports = new PinguEvent('messageReactionRemoveEmoji',
    async function setContent(client, { emoji, message }) {
        return module.exports.content = new MessageEmbed({ description: `${emoji} was removed from ${message.id}` })
    },
    async function execute(client, reaction) {
        client.log('console', `${module.exports.name} called`);

        return ReactionRole.RemoveReaction(reaction);
    }
);

