const { ReactionRole, PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('messageDelete',
    async function setContent(client, embed, { content, author, channel }) {
        return module.exports.content = embed.setDescription(
            `${content ? 
                `> ${content}\n- ${author}` : 
                `Embed from ${author}`
            }\n\n...was deleted from ${channel}.` 
        )
    },
    async function execute(client, message) {
        ReactionRole.OnMessageDelete(message);
    },
);