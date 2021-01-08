const { Client, Guild } = require("discord.js");
const { PinguGuild, PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: guildDelete',
    /**@param {Client} client
     * @param {{guild: Guild}}*/
    execute(client, { guild }) {
        PinguGuild.DeletePGuild(guild, pGuild =>
            PinguLibrary.pGuildLog(client, this.name, `Successfully left "**${pGuild.name}**", owned by <@${pGuild.guildOwner.id}>`));

        let guildUsers = guild.members.cache.array().map(gm => !gm.user.bot && gm.user);
        let clientGuilds = client.guilds.cache.array();

        for (var user of guildUsers) {
            let pUser = PinguUser.GetPUser(user);
            if (!pUser) continue;

            let guilds = clientGuilds.map(g => g.member(user)).length;
            if (guilds == 1) PinguUser.DeletePUser(user, pUser =>
                PinguLibrary.pUserLog(client, this.name, `Successfully removed **${pUser.tag}** from pUsers.`));
        }
    }
}