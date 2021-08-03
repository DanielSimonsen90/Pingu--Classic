const { MessageEmbed } = require("discord.js");
const { PinguEvent, ReactionRole, EmbedField } = require("PinguPackage");

module.exports = new PinguEvent('messageReactionAdd', 
    async function setContent(client, reaction, user) {
        const { content, url, attachments } = reaction.message

        return module.exports.content = new MessageEmbed({
            description: content,
            url,
            image: { url: attachments.first()?.attachment },
            fields: [
                new EmbedField('User', user.tag, true),
                new EmbedField('Reaction', reaction.emoji, true),
                EmbedField.Blank(true),
                new EmbedField(`Message ID`, reaction.message.id, true),
                new EmbedField(`Channel`, reaction.message.channel, true),
                new EmbedField(`Channel ID`, reaction.message.channel.id, true)
            ]
        })
    },
    async function execute(client, reaction, user) {
        if (user == client.user) return;

        ReactionRole.OnReactionAdd(reaction, user);
    }
);