const { Client, GuildChannel, TextChannel, Guild } = require("discord.js");
const { PinguLibrary, PinguGuild } = require("../../PinguPackage");

const type = 'ReactionRole' || 'Giveaway' || 'Poll' || 'Suggestion';

module.exports = {
    name: 'events: ready',
    /**@param {Client} client*/
    async execute(client) {
        console.log('\n--== Client Info ==--');
        PinguLibrary.consoleLog(client, `Loaded ${client.commands.array().length} commands & ${client.events.array().length} events\n`);

        CacheFromDB(client);

        await PinguLibrary.DBExecute(client, () => PinguLibrary.consoleLog(client, `Connected to MongolDB!`));
        PinguLibrary.consoleLog(client, `I'm back online!\n`);
        console.log(`Logged in as ${client.user.username}`);

        PinguLibrary.setActivity(client);

        console.log(`--== | == - == | ==--\n`);
    }
}

/**@param {Client} client*/
function CacheFromDB(client) {
    RunCache(client, 'ReactionRole', CacheReactionRoles);
    RunCache(client, 'Poll', CacheActivePolls);
    RunCache(client, 'Giveaway', CacheActiveGiveaways);
    RunCache(client, 'Suggestion', CacheActiveSuggestions);

    /**@param {type} type
     * @param {(client: Client) => void} callback*/
    function RunCache(type, callback) {
        try { callback(client); }
        catch (err) { PinguLibrary.errorLog(client, `Unable to cache ${type} messages!`, null, err); }
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

                if (client.user.id == PinguLibrary.Clients.BetaID && pGuild.clients[0]) return; //Client is BETA but LIVE is in guild

                //In .then function so it only logs if fetching is successful
                channel.messages.fetch(rr.messageID)
                    .then(() => OnFulfilled(client, 'ReactionRole', rr.messageID, channel, guild))
                    .catch(() => OnError(client, 'ReactionRole', rr.messageID, channel, guild));
            });
        })
    }
    function CacheActiveGiveaways() {
        client.guilds.cache.forEach(async guild => {
            let pGuild = await PinguGuild.GetPGuild(guild);
            if (!pGuild) return;

            let { giveaways } = !pGuild.giveawayConfig.firstTimeExecuted && pGuild.giveawayConfig;
            if (!giveaways) return;

            giveaways.forEach(giveaway => {
                if (new Date(giveaway.endsAt).getTime() < Date.now()) return;

                let channel = ToTextChannel(guild.channels.cache.get(giveaway.channel._id));
                channel.messages.fetch(giveaway._id, false, true)
                    .then(() => OnFulfilled(client, 'Giveaway', giveaway._id, channel, guild))
                    .catch(() => OnError(client, 'Giveaway', giveaway._id, channel, guild));
            })
        })
    }
    function CacheActivePolls() {
        client.guilds.cache.forEach(async guild => {
            let pGuild = await PinguGuild.GetPGuild(guild);
            if (!pGuild) return;

            let { polls } = !pGuild.pollConfig.firstTimeExecuted && pGuild.pollConfig;
            if (!polls) return;

            polls.forEach(poll => {
                if (new Date(poll.endsAt).getTime() < Date.now()) return;

                let channel = ToTextChannel(guild.channels.cache.get(poll.channel._id));
                channel.messages.fetch(poll._id, false, true)
                    .then(() => OnFulfilled(client, 'Poll', poll._id, channel, guild))
                    .catch(() => OnError(client, 'Poll', poll._id, channel, guild));
            })
        })
    }
    function CacheActiveSuggestions() {
        client.guilds.cache.forEach(async guild => {
            let pGuild = await PinguGuild.GetPGuild(guild);
            if (!pGuild) return;

            let { suggestions } = !pGuild.suggestionConfig.firstTimeExecuted && pGuild.suggestionConfig;
            if (!suggestions) return;

            suggestions.forEach(suggestion => {
                if (new Date(suggestion.endsAt).getTime() < Date.now()) return;

                let channel = ToTextChannel(guild.channels.cache.get(suggestion.channel._id));
                channel.messages.fetch(suggestion._id, false, true)
                    .then(() => OnFulfilled(client, 'Suggestion', suggestion._id, channel, guild))
                    .catch(() => OnError(client, 'Suggestion', suggestion._id, channel, guild));
            })
        })
    }

    /**@param {GuildChannel} guildChannel
     * @returns {TextChannel}*/
    function ToTextChannel(guildChannel) {
        return guildChannel.isText() && guildChannel;
    }
    /**@param {type} type
     * @param {string} id
     * @param {TextChannel} channel
     * @param {Guild} guild*/
    function OnFulfilled(type, id, channel, guild) {
        return PinguLibrary.consoleLog(client, `Cached ${type} "${id}" from #${channel.name}, ${guild.name}`)
    }
    /**@param {type} type
     * @param {string} id
     * @param {TextChannel} channel
     * @param {Guild} guild*/
    function OnError(type, id, channel, guild) {
        return PinguLibrary.consoleLog(client, `Unable to cache ${type} "${id}" from #${channel.name}, ${guild.name}`)
    }
}