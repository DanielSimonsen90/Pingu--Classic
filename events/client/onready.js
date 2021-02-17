const { Client, GuildChannel, TextChannel, Guild } = require("discord.js");
const { PinguLibrary, PinguGuild, PinguEvent } = require("PinguPackage");

const CacheTypes = 'ReactionRole' || 'Giveaway' || 'Poll' || 'Suggestion' || 'Theme';

module.exports = new PinguEvent('ready', {
    /**@param {Client} client*/
    async execute(client) {
        console.log('\n--== Client Info ==--');
        PinguLibrary.consoleLog(client, `Loaded ${client.commands.array().length} commands & ${client.events.array().length} events\n`);

        await client.users.fetch(PinguLibrary.Clients.PinguID);
        await PinguLibrary.CacheDevelopers(client);

        CacheFromDB(client);

        await PinguLibrary.DBExecute(client, () => PinguLibrary.consoleLog(client, `Connected to MongolDB!`));
        PinguLibrary.consoleLog(client, `I'm back online!\n`);
        console.log(`Logged in as ${client.user.username}`);

        PinguLibrary.setActivity(client);

        console.log(`--== | == - == | ==--\n`);
    }
})

/**@param {Client} client*/
function CacheFromDB(client) {
    RunCache('ReactionRole', CacheReactionRoles);
    RunCache('Poll', CacheActivePolls);
    RunCache('Giveaway', CacheActiveGiveaways);
    RunCache('Suggestion', CacheActiveSuggestions);
    RunCache('Theme', CacheActiveThemes);

    /**@param {CacheTypes} type
     * @param {(client: Client) => void} callback*/
    function RunCache(type, callback) {
        try { callback(client); }
        catch (err) { PinguLibrary.errorLog(client, `[${type}] Unable to cache ${type} messages!`, null, err); }
    }

    function CacheReactionRoles() {
        client.guilds.cache.forEach(async guild => {
            let pGuild = await PinguGuild.GetPGuild(guild);
            if (!pGuild) return;

            let { reactionRoles } = pGuild;
            reactionRoles.forEach(rr => {
                let gChannel = guild.channels.cache.get(rr.channel._id);
                if (!gChannel) return;

                let channel = ToTextChannel(gChannel);

                if (client.user.id == PinguLibrary.Clients.BetaID &&
                    pGuild.clients[0] &&
                    client.users.cache.get(PinguLibrary.Clients.PinguID).presence.status != 'offline')
                    return; //Client is BETA but LIVE is in guild

                //In .then function so it only logs if fetching is successful
                channel.messages.fetch(rr.messageID)
                    .then(() => OnFulfilled('ReactionRole', rr.messageID, channel, guild))
                    .catch(err => OnError('ReactionRole', rr.messageID, channel, guild, err.message));
            });
        })
    }
    function CacheActiveGiveaways() {
        client.guilds.cache.forEach(async guild => {
            let pGuild = await PinguGuild.GetPGuild(guild);
            if (!pGuild) return;

            let { giveaways } = !pGuild.giveawayConfig.firstTimeExecuted && pGuild.giveawayConfig;
            if (!giveaways) return;

            if (client.user.id == PinguLibrary.Clients.BetaID &&
                pGuild.clients[0] &&
                client.users.cache.get(PinguLibrary.Clients.PinguID).presence.status != 'offline')
                return; //Client is BETA but LIVE is in guild
            giveaways.forEach(giveaway => {
                if (new Date(giveaway.endsAt).getTime() < Date.now()) return;

                let channel = ToTextChannel(guild.channels.cache.get(giveaway.channel._id));
                channel.messages.fetch(giveaway._id, false, true)
                    .then(() => OnFulfilled('Giveaway', giveaway._id, channel, guild))
                    .catch(err => OnError('Giveaway', giveaway._id, channel, guild, err.message));
            })
        })
    }
    function CacheActivePolls() {
        client.guilds.cache.forEach(async guild => {
            let pGuild = await PinguGuild.GetPGuild(guild);
            if (!pGuild) return;

            let { polls } = !pGuild.pollConfig.firstTimeExecuted && pGuild.pollConfig;
            if (!polls) return;

            if (client.user.id == PinguLibrary.Clients.BetaID &&
                pGuild.clients[0] &&
                client.users.cache.get(PinguLibrary.Clients.PinguID).presence.status != 'offline')
                return; //Client is BETA but LIVE is in guild
            polls.forEach(poll => {
                if (new Date(poll.endsAt).getTime() < Date.now()) return;

                let channel = ToTextChannel(guild.channels.cache.get(poll.channel._id));
                channel.messages.fetch(poll._id, false, true)
                    .then(() => OnFulfilled('Poll', poll._id, channel, guild))
                    .catch(err => OnError('Poll', poll._id, channel, guild, err.message));
            })
        })
    }
    function CacheActiveSuggestions() {
        client.guilds.cache.forEach(async guild => {
            let pGuild = await PinguGuild.GetPGuild(guild);
            if (!pGuild) return;

            let { suggestions } = !pGuild.suggestionConfig.firstTimeExecuted && pGuild.suggestionConfig;
            if (!suggestions) return;

            if (client.user.id == PinguLibrary.Clients.BetaID &&
                pGuild.clients[0] &&
                client.users.cache.get(PinguLibrary.Clients.PinguID).presence.status != 'offline')
                return; //Client is BETA but LIVE is in guild

            suggestions.forEach(suggestion => {
                if (suggestion.approved != undefined) return;

                let channel = ToTextChannel(guild.channels.cache.get(suggestion.channel._id));
                channel.messages.fetch(suggestion._id, false, true)
                    .then(() => OnFulfilled('Suggestion', suggestion._id, channel, guild))
                    .catch(err => OnError('Suggestion', suggestion._id, channel, guild, err.message));
            })
        })
    }
    function CacheActiveThemes() {
        client.guilds.cache.forEach(async guild => {
            let pGuild = await PinguGuild.GetPGuild(guild);
            if (!pGuild) return;

            let { themes } = !pGuild.themeConfig.firstTimeExecuted && pGuild.themeConfig;
            if (!themes) return;

            if (client.user.id == PinguLibrary.Clients.BetaID &&
                pGuild.clients[0] &&
                client.users.cache.get(PinguLibrary.Clients.PinguID).presence.status != 'offline')
                return; //Client is BETA but LIVE is in guild

            themes.forEach(theme => {
                if (new Date(theme.endsAt).getTime() < Date.now()) return;

                let channel = ToTextChannel(guild.channels.cache.get(theme.channel._id));
                channel.messages.fetch(theme._id, false, true)
                    .then(() => OnFulfilled('Theme', theme._id, channel, guild))
                    .catch(err => OnError('Theme', theme._id, channel, guild, err.message));
            })
        })
    }

    /**@param {GuildChannel} guildChannel
     * @returns {TextChannel}*/
    function ToTextChannel(guildChannel) {
        return guildChannel.isText() && guildChannel;
    }
    /**@param {CacheTypes} type
     * @param {string} id
     * @param {TextChannel} channel
     * @param {Guild} guild*/
    function OnFulfilled(type, id, channel, guild) {
        return PinguLibrary.consoleLog(client, `Cached ${type} "${id}" from #${channel.name}, ${guild.name}`)
    }
    /**@param {CacheTypes} type
     * @param {string} id
     * @param {TextChannel} channel
     * @param {Guild} guild*/
    function OnError(type, id, channel, guild, errMsg) {
        return PinguLibrary.consoleLog(client, `Unable to cache ${type} "${id}" from #${channel.name}, ${guild.name} -- ${errMsg}`)
    }
}