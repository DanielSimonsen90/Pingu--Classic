const { MessageEmbed, Guild } = require("discord.js");
const { PinguEvent } = require("PinguPackage");
/**@param {Guild} guild*/
const leftString = (guild) => `Left **${guild.name}**, owned by ${guild.owner}`;
module.exports = new PinguEvent('guildDelete',
    async function setContent(client, guild) {
        return module.exports.content = new MessageEmbed({ description: leftString(guild) });
    },
    async function execute(client, guild) {
        let pGuild = client.pGuilds.get(guild);
        if (!pGuild) return;

        if (pGuild.clients.find(c => c?._id != client.id)) /*Other Pingu client is in guild*/ return;

        //Remove guild from MongolDB
        await client.pGuilds.delete(guild, module.exports.name, leftString(guild));

        const guildUsers = guild.members.cache.map(gm => gm.user).filter(u => !u.bot);
        const clientGuilds = client.guilds.cache;

        //For each user in guild that isn't a bot
        for (var user of guildUsers) {
            const pUser = client.pUsers.get(user);
            if (!pUser) continue;

            //Amount of guilds that client & user share
            const clientGuildsShared = clientGuilds.filter(g => g.members.cache.has(user.id)).size;
            if (clientGuildsShared == 1) client.pUsers.delete(pUser, module.exports.name, `Removed **${user.tag}** from PinguUsers, as no servers are shared anymore`)
        }
    }
);