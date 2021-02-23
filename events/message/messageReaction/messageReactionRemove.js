const { Client, MessageReaction, User, MessageEmbed } = require("discord.js");
const { PinguLibrary, ReactionRole, PinguGuild, PinguEvent, EmbedField } = require("PinguPackage");

module.exports = new PinguEvent('messageReactionRemove', 
    async function setContent(reaction, user) {
        return module.exports.content = new MessageEmbed()
            .setDescription(reaction.message.content ? `"${reaction.message.content}"` : null)
            .setURL(reaction.message.url)
            .setImage(reaction.message.attachments.first())
            .addFields([
                new EmbedField(`User`, user.tag, true),
                new EmbedField(`Reaction`, reaction.emoji, true),
                PinguLibrary.BlankEmbedField(true),
                new EmbedField(`Message ID`, reaction.message.id, true),
                new EmbedField(`Channel`, reaction.message.channel, true),
                new EmbedField(`Channel ID`, reaction.message.channel.id, true)
            ]);
    },
    async function execute(client, reaction, user) {
        if (user == client.user) return ReactionRoleClient(client, reaction);
        ReactionRoleUser(client, reaction, user);
    }
);

/**@param {Client} client
 * @param {MessageReaction} reaction*/
async function ReactionRoleClient(client, reaction) {
    let guild = reaction.message.guild;
    if (!guild) return;

    let pGuild = await PinguGuild.GetPGuild(guild);
    if (!pGuild) return;

    let { reactionRoles } = pGuild;
    if (!reactionRoles) return;

    let rr = reactionRoles.find(rr => rr.emoteName == reaction.emoji.name && rr.messageID == reaction.message.id);
    if (!rr) return;

    let index = reactionRoles.indexOf(rr);
    reactionRoles[index] = null;

    PinguGuild.UpdatePGuild(client, { reactionRoles }, pGuild, module.exports.name,
        `Successfully removed ${rr.emoteName} from **${pGuild.name}**'s Pingu Guild.`,
        `Failed to remove ${rr.emoteName} from **${pGuild.name}**'s Pingu Guild.`
    )
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