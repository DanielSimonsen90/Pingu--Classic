const { Client, Message, MessageEmbed } = require("discord.js");
const { PinguGuild } = require("../../PinguPackage");

module.exports = {
    name: 'events: messageDelete',
    /**@param {Client} client
     @param {{message: Message}}*/
    execute(client, { message }) {
        IsReactionRole(message);
    }
}

/**@param {Message} message*/
async function IsReactionRole(message) {
    let { guild } = message;
    if (!guild) return;

    let pGuild = PinguGuild.GetPGuild(guild);
    if (!pGuild) return;

    let { reactionRoles } = pGuild;
    let rrFromMessage = reactionRoles.map(rr => rr.messageID == message.id && rr);

    if (!rrFromMessage) return;

    let rrEmotes = rrFromMessage.map(rr => rr.emoteName);

    let warningMessageInfoPromise = rrFromMessage.map(rr => `${guild.emojis.cache.find(e => e.name == rr.emoteName)}: ${guild.roles.cache.find(r => r.id == rr.pRole.id)}`);

    for (var reaction of message.reactions.cache.array()) {
        if (!rrEmotes.includes(reaction.emoji.name)) continue;

        let gMembers = reaction.users.cache.array().map(u => guild.member(u));
        let rr = reactionRoles.find(rr => rr.emoteName == reaction.emoji.name);
        let role = await guild.roles.fetch(rr.pRole.id);

        for (var gm of gMembers) await gm.roles.remove(role, `ReactionRole message deleted`);
    }

    message.author.send(new MessageEmbed()
        .setTitle(`ReactionRole message deleted!`)
        .setColor(pGuild.embedColor)
        .setTimestamp(Date.now())
        .setDescription(
            `**Your reactionrole message in ${message.channel} was deleted!**\n` +
            `It had these reactionroles assigned to it:\n` +
            warningMessageInfoPromise.join(`\n`)
        )
    )
}