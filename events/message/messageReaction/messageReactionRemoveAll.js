const { Client, Message } = require("discord.js");
const { PinguLibrary, PinguGuild } = require("../../../PinguPackage");

module.exports = {
    name: 'events: messageReactionRemoveAll',
    /**@param {Client} client
     @param {{message: Message}}*/
    execute(client, { message }) {
        RemoveReactionRoles(message)

        PinguLibrary.ConsoleLog(`${this.name} called`)
    }
}

/**@param {Message} message*/
function RemoveReactionRoles(message) {
    let pGuild = PinguGuild.GetPGuild(message.guild);
    if (!pGuild.reactionRoles[0]) return;

    for (var rr of pGuild.reactionRoles) {
        if (rr.messageID != message.id) continue;

        let i = pGuild.reactionRoles.indexOf(rr)
        pGuild.reactionRoles[i] = null;

        PinguLibrary.ConsoleLog(`Removed ${rr.emoteName} => ${rr.pRole.name}`);
    }

    PinguGuild.UpdatePGuildJSON(message.client, message.guild, `${this.name}, RemoveReactionRoles()`,
        `Successfully removed **${message.guild.name}**'s reactionroles for ${message.id}`,
        `Failed to remove **${message.guild.name}**'s reactionroles for ${message.id}`
    );
}