const { Client, MessageReaction, User, MessageEmbed } = require("discord.js");
const { PinguLibrary, ReactionRole, PinguGuild } = require("../../../PinguPackage");

module.exports = {
    name: 'events: messageReactionRemove',
    /**@param {{reaction: MessageReaction, user: User}}*/
    setContent({ reaction, user }) {
        return module.exports.content = new MessageEmbed()
            .setDescription(`"${reaction.message.content}"`)
            .setURL(reaction.message.url)
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
        if (user == client.user) return ReactionRoleClient(client, reaction);
        ReactionRoleUser(client, reaction, user);
    }
}

/**@param {Client} client
 * @param {MessageReaction} reaction*/
function ReactionRoleClient(client, reaction) {
    let guild = reaction.message.guild;
    if (!guild) return;

    let pGuild = PinguGuild.GetPGuild(guild);
    if (!pGuild) return;

    let reactionRoles = pGuild.reactionRoles;
    if (!reactionRoles) return;

    let rr = reactionRoles.find(rr => rr.emoteName == reaction.emoji.name && rr.messageID == reaction.message.id);
    if (!rr) return;

    let index = reactionRoles.indexOf(rr);
    reactionRoles[index] = null;

    PinguGuild.UpdatePGuildJSONAsync(client, guild, `${this.name}, ReactionRoleClient()`,
        `Successfully removed ${rr.emoteName} from **${pGuild.name}**'s Pingu Guild.`,
        `Failed to remove ${rr.emoteName} from **${pGuild.name}**'s Pingu Guild.`
    );
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
            member.roles.remove(role, `ReactionRole in ${reaction.message.channel.name}.`);
            PinguLibrary.consoleLog(client, `Removed ${user.username}'s ${role.name} role for ReactionRole`);
        } catch (err) {
            PinguLibrary.errorLog(message.client, `Unable to remove ${user.username}'s ${role.name} role for unreacting!`, null, err);
        }

    } catch (err) { PinguLibrary.errorLog(client, `${this.name} error`, null, err); }
}