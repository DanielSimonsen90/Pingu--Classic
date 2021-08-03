const { MessageEmbed } = require("discord.js");
const { ReactionRole, PinguEvent, EmbedField } = require("PinguPackage");

module.exports = new PinguEvent('messageReactionRemove',
    async function setContent(client, { message, emoji }, { tag }) {
        const { content, url, attachments, id, channel } = message;

        return module.exports.content = new MessageEmbed({
            description: content,
            url, 
            image: { url: attachments.first() },
            fields: [
                new EmbedField(`User`, tag, true),
                new EmbedField(`Reaction`, emoji, true),
                EmbedField.Blank(true),
                new EmbedField(`Message ID`, id, true),
                new EmbedField(`Channel`, channel, true),
                new EmbedField(`Channel ID`, channel.id, true)
            ]
        })
    },
    async function execute(client, reaction, user) {
        return user.id == client.id ? 
            ReactionRole.RemoveReaction(reaction, user) : 
            ReactionRole.OnReactionRemove(reaction, user)
    }
);


