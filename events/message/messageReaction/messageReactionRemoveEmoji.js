const { PinguEvent, ReactionRole } = require("PinguPackage");

module.exports = new PinguEvent('messageReactionRemoveEmoji',
    async function setContent(client, embed, { emoji, message }) {
        return module.exports.content = embed.setDescription(`${emoji} was removed from ${message.id}`);
    },
    async function execute(client, reaction) {
        client.log('console', `${module.exports.name} called`);

        return ReactionRole.RemoveReaction(reaction);
    }
);

