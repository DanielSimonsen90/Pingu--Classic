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
                PinguLibrary.BlankEmbedField(true),
                new EmbedField(`Message ID`, reaction.message.id, true),
                new EmbedField(`Channel`, reaction.message.channel, true),
                new EmbedField(`Channel ID`, reaction.message.channel.id, true)
            ]);
    },
    async function execute(client, reaction, user) {
        if (user == client.user) return;
        ReactionRoleUser();

        async function ReactionRoleUser() {
            try {
                let role = await ReactionRole.GetReactionRole(client, reaction, user);
                if (!role) return;

                let member = reaction.message.guild.member(user);

                try {
                    member.roles.add(role, `ReactionRole in ${reaction.message.channel.name}.`);
                    PinguLibrary.consoleLog(client, `Gave ${user.username} ${role.name} for ReactionRole`);
                } catch (err) {
                    PinguLibrary.errorLog(client, `Unable to give ${user.username} the ${role.name} role for reacting!`, null, err, {
                        params: { client, reaction, user },
                        trycatch: { role, member }
                    });
                }

            } catch (err) {
                PinguLibrary.errorLog(client, `${module.exports.name} error`, null, err, {
                    params: { client, reaction, user },
                    trycatch: { role, member }
                });
            }
        }

    }
);