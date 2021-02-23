const { MessageReaction, MessageEmbed } = require("discord.js");
const { PinguLibrary, PinguEvent, PinguGuild } = require("PinguPackage");

module.exports = new PinguEvent('messageReactionRemoveEmoji',
    async function setContent(reaction) {
        return module.exports.content = new MessageEmbed().setDescription(`${reaction.emoji} was removed from ${reaction.message.id}`);
    },
    async function execute(client, reaction) {
        PinguLibrary.consoleLog(client, `${module.exports.name} called`);
        TestForReactionRole(reaction);
    }
);

/**@param {MessageReaction} reaction*/
async function TestForReactionRole(reaction) {
    let guild = reaction.message.guild;
    if (!guild) return;

    let pGuild = await PinguGuild.GetPGuild(guild);
    let rr = pGuild.reactionRoles.find(rr => rr.messageID == reaction.message.id && reaction.emoji.name == rr.emoteName);
    if (!rr) return;

    let i = pGuild.reactionRoles.indexOf(rr);
    pGuild.reactionRoles[i] = null;

    PinguGuild.UpdatePGuild(reaction.client, {reactionRoles: pGuild.reactionRoles}, pGuild, `${module.exports.name}, TestForReactionRole()`,
        `Successfully removed **${reaction.message.guild.name}**'s Reaction Role for ${reaction.emoji.name}.`,
        `Failed removing **${reaction.message.guild.name}**'s Reaction Role for ${reaction.emoji.name}.`
    );
}