const { Client, Message, MessageEmbed } = require("discord.js");
const { PinguLibrary, PinguGuild } = require("../../../PinguPackage");

module.exports = {
    name: 'events: messageReactionRemoveAll',
    /**@param {{message: Message}}*/
    setContent({ message }) {
        return module.exports.content = new MessageEmbed().setDescription(`Removed all reactions from message, ${message.id}`);
    },
    /**@param {Client} client
     @param {{message: Message}}*/
    execute(client, { message }) {
        RemoveReactionRoles(message)
    }
}

/**@param {Message} message*/
async function RemoveReactionRoles(message) {
    let pGuild = await PinguGuild.GetPGuild(message.guild);
    if (!pGuild.reactionRoles[0]) return;

    for (var rr of pGuild.reactionRoles) {
        if (rr.messageID != message.id) continue;

        let i = pGuild.reactionRoles.indexOf(rr)
        pGuild.reactionRoles.splice(i, 1);

        PinguLibrary.consoleLog(message.client, `Removed ${rr.emoteName} => ${rr.pRole.name}`);
    }

    PinguGuild.UpdatePGuildJSON(message.client, message.guild, `${this.name}, RemoveReactionRoles()`,
        `Successfully removed **${message.guild.name}**'s reactionroles for ${message.id}`,
        `Failed to remove **${message.guild.name}**'s reactionroles for ${message.id}`
    );
}