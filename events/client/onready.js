const { Collection, GuildChannel, TextChannel, Guild, VoiceChannel } = require("discord.js");
const { PinguEvent, PinguGuildMember, PGuild, DecidablesTypes } = require("PinguPackage");
const ms = require('ms');

module.exports = new PinguEvent('onready', null,
    async function execute(_, client) {
        console.log('\n--== Client Info ==--');
        client.log('console', `Loaded ${client.commands.size} commands & ${client.events.size} events\n`)

        const connMessage = await client.DBExecute(() => client.log('console', `Connected to MongolDB!`));

        if (connMessage) {
            CacheFromDB(client)
            //UpdateGuilds()
        }

        client.log('console', `I'm back online!\n`);
        client.log('raspberry');
        console.log(`Logged in as ${client.user.username}`);
        console.log(`--== | == - == | ==--\n`);

        client.setActivity();
        setInterval(() => client.setActivity(), ms('24h'));
        
        //Log latency every minute
        setInterval(() => client.log('ping', Date.now()).catch(err => client.log('error', `LatencyCheck error`, null, err)), ms('1m'));

        if (client.config.updateStats && client.isLive) {
            UpdateStats();
            setInterval(() => UpdateStats, ms('24h'));

            function UpdateStats() {
                /**@param {string} channelID
                 * @returns {VoiceChannel}*/
                let getChannel = (channelID) => client.savedServers.get('Pingu Support').channels.cache.get(channelID);
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
                    const getServersInfo = () => client.guilds.cache.size.toString();
                    const getUsersInfo = () => client.users.cache.size.toString();
                    const getDailyLeader = async () => {
                        try {
                            let pUser = client.pUsers.array().sort((a, b) => {
                                try { return b.daily.streak - a.daily.streak }
                                catch (err) { client.log('error', `unable to get daily streak difference between ${a.tag} and ${b.tag}`, null, err); }
                            })[0];
                            return `${pUser.tag} #${pUser.daily.streak}`;
                        }
                        catch (err) { client.log('error', `Unable to get Daily Leader`, null, err, { PinguUsers: client.pUsers.array() }); }
                    }
                    const getRandomServer = async () => {
                        let availableGuilds = client.guilds.cache.map(g => !client.savedServers.map(g => g.id).includes(g.id) && g.name != undefined && g).filter(v => v);
                        let i = Math.floor(Math.random() * availableGuilds.length);

                        let chosenGuild = availableGuilds[i];
                        let pGuild = client.pGuilds.get(chosenGuild);
                        client.emit('chosenGuild', ...[chosenGuild, pGuild]);
                        return chosenGuild.name;
                    }
                    const getRandomUser = async () => {
                        let availableUsers = client.users.cache.filter(u => !u.bot);
                        let i = Math.floor(Math.random() * availableUsers.length);

                        let chosenUser = availableUsers[i];
                        let pUser = client.pUsers.get(chosenUser);
                        if (!pUser) return getRandomUser();

                        client.emit('chosenUser', ...[chosenUser, pUser]);
                        return chosenUser.tag;
                    }
                    const getMostKnownUser = () => {
                        let users = client.guilds.cache.reduce((users, guild) => {
                            return guild.members.cache.reduce((_, member) => {
                                let { user } = member;
                                if (user.bot) return users;

                                return users.set(user, !users.has(user) ? 1 : users.get(user) + 1);
                            }, users);
                        }, new Collection());
                        
                        let sorted = users.sort((a, b) => b - a);
                        let mostKnownUsers = sorted.filter((v, u) => sorted.first() == v);
                        mostKnownUsers.forEach((_, user) => client.emit('mostKnownUser', user))
                        let strings = mostKnownUsers.map((v, u) => `${u.tag} | #${v}`);
                        return strings[Math.floor(Math.random() * strings.length)];
                    }

                    /**@param {VoiceChannel} channel*/
                    const getInfo = new Collection([
                        ['799596588859129887', getServersInfo], //Servers
                        ['799597092107583528', getUsersInfo], //Users
                        ['799597689792757771', getDailyLeader], //Daily Leader
                        ['799598372217683978', getRandomServer], //Server of the Day
                        ['799598024971518002', getRandomUser], //User of the Day
                        ['799598765187137537', getMostKnownUser], //Most known User
                    ]);
                    let channelName = channel.name.split(':')[0];
                    let info = await getInfo.get(channel.id)?.() || (function onNoKey() {
                        client.log('error', `ID of ${channel.name} was not recognized!`)
                        return "No Info";
                    })();
                    let newName = `${channelName}: ${info}`;
                    if (channel.name == newName) return;
                    return channel.setName(newName);
                }

                for (var channel of channels) setName(channel);
            }
        }

        async function CacheFromDB() {
            for (var [_, guild] of client.guilds.cache) {
                let pGuild = client.pGuilds.get(guild);
                if (!pGuild) return;

                const { reactionRoles } = pGuild.settings;

                await Promise.all(reactionRoles.map(async rr => {
                    if (!rr) return null;

                    const gChannel = guild.channels.cache.get(rr.channel._id);
                    if (!gChannel) return null;
    
                    let channel = ToTextChannel(gChannel);
                    
                    try {
                        const value = `${rr.emoteName} => @${rr.pRole.name}`;
                        
                        //In .then function so it only logs if fetching is successful
                        return channel.messages.fetch(rr.messageID)
                            .then(() => OnFulfilled('ReactionRole', value, rr.messageID, channel, guild))
                            .catch(err => OnError('ReactionRole', value, rr.messageID, channel, guild, err.message));
                    }
                    catch(err) {
                        client.log('error', `how is emoteName undefined?`, null, err, {
                            trycatch: { rr, emoteName: rr.emoteName, guild: guild.name, channel: channel.name }
                        });
                        return null;
                    }
                }));

                let { pollConfig, giveawayConfig, suggestionConfig, themeConfig } = pGuild.settings.config.decidables;
                let configs = [pollConfig, giveawayConfig, suggestionConfig, themeConfig].filter(config => config.firstTimeExecuted === false);
                let decidables = configs.map(config => config.polls || config.giveaways || config.suggestions || config.themes);

                await Promise.all(decidables.map(async d => {
                    if (!d.endsAt || new Date(d.endsAt).getTime() < Date.now() || d.approved != undefined) return null;
                    let channel = ToTextChannel(guild.channels.cache.get(d.channel._id));

                    return channel.messages.fetch(d._id, false, true)
                        .then(() => OnFulfilled(d.constructor.name, d.value, d._id, channel, guild))
                        .catch(err => OnError(d.constructor.name, d.value, d._id, channel, guild, err.message));
                }))
            }

            /**
             * @param {GuildChannel} guildChannel
             * @returns {TextChannel}*/
            function ToTextChannel(guildChannel) {
                return guildChannel.isText() && guildChannel;
            }
            /**
             * @param {DecidablesTypes} type
             * @param {string} id
             * @param {string} value
             * @param {TextChannel} channel
             * @param {Guild} guild*/
            function OnFulfilled(type, value, id, channel, guild) {
                return console.log(`Cached ${type} "${value}" (${id}) from #${channel.name}, ${guild.name}`)
            }
            /**
             * @param {DecidablesTypes} type
             * @param {string} value
             * @param {string} id
             * @param {TextChannel} channel
             * @param {Guild} guild*/
            function OnError(type, value, id, channel, guild, errMsg) {
                if (errMsg == 'Missing Access') return;
                return client.log('console', `Unable to cache ${type} "${value}" (${id}) from #${channel.name}, ${guild.name} -- ${errMsg}`, 'error')
            }
        }
        async function UpdateGuilds() {
            const pUsers = client.pUsers.array();

            for (var [id, guild] of client.guilds.cache) {
                const { name } = guild;

                const pGuild = client.pGuilds.get(guild);
                if (pGuild.name != name) {
                    pGuild.name = name;
                    await client.pGuilds.update(pGuild, module.exports.name, "Name was not up to date.")
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

                        if (!client.pGuildMembers.get(guild).has(member)) {
                            await client.pGuildMembers.get(guild).add(member, module.exports.name, `Member was not in client.pGuildMembers`);
                        }
                    }
                    client.pGuilds.update(pGuild, module.exports.name, "members.guild.name was not up to date.");
                }

                //Filter out the users that share the current guild and the name is incorrect
                const pUsersInGuild = pUsers.filter(pUser => pUser.sharedServers.filter(pg => pg._id == id && pg.name != name));
                if (!pUsersInGuild.length) continue;

                for (var pUser of pUsersInGuild) {
                    const { sharedServers } = pUser;
                    const pg = sharedServers.find(pg => pg._id == id);
                    const indexOfPG = sharedServers.indexOf(pg);
                    pUser.sharedServers[indexOfPG] = new PGuild(guild);
                    client.pUsers.update(pUser, module.exports.name, `Name of **${name}** was not updated`);
                }
            }
        }
    }
)