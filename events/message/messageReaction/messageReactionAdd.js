const { MessageEmbed } = require("discord.js");
const { PinguEvent, PinguLibrary, ReactionRole, EmbedField } = require("PinguPackage");

module.exports = new PinguEvent('messageReactionAdd', 
    async function setContent(reaction, user) {
        return module.exports.content = new MessageEmbed()
            .setDescription(reaction.message.content ? `"${reaction.message.content}"` : null)
            .setURL(reaction.message.url)
            .setImage(reaction.message.attachments.first() && reaction.message.attachments.first().attachment)
            .addFields([
                new EmbedField('User', user.tag, true),
                new EmbedField('Reaction', reaction.emoji, true),
                EmbedField.Blank(true),
                new EmbedField(`Message ID`, reaction.message.id, true),
                new EmbedField(`Channel`, reaction.message.channel, true),
                new EmbedField(`Channel ID`, reaction.message.channel.id, true)
            ]);
    },
    async function execute(client, reaction, user) {
        if (user == client.user) return;
        ReactionRoleUser();

        async function ReactionRoleUser() {
            ReactionRole.OnReactionAdd(reaction, user);
        }
    }
);