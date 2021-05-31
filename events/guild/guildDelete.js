const { MessageEmbed, Guild } = require("discord.js");
const { PinguGuild, PinguEvent, PinguUser, PinguClient } = require("PinguPackage");
/**@param {PinguClient} client
 * @param {Guild} guild*/
const leftString = (client, guild) => `Left **${guild.name}**, owned by ${guild.owner}`;
module.exports = new PinguEvent('guildDelete',
    async function setContent(guild) {
        return module.exports.content = new MessageEmbed().setDescription(leftString(guild.client, guild));
    },
    async function execute(client, guild) {
        let pGuild = await PinguGuild.Get(guild);
        if (!pGuild) return;

        if (pGuild.clients.find(c => c && c._id != client.id)) /*Other Pingu client is in guild*/ return;

        //Remove guild from MongolDB
        await PinguGuild.Delete(client, guild, module.exports.name, leftString(client, guild));

        let guildUsers = guild.members.cache.array().map(gm => !gm.user.bot && gm.user);
        let clientGuilds = client.guilds.cache.array();

        //For each user in guild that isn't a bot
        for (var user of guildUsers) {
            let pUser = await PinguUser.Get(user);
            if (!pUser) continue;

            //Amount of guilds that client & user share
            let clientGuildsShared = clientGuilds.map(g => g.members.cache.has(user.id)).length;
            if (clientGuildsShared == 1) PinguUser.Delete(client, user, module.exports.name, `Removed **${user.tag}** from PinguUsers, as no servers are shared anymore`);
        }
    }
);