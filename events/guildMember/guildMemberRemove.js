const { GuildMember, Client, GuildMember } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: guildMemberRemove',
    /**@param {Client} client
     @param {GuildMember} member*/
    execute(client, member) {
        if (member.user.bot) return;
        let welcomeChannel = require('./guildMemberAdd').getWelcomeChannel(member.guild);
        if (welcomeChannel)
            welcomeChannel.send(`${member.displayName} ${(member.displayName != member.user.username ? `(${member.user.username})` : ``)} has left ${member.guild.name}...`);

        UpdateSharedServers();

        function UpdateSharedServers() {
            let pUser = PinguUser.GetPUser(member.user);
            pUser.sharedServers = pUser.sharedServers.filter(guild => guild.id != member.guild.id);

            if (pUser.sharedServers.length == 0)
                PinguUser.DeletePUser(member.user, async pUser =>
                    PinguLibrary.pUserLog(client, this.name, `Successfully deleted ${pUser.tag} from Pingu Users.`)
                );
            else PinguUser.UpdatePUsersJSON(client, member.user, this.name, `Successfully removed **${member.guild.name}** from **${pUser.tag}**'s SharedServers.`)
        }
    }
}