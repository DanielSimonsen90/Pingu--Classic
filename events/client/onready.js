const { Collection, GuildChannel, TextChannel, Guild, VoiceChannel } = require("discord.js");
const { PinguLibrary, PinguGuild, PinguEvent, PinguClient, PinguUser, PinguGuildMember, PGuild } = require("PinguPackage");
const ms = require('ms');

module.exports = new PinguEvent('onready', null,
    async function execute(client) {
        const { SetBadges, CacheSavedServers, CacheDevelopers, consoleLog, DBExecute, raspberryLog, errorLog, latencyCheck } = PinguLibrary
        CacheSavedServers(client);

        console.log('\n--== Client Info ==--');
        consoleLog(client, `Loaded ${client.commands.size} commands & ${client.events.size} events\n`);

        let [connMessage] = await Promise.all([
            DBExecute(client, async () => await consoleLog(client, `Connected to MongolDB!`)),
            client.users.fetch(PinguClient.Clients.PinguID),
            CacheDevelopers(client),
        ]);

        SetBadges();

        if (connMessage) {
            CacheFromDB(client)
            //UpdateGuilds()
        }

        consoleLog(client, `I'm back online!\n`);
        console.log(`Logged in as ${client.user.username}`);

        client.setActivity();
        raspberryLog(client);

        console.log(`--== | == - == | ==--\n`);

        client.setActivity();
        setInterval(() => client.setActivity(), ms('24h'));
        setInterval(() => {
            //Log latency every minute
            latencyCheck(client, Date.now())
                .catch(err => errorLog(client, `LatencyCheck error`, null, err, { params: message }));
        }, ms('1m'));

        if (client.config.updateStats && client.isLive) {
            UpdateStats();
            setInterval(() => UpdateStats, ms('24h'));
            function UpdateStats() {
                /**@param {string} channelID
                 * @returns {VoiceChannel}*/
                let getChannel = (channelID) => PinguLibrary.SavedServers.get('Pingu Support').channels.cache.get(channelID);
                let channels = [
                    '799596588859129887', //Servers
                    '799597092107583528', //Users
                    '799597689792757771', //Daily Leader
                    '799598372217683978', //Server of the Day
                    '799598024971518002', //User of the Day
                    '799598765187137537'  //Most known member
                ].map(id => getChannel(id));
                /**@param {VoiceChannel} channel*/
                let setName = async (channel) => {
                    /**@param {VoiceChannel} channel*/
                    let getInfo = async (channel) => {
                        switch (channel.id) {
                            case '799596588859129887': return getServersInfo(); //Servers
                            case '799597092107583528': return getUsersInfo(); //Users
                            case '799597689792757771': return getDailyLeader(); //Daily Leader
                            case '799598372217683978': return getRandomServer(); //Server of the Day
                            case '799598024971518002': return getRandomUser(); //User of the Day
                            case '799598765187137537': return getMostKnownUser(); //Most known User
                            default: PinguLibrary.errorLog(client, `ID of ${channel.name} was not recognized!`); return "No Info";
                        }

                        function getServersInfo() {
                            return client.guilds.cache.size.toString();
                        }
                        function getUsersInfo() {
                            return client.users.cache.size.toString();
                        }
                        async function getDailyLeader() {
                            try {
                                let pUser = (await PinguUser.GetUsers()).sort((a, b) => {
                                    try { return b.daily.streak - a.daily.streak }
                                    catch (err) { PinguLibrary.errorLog(client, `unable to get daily streak difference between ${a.tag} and ${b.tag}`, null, err); }
                                })[0];
                                return `${pUser.tag} #${pUser.daily.streak}`;
                            }
                            catch (err) {
                                PinguLibrary.errorLog(client, `Unable to get Daily Leader`, null, err, {
                                    PinguUsers: await PinguUser.GetUsers()
                                });
                            }
                        }
                        async function getRandomServer() {
                            let availableGuilds = client.guilds.cache.array().map(g => ![
                                PinguLibrary.SavedServers.get('Danho Misc').id,
                                PinguLibrary.SavedServers.get('Pingu Emotes').id,
                                PinguLibrary.SavedServers.get('Pingu Support').id,
                            ].includes(g.id) && g.name != undefined && g).filter(v => v);
                            let index = Math.floor(Math.random() * availableGuilds.length);

                            let chosenGuild = availableGuilds[index];
                            let pGuild = await PinguGuild.Get(chosenGuild);
                            client.emit('chosenGuild', ...[chosenGuild, pGuild]);
                            return chosenGuild.name;
                        }
                        async function getRandomUser() {
                            let availableUsers = client.users.cache.array().map(u => !u.bot && u).filter(v => v);
                            let index = Math.floor(Math.random() * availableUsers.length);

                            let chosenUser = availableUsers[index];
                            let pUser = await PinguUser.Get(chosenUser);
                            if (!pUser) return getRandomUser();

                            client.emit('chosenUser', ...[chosenUser, pUser]);
                            return chosenUser.tag;
                        }
                        function getMostKnownUser() {
                            let Users = client.guilds.cache.reduce((users, guild) => {
                                return guild.members.cache.reduce((_, member) => {
                                    let { user } = member;
                                    if (user.bot) return users;

                                    return users.set(user, !users.has(user) ? 1 : users.get(user) + 1);
                                }, users);
                            }, new Collection());
                            
                            let sorted = Users.sort((a, b) => b - a);
                            let mostKnownUsers = sorted.filter((v, u) => sorted.first() == v);
                            mostKnownUsers.forEach((_, user) => client.emit('mostKnownUser', user))
                            let strings = mostKnownUsers.map((v, u) => `${u.tag} | #${v}`);
                            return strings[Math.floor(Math.random() * strings.length)];
                        }
                    };
                    let channelName = channel.name.split(':')[0];
                    let info = await getInfo(channel);
                    let newName = `${channelName}: ${info}`;
                    if (channel.name == newName) return;
                    return channel.setName(newName);
                }

                for (var channel of channels) setName(channel);
            }
        }

        async function CacheFromDB() {
            for (var guild of client.guilds.cache.array()) {
                let pGuild = await PinguGuild.Get(guild);
                if (!pGuild) return;

                let { reactionRoles } = pGuild.settings;

                for (var rr of reactionRoles) {
                    let gChannel = guild.channels.cache.get(rr.channel._id);
                    if (!gChannel) continue;

                    let channel = ToTextChannel(gChannel);

                    //In .then function so it only logs if fetching is successful
                    channel.messages.fetch(rr.messageID)
                        .then(() => OnFulfilled('ReactionRole', rr.messageID, channel, guild))
                        .catch(err => OnError('ReactionRole', rr.messageID, channel, guild, err.message));
                }

                let { pollConfig, giveawayConfig, suggestionConfig, themeConfig } = pGuild.settings.config.decidables;
                let configs = [pollConfig, giveawayConfig, suggestionConfig, themeConfig].filter(config => config.firstTimeExecuted == false);
                let decidables = configs.map(config => config.polls || config.giveaways || config.suggestions || config.themes);

                for (var decidable of decidables) {
                    if (!decidable.endsAt || new Date(decidable.endsAt).getTime() < Date.now() || decidable.approved != undefined) continue;
                    let channel = ToTextChannel(guild.channels.cache.get(decidable.channel._id));

                    channel.messages.fetch(decidable._id, false, true)
                        .then(() => OnFulfilled(decidable.constructor.name, decidable._id, channel, guild))
                        .catch(err => OnError(decidable.constructor.name, decidable._id, channel, guild, err.message));
                }
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
                if (errMsg == 'Missing Access') return;
                return PinguLibrary.consoleLog(client, `Unable to cache ${type} "${id}" from #${channel.name}, ${guild.name} -- ${errMsg}`)
            }
        }
        async function UpdateGuilds() {
            const pUsers = await PinguUser.GetUsers();

            for (var [id, guild] of client.guilds.cache) {
                const { name } = guild;

                const pGuild = await PinguGuild.Get(guild);
                if (pGuild.name != name) {
                    pGuild.name = name;
                    await PinguGuild.Update(client, ['name'], pGuild, module.exports.name, "Name was not up to date.");
                }

                /**@returns {PinguGuildMember[]} */
                function PinguGuildMembersArray() {
                    const result = [];
                    pGuild.members.forEach(member => result.push(member));
                    return result;
                }

                const members = PinguGuildMembersArray();

                const filteredMembers = members.filter(pgm => pgm.guild.name != name);
                if (filteredMembers.length) {
                    for (var member of filteredMembers) {
                        member.name = name;
                        pGuild.members.set(member._id, member);
                    }
                    PinguGuild.Update(client, ['members'], pGuild, module.exports.name, "members.guild.name was not up to date.");
                }

                //Filter out the users that share the current guild and the name is incorrect
                const pUsersInGuild = pUsers.filter(pUser => pUser.sharedServers.filter(pg => pg._id == id && pg.name != name));
                if (!pUsersInGuild.length) continue;

                for (var pUser of pUsersInGuild) {
                    const { sharedServers } = pUser;
                    const pg = sharedServers.find(pg => pg._id == id);
                    const indexOfPG = sharedServers.indexOf(pg);
                    pUser.sharedServers[indexOfPG] = new PGuild(guild);
                    PinguUser.Update(client, ['sharedServers'], pUser, module.exports.name, `Name of **${name}** was not updated`);
                }
            }
        }
    }
)

