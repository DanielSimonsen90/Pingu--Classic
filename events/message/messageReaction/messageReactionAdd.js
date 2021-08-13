const { PinguEvent, ReactionRole, EmbedField } = require("PinguPackage");

module.exports = new PinguEvent('messageReactionAdd', 
    async function setContent(client, embed, reaction, user) {
        const { content, url, attachments } = reaction.message

        return module.exports.content = embed
            .setDescription(content)
            .setURL(url)
            .setImage(attachments.first()?.attachment)
            .addFields([
                new EmbedField('User', user.tag, true),
                new EmbedField('Reaction', reaction.emoji, true),
                EmbedField.Blank(true),
                new EmbedField(`Message Id`, reaction.message.id, true),
                new EmbedField(`Channel`, reaction.message.channel, true),
                new EmbedField(`Channel Id`, reaction.message.channel.id, true)
            ])
    },
    async function execute(client, reaction, user) {
        if (user == client.user) return;

        ReactionRole.OnReactionAdd(reaction, user);
    }
);