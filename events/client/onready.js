const { Client, GuildChannel, TextChannel } = require("discord.js");
const { PinguLibrary, PinguGuild } = require("../../PinguPackage");
const { announceOutages } = require('../../config');

module.exports = {
    name: 'events: ready',
    /**@param {Client} client*/
    execute(client) {
        try { CacheReactionRoles(client); }
        catch (err) { PinguLibrary.errorLog(client, `Unable to cache reactionrole messages!`, null, err); }

        if (announceOutages) PinguLibrary.outages(client, `\nI'm back online!\n`);
        PinguLibrary.consoleLog(client, `\nI'm back online!\n`);
        PinguLibrary.setActivity(client);
    }
}

/**@param {Client} client*/
function CacheReactionRoles(client) {
    client.guilds.cache.forEach(guild => {
        let pGuild = PinguGuild.GetPGuild(guild);
        if (!pGuild) return;

        let { reactionRoles } = pGuild;
        reactionRoles.forEach(rr => {
            let gChannel = guild.channels.cache.get(rr.channel.id);
            if (!gChannel) return;

            let channel = ToTextChannel(gChannel);
            channel.messages.fetch(rr.messageID);

            //PinguLibrary.ConsoleLog(client, `Cached ${rr.messageID} from #${channel.name}, ${guild.name}`)
        });
    })
}

/**@param {GuildChannel} channel
 * @returns {TextChannel}*/
function ToTextChannel(channel) {
    return channel.isText() && channel;
}