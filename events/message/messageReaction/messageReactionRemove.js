const { MessageEmbed } = require("discord.js");
const { PinguLibrary, ReactionRole, PinguEvent, EmbedField } = require("PinguPackage");

module.exports = new PinguEvent('messageReactionRemove',
    async function setContent(reaction, user) {
        return module.exports.content = new MessageEmbed()
            .setDescription(reaction.message.content)
            .setURL(reaction.message.url)
            .setImage(reaction.message.attachments.first())
            .addFields([
                new EmbedField(`User`, user.tag, true),
                new EmbedField(`Reaction`, reaction.emoji, true),
                EmbedField.Blank(true),
                new EmbedField(`Message ID`, reaction.message.id, true),
                new EmbedField(`Channel`, reaction.message.channel, true),
                new EmbedField(`Channel ID`, reaction.message.channel.id, true)
            ]);
    },
    async function execute(client, reaction, user) {
        if (user.id == client.id) return ReactionRoleClient();
        ReactionRoleUser();

        async function ReactionRoleClient() {
            return ReactionRole.RemoveReaction(reaction, user);
        }
        async function ReactionRoleUser() {
            return ReactionRole.OnReactionRemove(reaction, user);
        }
    }
);


