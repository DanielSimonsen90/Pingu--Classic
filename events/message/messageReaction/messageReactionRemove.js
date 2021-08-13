const { ReactionRole, PinguEvent, EmbedField } = require("PinguPackage");

module.exports = new PinguEvent('messageReactionRemove',
    async function setContent(client, embed, { message, emoji }, { tag }) {
        const { content, url, attachments, id, channel } = message;

        return module.exports.content = embed
            .setDescription(content)
            .setURL(url)
            .setImage(attachments.first()?.attachment)
            .addFields([
                new EmbedField(`User`, tag, true),
                new EmbedField(`Reaction`, emoji, true),
                EmbedField.Blank(true),
                new EmbedField(`Message Id`, id, true),
                new EmbedField(`Channel`, channel, true),
                new EmbedField(`Channel Id`, channel.id, true)
            ]);
    },
    async function execute(client, reaction, user) {
        return user.id == client.id ? 
            ReactionRole.RemoveReaction(reaction, user) : 
            ReactionRole.OnReactionRemove(reaction, user)
    }
);


