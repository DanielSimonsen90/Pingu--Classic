const { Client, MessageReaction } = require("discord.js");
const { PinguLibrary, PinguUser, PinguGuild } = require("../../../PinguPackage");

module.exports = {
    name: 'events: messageReactionRemoveEmoji',
    /**@param {Client} client
     @param {{reaction: MessageReaction}}*/
    execute(client, { reaction }) {
        PinguLibrary.consoleLog(client, `${this.name} called`);
        TestForReactionRole(reaction);
    }
}

/**@param {MessageReaction} reaction*/
function TestForReactionRole(reaction) {
    let guild = reaction.message.guild;
    if (!guild) return;

    let pGuild = PinguGuild.GetPGuild(guild);
    let rr = pGuild.reactionRoles.find(rr => rr.messageID == reaction.message.id && reaction.emoji.name == rr.emoteName);
    if (!rr) return;

    let i = pGuild.reactionRoles.indexOf(rr);
    pGuild.reactionRoles[i] = null;

    PinguGuild.UpdatePGuildJSON(reaction.client, reaction.message.guild, `${this.name}, TestForReactionRole()`,
        `Successfully removed **${reaction.message.guild.name}**'s Reaction Role for ${reaction.emoji.name}.`,
        `Failed removing **${reaction.message.guild.name}**'s Reaction Role for ${reaction.emoji.name}.`
    );
}