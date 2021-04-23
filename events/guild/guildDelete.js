const { MessageEmbed } = require("discord.js");
const { PinguGuild, PinguEvent, PinguUser } = require("PinguPackage");

module.exports = new PinguEvent('guildDelete',
    async function setContent(guild) {
        return module.exports.content = new MessageEmbed().setDescription(`**${guild.name}** was deleted.`);
    },
    async function execute(client, guild) {
        let pGuild = await PinguGuild.Get(guild);
        if (pGuild.clients.find(c => c && c._id != client.id)) /*Other Pingu client is in guild*/ return;

        //Remove guild from MongolDB
        await PinguGuild.Delete(client, guild, module.exports.name, `Left **${guild.name}**, owned by ${guild.owner}`);

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