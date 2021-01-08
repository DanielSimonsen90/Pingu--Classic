const { GuildMember, Client } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: guildMemberUpdate',
    /**@param {Client} client
     @param {{from: GuildMember, to: GuildMember}}*/
    execute(client, { from, to }) {
        if (from.user.bot || from.user == to.user) return;

        PinguUser.DeletePUser(from.user, () =>
            PinguUser.WritePUser(to.user, client, _ =>
                PinguLibrary.pUserLog(client, this.name, 
                    `Updated **${(from.user.tag != to.user.tag ? to.user.tag : `(${from.user.tag})`)}**'s json file`)));
    }
}