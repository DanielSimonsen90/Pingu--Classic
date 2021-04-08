const { Collection, GuildChannel, TextChannel, Guild, VoiceChannel } = require("discord.js");
const { PinguLibrary, PinguGuild, PinguEvent, PinguClient, PinguUser } = require("PinguPackage");
const ms = require('ms');

const CacheTypes = 'ReactionRole' || 'Giveaway' || 'Poll' || 'Suggestion' || 'Theme';

module.exports = new PinguEvent('onready', 
    async function execute(client) {
        console.log('\n--== Client Info ==--');
        PinguLibrary.consoleLog(client, `Loaded ${client.commands.array().length} commands & ${client.events.array().length} events\n`);

        await client.users.fetch(PinguClient.Clients.PinguID);
        await PinguLibrary.CacheDevelopers(client);

        CacheFromDB(client);

        await PinguLibrary.DBExecute(client, () => PinguLibrary.consoleLog(client, `Connected to MongolDB!`));
        PinguLibrary.consoleLog(client, `I'm back online!\n`);
        console.log(`Logged in as ${client.user.username}`);

        client.setActivity();
        PinguLibrary.raspberryLog(client);

        console.log(`--== | == - == | ==--\n`);

        client.setActivity();
        setInterval(() => client.setActivity(), ms('24h'));

        if (client.config.updateStats && client.isLive) {
            UpdateStats();
            setInterval(() => UpdateStats, ms('24h'));
            function UpdateStats() {
                /**@param {PinguClient} client
                 * @param {string} channelID
                 * @returns {VoiceChannel}*/
                let getChannel = (client, channelID) => PinguLibrary.SavedServers.PinguSupport(client).channels.cache.get(channelID);
                let channels = [
                    getChannel(client, '799596588859129887'), //Servers
                    getChannel(client, '799597092107583528'), //Users
                    getChannel(client, '799597689792757771'), //Daily Leader
                    getChannel(client, '799598372217683978'), //Server of the Day
                    getChannel(client, '799598024971518002'), //User of the Day
                    getChannel(client, '799598765187137537')  //Most known member
                ]
                /**@param {VoiceChannel} channel*/
                let setName = async (channel) => {
                    /**@param {VoiceChannel} channel*/
                    let getInfo = async (channel) => {
                        switch (channel.id) {
                            case '799596588859129887': return getServersInfo(); //Servers
                            case '799597092107583528': return getUsersInfo(); //Users
                            case '799597689792757771': return await getDailyLeader(); //Daily Leader
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
                                let pUser = (await PinguUser.GetPUsers()).sort((a, b) => {
                                    try { return b.daily.streak - a.daily.streak }
                                    catch (err) { errorLog(client, `unable to get daily streak difference between ${a.tag} and ${b.tag}`, null, err); }

                                })[0];
                                return `${pUser.tag} #${pUser.daily.streak}`;
                            }
                            catch (err) {
                                PinguLibrary.errorLog(client, `Unable to get Daily Leader`, null, err, {
                                    PinguUsers: await PinguUser.GetPUsers()
                                });
                            }
                        }
                        function getRandomServer() {
                            let availableGuilds = client.guilds.cache.array().map(g => ![
                                PinguLibrary.SavedServers.DanhoMisc(client).id,
                                PinguLibrary.SavedServers.PinguEmotes(client).id,
                                PinguLibrary.SavedServers.PinguSupport(client).id,
                            ].includes(g.id) && g.name != undefined && g).filter(v => v);
                            let index = Math.floor(Math.random() * availableGuilds.length);

                            let chosenGuild = availableGuilds[index];
                            client.emit('chosenGuild', chosenGuild, await PinguGuild.GetPGuild(chosenGuild));
                            return chosenGuild.name;
                        }
                        function getRandomUser() {
                            let availableUsers = client.users.cache.array().map(u => !u.bot && u).filter(v => v);
                            let index = Math.floor(Math.random() * availableUsers.length);

                            let chosenUser = availableUsers[index];
                            client.emit('chosenUser', chosenUser, await PinguUser.GetPUser(chosenUser));
                            return chosenUser.tag;
                        }
                        function getMostKnownUser() {
                            let Users = new Collection(); //<User, number of Guilds>

                            client.guilds.cache.forEach(guild => {
                                guild.members.cache.forEach(gm => {
                                    let { user } = gm;
                                    if (user.bot) return;

                                    if (!Users.has(user))
                                        return Users.set(user, 1);

                                    Users.set(user, Users.get(user) + 1);
                                })
                            });

                            let sorted = Users.sort((a, b) => b - a);
                            let strings = sorted.filter((v, u) => sorted.first() == v).map((v, u) => `${u.tag} | #${v}`);
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
            for (var guild of client.guilds.cache) {
                let pGuild = await PinguGuild.GetPGuild(guild);
                if (!pGuild) return;

                let { reactionRoles } = pGuild.settings;

                for (var rr of reactionRoles) {
                    let gChannel = guild.channels.cache.get(rr.channel._id);
                    if (!gChannel) return;

                    let channel = ToTextChannel(gChannel);

                    //In .then function so it only logs if fetching is successful
                    channel.messages.fetch(rr.messageID)
                        .then(() => OnFulfilled('ReactionRole', rr.messageID, channel, guild))
                        .catch(err => OnError('ReactionRole', rr.messageID, channel, guild, err.message));
                }

                let { pollConfig, giveawayConfig, suggestionConfig, themeConfig } = pGuild.settings.config.decidables;
                let configs = [pollConfig, giveawayConfig, suggestionConfig, themeConfig].filter(config => !config.firstTimeExecuted);
                let decidables = configs.map(config => config.polls || config.giveaways || config.suggestions || config.themes);

                for (var decidable of decidables) {
                    if (!decidable.endsAt || new Date(decidable.endsAt).getTime() < Date.now() || decidable.approved != undefined) return;
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
    }
)

