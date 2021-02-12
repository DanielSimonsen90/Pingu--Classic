const { Client, Guild, MessageEmbed } = require("discord.js");
const { PinguGuild, PinguLibrary, PinguUser } = require("PinguPackage");

module.exports = {
    name: 'events: guildDelete',
    /**@param {{guild: Guild}}*/
    setContent({ guild }) {
        return module.exports.content = new MessageEmbed().setDescription(`**${guild.name}** was deleted.`);
    },
    /**@param {Client} client
     * @param {{guild: Guild}}*/
    async execute(client, { guild }) {
        let pGuild = await PinguGuild.GetPGuild(guild);
        if (pGuild.clients.find(c => c && c._id != client.user.id)) /*Other Pingu client is in guild*/ return;

        //Remove guild from MongolDB
        await PinguGuild.DeletePGuild(client, guild, module.exports.name,
            `Successfully left **${guild.name}**, owned by ${guild.owner}`,
            `Something went wrong when leaving ${guild.name} (${guild.id})!`
        );

        let guildUsers = guild.members.cache.array().map(gm => !gm.user.bot && gm.user);
        let clientGuilds = client.guilds.cache.array();

        //For each user in guild that isn't a bot
        for (var user of guildUsers) {
            let pUser = await PinguUser.GetPUser(user);
            if (!pUser) continue;

            //Amount of guilds that client & user share
            let clientGuildsShared = clientGuilds.map(g => g.members.cache.has(user.id)).length;
            if (clientGuildsShared == 1)
                PinguUser.DeletePUser(client, user, module.exports.name,
                    `Successfully removed **${user.tag}** from MongolDB`,
                    `Failed to remove **${user.tag}** from MongolDB`,
                );
        }
    }
}