const { Client, MessageReaction, User, MessageEmbed } = require("discord.js");
const { PinguLibrary, ReactionRole, Queue } = require("PinguPackage");

module.exports = {
    name: 'events: messageReactionAdd',
    /**@param {{reaction: MessageReaction, user: User}}*/
    setContent({ reaction, user }) {
        return module.exports.content = new MessageEmbed()
            .setDescription(reaction.message.content ? `"${reaction.message.content}"` : null)
            .setURL(reaction.message.url)
            .setImage(reaction.message.attachments.first())
            .addField(`User`, user.tag, true)
            .addField(`Reaction`, reaction.emoji, true)
            .addField("\u200B", "\u200B", true)
            .addField(`Message ID`, reaction.message.id, true)
            .addField(`Channel`, reaction.message.channel, true)
            .addField(`Channel ID`, reaction.message.channel.id, true);
    },
    /**@param {Client} client
     @param {{reaction: MessageReaction, user: User}}*/
    execute(client, { reaction, user }) {
        if (user == client.user) return;
        ReactionRoleUser(client, reaction, user);
    }
}

/**@param {Client} client
 * @param {MessageReaction} reaction
 * @param {User} user*/
async function ReactionRoleUser(client, reaction, user) {
    try {
        let role = await ReactionRole.GetReactionRole(client, reaction, user);
        if (!role) return;

        let member = reaction.message.guild.member(user);

        try {
            member.roles.add(role, `ReactionRole in ${reaction.message.channel.name}.`);
            PinguLibrary.consoleLog(client, `Gave ${user.username} ${role.name} for ReactionRole`);
        } catch (err) {
            PinguLibrary.errorLog(message.client, `Unable to give ${user.username} the ${role.name} role for reacting!`, null, err);
        }

    } catch (err) { PinguLibrary.errorLog(client, `${module.exports.name} error`, null, err); }
}
