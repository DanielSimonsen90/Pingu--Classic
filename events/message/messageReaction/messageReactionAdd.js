const { Client, MessageReaction, User } = require("discord.js");
const { PinguLibrary, ReactionRole } = require("../../../PinguPackage");

module.exports = {
    name: 'events: messageReactionAdd',
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

    } catch (err) { PinguLibrary.errorLog(client, `${this.name} error`, null, err); }
}