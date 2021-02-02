const { Client, MessageReaction, MessageEmbed } = require("discord.js");
const { PinguLibrary, PinguUser, PinguGuild } = require("../../../PinguPackage");

module.exports = {
    name: 'events: messageReactionRemoveEmoji',
    /**@param {{reaction: MessageReaction}}*/
    setContent({ reaction }) {
        return module.exports.content = new MessageEmbed().setDescription(`${reaction.emoji} was removed from ${reaction.message.id}`);
    },
    /**@param {Client} client
     @param {{reaction: MessageReaction}}*/
    execute(client, { reaction }) {
        PinguLibrary.consoleLog(client, `${this.name} called`);
        TestForReactionRole(reaction);
    }
}

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