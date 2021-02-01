const { Client, GuildChannel, TextChannel } = require("discord.js");
const { PinguLibrary, PinguGuild } = require("../../PinguPackage");

module.exports = {
    name: 'events: ready',
    /**@param {Client} client*/
    async execute(client) {
        try { CacheReactionRoles(client); }
        catch (err) { PinguLibrary.errorLog(client, `Unable to cache reactionrole messages!`, null, err); }

        console.log(' ');
        await PinguLibrary.DBExecute(client, () => PinguLibrary.consoleLog(client, `Connected to MongolDB!`));
        PinguLibrary.consoleLog(client, `I'm back online!\n`);
        console.log(`Logged in as ${client.user.username}`);

        PinguLibrary.setActivity(client);
    }
}

/**@param {Client} client*/
function CacheReactionRoles(client) {
    client.guilds.cache.forEach(async guild => {
        let pGuild = await PinguGuild.GetPGuild(guild);
        if (!pGuild) return;

        let { reactionRoles } = pGuild;
        reactionRoles.forEach(rr => {
            let gChannel = guild.channels.cache.get(rr.channel.id);
            if (!gChannel) return;

            let channel = ToTextChannel(gChannel);

            if (client.user.id == PinguLibrary.Clients.BetaID && guild.name == 'Pingu Support' && channel.name == 'roles') return;

            channel.messages.fetch(rr.messageID);

            PinguLibrary.ConsoleLog(client, `Cached ${rr.messageID} from #${channel.name}, ${guild.name}`)
        });
    })
}

/**@param {GuildChannel} channel
 * @returns {TextChannel}*/
function ToTextChannel(channel) {
    return channel.isText() && channel;
}