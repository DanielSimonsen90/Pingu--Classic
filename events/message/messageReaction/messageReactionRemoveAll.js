const { PinguEvent, ReactionRole } = require("PinguPackage");

module.exports = new PinguEvent('messageReactionRemoveAll',
    async function setContent(client, embed, { id, url }) {
        return module.exports.content = embed.setDescription(`Removed all reactions from [message](${url}), ${id}`);
    },
    async function execute(client, message) {
        ReactionRole.OnReactionRemoveAll(message, client);
    }
);