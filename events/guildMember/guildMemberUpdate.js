const { GuildMember, Client } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: guildMemberUpdate',
    /**@param {Client} client
     @param {{preMember: GuildMember, member: GuildMember}}*/
    execute(client, { preMember, member }) {
        if (preMember.user.bot || preMember.user == member.user) return;

        return;
        PinguUser.DeletePUser(preMember.user, () =>
            PinguUser.WritePUser(member.user, client, _ =>
                PinguLibrary.pUserLog(client, this.name, 
                    `Updated **${(preMember.user.tag != member.user.tag ? member.user.tag : `(${preMember.user.tag})`)}**'s json file`)));
    }
}