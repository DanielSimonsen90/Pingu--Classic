const { MessageEmbed } = require("discord.js");
const { ReactionRole, PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('messageDelete',
    async function setContent(client, message) {
        return module.exports.content = new MessageEmbed({ 
            description: `${message.content ? 
                `> ${message.content}\n- ${message.author}` : 
                `Embed from ${message.author}`
            }\n\n...was deleted from ${message.channel}.` 
        })
    },
    async function execute(client, message) {
        ReactionRole.OnMessageDelete(message);
    },
);