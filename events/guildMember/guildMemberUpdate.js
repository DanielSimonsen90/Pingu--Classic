const { GuildMember, Client, GuildMember } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: guildMemberUpdate',
    /**@param {Client} client
     @param {GuildMember} from
     @param { GuildMember } to*/
    execute(client, from, to) {
        if (from.user == to.user) return;

        PinguUser.DeletePUser(from.user, () =>
            PinguUser.WritePUser(to.user, client, _ =>
                PinguLibrary.pUserLog(client, module.exports.name,
                    `Updated **${(from.user.tag != to.user.tag ? to.user.tag : `(${from.user.tag})`)}**'s json file`
                )
            )
        );
    }
}