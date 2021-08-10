"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleDecidables = void 0;
const discord_js_1 = require("discord.js");
const ms = require("ms");
const config_1 = require("./config");
const items_1 = require("./items");
const PRole_1 = require("../database/json/PRole");
const PChannel_1 = require("../database/json/PChannel");
const PGuildMember_1 = require("../database/json/PGuildMember");
const achievements_1 = require("../pingu/achievements");
const TimeLeftObject_1 = require("../helpers/TimeLeftObject");
function SetConfigObjects(config) {
    const { giveawayConfig, pollConfig, suggestionConfig, themeConfig } = config;
    const giveawayObj = {
        constructor: items_1.Giveaway,
        firstTimeExecuted: giveawayConfig.firstTimeExecuted,
        channel: giveawayConfig.channel,
        hostRole: giveawayConfig.hostRole,
        winnerRole: giveawayConfig.winnerRole,
        collection: giveawayConfig.giveaways,
        allowSameWinner: giveawayConfig.allowSameWinner,
        staffRoleType: 'Giveaway Host'
    };
    const pollObj = {
        constructor: items_1.Poll,
        firstTimeExecuted: pollConfig.firstTimeExecuted,
        channel: pollConfig.channel,
        hostRole: pollConfig.pollRole,
        collection: pollConfig.polls,
        staffRoleType: 'Poll Host'
    };
    const suggestionsObj = {
        constructor: items_1.Suggestion,
        firstTimeExecuted: suggestionConfig.firstTimeExecuted,
        channel: suggestionConfig.channel,
        hostRole: suggestionConfig.managerRole,
        collection: suggestionConfig.suggestions,
        staffRoleType: 'Suggestion Manager'
    };
    const themeMap = {
        constructor: items_1.Theme,
        firstTimeExecuted: themeConfig.firstTimeExecuted,
        channel: themeConfig.channel,
        winnerRole: themeConfig.winnerRole,
        hostRole: themeConfig.hostRole,
        collection: themeConfig.themes,
        allowSameWinner: themeConfig.allowSameWinner,
        ignoreLastWins: themeConfig.ignoreLastWins,
        staffRoleType: 'Theme Host'
    };
    return Configs = new Map([
        [giveawayConfig, giveawayObj],
        [pollConfig, pollObj],
        [suggestionConfig, suggestionsObj],
        [themeConfig, themeMap]
    ]);
}
let Configs;
function HandleDecidables(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { client, message, args, pGuild, pGuildClient, decidablesType, config, reactionEmojis } = params;
        const { guild, author, content, mentions, member } = message;
        const { firstTimeExecuted, channel } = config;
        const reroll = ['Giveaway', 'Theme'].includes(decidablesType) && args[0] == 'reroll';
        //A decidables command must have a Pingu Guild registered
        if (!pGuild) {
            yield client.log('error', `Unable to host ${decidablesType.toLowerCase()} for ${guild}, as I couldn't get their PinguGuild!`);
            return message.channel.send(`I couldn't get your PinguGuild, so I can't host the ${decidablesType.toLowerCase()} for you!`);
        }
        const decidablesConfig = pGuild.settings.config.decidables;
        SetConfigObjects(decidablesConfig);
        let permCheck = yield PermissionCheckDecidable(params);
        if (permCheck != client.permissions.PermissionGranted)
            return message.channel.send(permCheck);
        //Is user trying to host?
        if (firstTimeExecuted || args[0] == 'setup')
            return FirstTimeExecuted(params);
        else if (args[0] == 'list')
            return ListDecidables(params, Configs.get(config).collection);
        if (decidablesType != 'Suggestion') {
            var time = args[0];
            var winners = 1;
            if (!reroll)
                args.shift();
            if (isGiveawayType(decidablesType)) {
                if (args[0].endsWith('w') && !isNaN(parseInt(args[0]))) {
                    winners = parseInt(args.shift());
                }
            }
        }
        let decidablesChannel = guild.channels.cache.find(c => [c.id, c.name].includes(args[0]) || c == mentions.channels.first());
        if (decidablesChannel)
            args.shift();
        else
            decidablesChannel = (args[0] != 'reroll' ? guild.channels.cache.get(channel === null || channel === void 0 ? void 0 : channel._id) || message.channel : message.channel);
        const users = new Map([[author, ['VIEW_CHANNEL']], [client.user, ['SEND_MESSAGES', 'ADD_REACTIONS']]]);
        for (const [u, perms] of users) {
            let channelPerms = client.permissions.checkFor({ author: u, channel: decidablesChannel }, ...perms);
            if (channelPerms != client.permissions.PermissionGranted)
                return message.channel.send(channelPerms);
        }
        let value = args.join(' ');
        const mention = mentions.users.first();
        if (value.includes('<@'))
            value = value.replace(/<@!*\d{18}>/, guild.member(mention) ? guild.member(mention).displayName : mention.username);
        if ('Suggestion' != decidablesType)
            var endsAt = new Date(Date.now() + ms(time) + ms('1s'));
        let embed = new discord_js_1.MessageEmbed({
            title: 'Suggestion' == decidablesType ? 'Suggestion' : value,
            color: pGuildClient.embedColor,
            description: isGiveawayType(decidablesType) ? (`**React with ${reactionEmojis[0]} to enter!**\n` +
                `Winners: **${winners}**\n` +
                `Ends in: ${new TimeLeftObject_1.default(new Date(), endsAt).toString()}\n` +
                `Hosted by ${author}`) : decidablesType == 'Poll' ? (`Brought to you by ${author}\n` +
                `Time left: ${new TimeLeftObject_1.default(new Date(), endsAt).toString()}`) : value,
            footer: { text: decidablesType == 'Suggestion' ? `This suggestion is currently Undecided` : `Ends at` },
            timestamp: decidablesType != 'Suggestion' ? endsAt : null
        });
        if (reroll) {
            let sent = yield message.channel.send(`Rerolling ${decidablesType.toLowerCase()}...`);
            return Reroll(params, sent, Configs.get(config).collection.find(d => d._id == value.split(' ')[1]));
        }
        else if (message.channel.id == decidablesChannel.id &&
            client.permissions.checkFor({ author: client.user, channel: decidablesChannel }, 'MANAGE_MESSAGES') == client.permissions.PermissionGranted)
            message.delete();
        else
            message.channel.send(`Announcing the ${decidablesType.toLowerCase()} in ${decidablesChannel} now!`).then(s => s.delete({ timeout: ms('5s') }));
        const sent = yield message.channel.send(embed);
        reactionEmojis.forEach(e => sent.react(e));
        sent.createReactionCollector((r) => reactionEmojis.includes(r.emoji.name), { time: endsAt.getTime() }).on('collect', (r, u) => client.log('console', `**${u.tag}** ${isGiveawayType(decidablesType) ?
            `entered ${decidablesType.toLowerCase()}` :
            `voted **${'👍' == r.emoji.name ? 'Yes' : 'No'}**`}`));
        client.log('console', `**${author.tag}** (${author.id}) hosted ${decidablesType} in ${decidablesChannel} (${decidablesChannel.name}), ${guild}`);
        let decidable = new (Configs.get(config).constructor)(value, sent.id, new PGuildMember_1.default(member), decidablesChannel, endsAt);
        AddDecidableToPGuilds(params, decidable);
        if (decidablesType == 'Suggestion')
            return sent;
        let interval = setInterval(function updateTimer() {
            sent.edit(sent.embeds[0].setDescription(isGiveawayType(decidablesType) ? (`**React with ${reactionEmojis[0]} to enter!**\n` +
                `Winners: **${winners}**\n` +
                `Ends in: ${new TimeLeftObject_1.default(new Date(), endsAt).toString()}.\n` +
                `Hosted by <@${decidable.author._id}>`) : decidablesType == 'Poll' ? (`Brought to you by <@${decidable.author._id}>\n` +
                `Time left: ${new TimeLeftObject_1.default(new Date(), endsAt).toString()}.`) : sent.embeds[0].description)).catch(err => {
                client.log('error', `Updating ${decidablesType.toLowerCase()} timer`, content, err);
                author.send(`I had an issue updating the ${decidablesType.toLowerCase()} message, so your ${decidablesType.toLowerCase()} might be broken!`);
            });
        }, ms('5s'));
        setTimeout(() => onTimeFinished(sent, value, winners, embed, decidable, interval, params, []), ms(time));
    });
}
exports.HandleDecidables = HandleDecidables;
function PermissionCheckDecidable(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { client, message, config, args, decidablesType, pGuild } = params;
        const { firstTimeExecuted } = config;
        const { PermissionGranted } = client.permissions;
        let { hostRole } = Configs.get(config);
        //If executed for the first time or a sub command is used, no need to validate if args are okay
        if (firstTimeExecuted || ["reroll", "setup", "list"].includes(args[0]))
            return PermissionGranted;
        //!args[0] && !args[1]: [time, ...title]
        else if (args.length < 2)
            return `You didn't give me enough arguments!`;
        yield (function CheckRoleUpdates() {
            return __awaiter(this, void 0, void 0, function* () {
                let hostPRole = Configs.get(config).hostRole;
                let winnerPRole = Configs.get(config).winnerRole;
                const CheckRole = (pRole) => pRole && message.guild.roles.fetch(pRole._id);
                const [hostRole, winnerRole] = yield Promise.all([
                    CheckRole(hostPRole),
                    CheckRole(winnerPRole)
                ]);
                const noWinnerRole = !winnerRole && !winnerPRole;
                const noHostRole = !hostRole && !hostPRole;
                const winnerNameChanged = !noWinnerRole && winnerRole.name != winnerPRole.name;
                const hostNameChanged = !noHostRole && hostRole.name != hostPRole.name;
                //Any condition is true
                if ([noWinnerRole, noHostRole, winnerNameChanged, hostNameChanged].some(v => v)) {
                    yield UpdatePGuild(client, pGuild, decidablesType, `${decidablesType} role${decidablesType == 'Giveaway' ? 's' : ''} updated.`);
                }
            });
        })();
        if (decidablesType == 'Suggestion')
            return PermissionGranted;
        const { member } = message;
        //Not admin nor have host role
        if (!member.hasPermission('ADMINISTRATOR') && hostRole && !member.roles.cache.has(hostRole._id)) {
            return "You don't have `Administrator` permissions" + (hostRole ? ` or the \`${hostRole.name}\` role` : "" + "!");
        }
        const arg0 = args[0];
        const arg0Parsed = parseInt(arg0.substring(0, arg0.length - 1));
        //Winner specified
        if (decidablesType == 'Giveaway' && arg0.endsWith('w') && !isNaN(arg0Parsed)) {
            args.shift();
        }
        else if (arg0.endsWith('s') && arg0Parsed < 30)
            return `Please specify a time higher than 29s!`;
        else if (!ms(arg0))
            return `Please provide a valid time!`;
        else if (arg0.length == arg0Parsed.toString().length)
            args[0] += "m"; //No s/m/h provided, treat as minutes
        return PermissionGranted;
    });
}
function FirstTimeExecuted(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { client, args, message, decidablesType, pGuild, config } = params;
        if (args[0] != 'setup')
            message.channel.send(`**Hold on fella!**\nWe need to get ${message.guild.name} set up first!`);
        const hasAllArguments = yield HasAllArguments();
        if (hasAllArguments)
            return;
        const collector = message.channel.createMessageCollector(m => m.author.id == message.author.id);
        let decidablesChannelName = decidablesType.toLowerCase();
        const { staffRoleType } = Configs.get(config);
        message.channel.send(`Firstly, ${Find('Role', staffRoleType, 'Exists', message)}`);
        collector.on('collect', function onCollect(input) {
            return __asyncGenerator(this, arguments, function* onCollect_1() {
                const userInput = input;
                //hostRole Tag
                yield yield __await(message.channel.send(Find('Role', staffRoleType, 'Tag', userInput)));
                //hostRole Find
                let staffRoleResult = Find('Role', staffRoleType, 'Find', userInput);
                let staffRole = NullMakeValue('Role', staffRoleResult);
                //winnerRole Exists
                if (['Giveaway', 'Theme'].includes(decidablesType)) {
                    yield yield __await(message.channel.send(Find('Role', `${decidablesType} Winner`, 'Exists', userInput)));
                    //winnerRole Find
                    let winnerRoleResult = Find('Role', `${decidablesType} Winner`, 'Find', userInput);
                    var winnerRole = NullMakeValue('Role', winnerRoleResult);
                }
                //channel Tag
                yield yield __await(message.channel.send(Find('Channel', decidablesChannelName, 'Exists', userInput)));
                //channel Find
                let channelResult = Find('Channel', decidablesChannelName, 'Find', userInput);
                let channel = NullMakeValue('Channel', channelResult);
                //Poll & Suggestion finished
                let goodToGo = { staffRole, channel };
                if (!['Giveaway', 'Theme'].includes(decidablesType))
                    return yield __await(GoodToGo(goodToGo));
                //allowSameWinner Ask
                yield yield __await(message.channel.send(`Alright last thing, should I allow same winners? (A user winning a ${decidablesType.toLowerCase()} can't win the next one, if you say no!)`));
                //allowSameWinner Process
                let allowSameWinner = userInput.content.toLowerCase() == 'yes';
                //Giveaway finished
                if ('Giveaway' == decidablesType)
                    return yield __await(GoodToGo(goodToGo = Object.assign(Object.assign({}, goodToGo), { winnerRole, allowSameWinner })));
                //ignoreLastWins ask
                yield yield __await(message.channel.send(`Okay last thing I promise- how many previous ${decidablesType.toLowerCase()}s' winners should I ignore?` +
                    `(If set to 2, the winners for the last 2 ${decidablesType.toLowerCase()}s will not be able to win the current one.) Default is 0`));
                //Theme finished
                return yield __await(GoodToGo(Object.assign(Object.assign({}, goodToGo), { ignoreLastWins: parseInt(userInput.content.toLowerCase()) || 0 })));
            });
        });
        collector.on('end', () => __awaiter(this, void 0, void 0, function* () {
            message.channel.send(`Alright, you're all set!`);
            client.log('console', `"${message.guild.name}" successfully configured their ${decidablesType}Config.`);
            if (args[0] != 'setup')
                return HandleDecidables(params);
        }));
        function HasAllArguments() {
            return __awaiter(this, void 0, void 0, function* () {
                //   0        1         2            2        3        3       4         4         5           5
                //[setup, staffRole, channel || winnerRole, null || channel, null || sameWinner, null || ignoreLastWins]
                if (decidablesType == 'Giveaway' && args.length != 5)
                    return false; //Not enough arguments
                if (decidablesType == 'Theme' && args.length != 6)
                    return false; //Not enough arguments
                class T {
                }
                let find = (i, arg) => [i.id, i.name.toLowerCase(), i.toString().toLowerCase()].includes(arg) && i;
                let findRole = (argument) => argument == 'null' ? null : message.guild.roles.cache.find(r => find(r, argument) != null);
                let findChannel = (argument) => argument == 'null' ? null : message.guild.channels.cache.find(c => find(c, argument) && c.isText());
                let staffRole = findRole(args[1]);
                let channel = findChannel(args[decidablesType != 'Giveaway' && decidablesType != 'Theme' ? 2 : 3]);
                if (['Giveaway', 'Theme'].includes(decidablesType)) {
                    yield GoodToGo({
                        staffRole, channel,
                        winnerRole: findRole(args[2]),
                        allowSameWinner: ['yes', 'true'].includes(args[4].toLowerCase()),
                        ignoreLastWins: decidablesType == 'Theme' && !isNaN(parseInt(args[5])) ? parseInt(args[5]) : 0
                    });
                }
                else
                    yield GoodToGo({ staffRole, channel });
                message.channel.send("Setup done!");
                return true;
            });
        }
        function GoodToGo(params) {
            return __awaiter(this, void 0, void 0, function* () {
                let { channel, staffRole, allowSameWinner, winnerRole, ignoreLastWins } = params;
                const decidablesConfig = pGuild.settings.config.decidables;
                if (typeof staffRole == 'string' && staffRole == 'make')
                    staffRole = yield MakeRole(message.guild, staffRoleType);
                if (typeof channel == 'string' && channel == 'Make')
                    channel = yield MakeChannel(message.guild, decidablesChannelName);
                if (winnerRole && typeof winnerRole == 'string' && winnerRole == 'Make')
                    winnerRole = yield MakeRole(message.guild, "Giveaway Winner");
                const _firstTimeExecuted = false;
                const _channel = channel && channel != 'null' ? new PChannel_1.default(channel) : null;
                const _staffRole = staffRole && staffRole != 'null' ? new PRole_1.default(staffRole) : null;
                const _winnerRole = winnerRole && winnerRole != 'null' ? new PRole_1.default(winnerRole) : null;
                const basic = {
                    firstTimeExecuted: _firstTimeExecuted,
                    channel: _channel
                };
                const result = (function assignConfig() {
                    switch (decidablesType) {
                        case 'Giveaway': return decidablesConfig.giveawayConfig = new config_1.GiveawayConfig(Object.assign(Object.assign({}, basic), { hostRole: _staffRole, winnerRole: _winnerRole, giveaways: [], allowSameWinner }));
                        case 'Poll': return decidablesConfig.pollConfig = new config_1.PollConfig(Object.assign(Object.assign({}, basic), { pollRole: _staffRole, polls: [] }));
                        case 'Suggestion': return decidablesConfig.suggestionConfig = new config_1.SuggestionConfig(Object.assign(Object.assign({}, basic), { managerRole: _staffRole, suggestions: [] }));
                        case 'Theme': return decidablesConfig.themeConfig = new config_1.ThemeConfig(Object.assign(Object.assign({}, basic), { hostRole: _staffRole, winnerRole: _winnerRole, themes: [], allowSameWinner, ignoreLastWins }));
                    }
                })();
                yield UpdatePGuild(client, pGuild, decidablesType, `**${pGuild.name}**'s ${decidablesType}Config after setting it up.`);
                collector.stop('Setup done');
                const { author, member, guild } = message;
                achievements_1.AchievementCheck(client, {
                    user: author,
                    guildMember: member,
                    guild
                }, 'CHANNEL', decidablesType, [message.channel]);
                return result;
                function MakeRole(guild, name) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return guild.roles.create({
                            data: { name },
                            reason: `Auto-created when setting up ${decidablesType.toLowerCase()}`
                        }).catch(err => {
                            client.log('error', `Creating ${name} role`, message.content, err);
                            return null;
                        });
                    });
                }
                function MakeChannel(guild, name) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return guild.channels.create(name, {
                            reason: `Auto-created when setting up ${decidablesType.toLowerCase()}`
                        }).catch(err => {
                            client.log('error', `Creating ${name} channel`, message.content, err);
                            return null;
                        });
                    });
                }
            });
        }
        /***@returns Response to 'Exists' & 'Create', but returns id of type || "Make" || "undefined" as final result*/
        function Find(type, typeName, pinguResponse, userInput) {
            let response = userInput.content.toLowerCase();
            let typeResult = null;
            switch (pinguResponse) {
                case 'Exists': return `Do you have a **${typeName}** ${type.toLowerCase()}?`;
                case 'Tag': return response == 'yes' ?
                    `Please tag the ${type.toLowerCase()} or send the ${type.toLowerCase()} ID` :
                    response == 'no' ?
                        `Would you like a **${typeName}** ${type.toLowerCase()}?` :
                        null;
                case 'Find':
                    typeResult = type == 'Role' ?
                        (message.guild.roles.cache.find(r => [r.id, r.name.toLowerCase()].includes(response)) || userInput.mentions.roles.first()) :
                        (message.guild.channels.cache.find(c => [c.id, c.name.toLowerCase()].includes(response)) || userInput.mentions.channels.first());
                    if (typeResult)
                        message.channel.send(`Okay, I found ${typeResult.name}`);
                    else if (response == 'yes') {
                        typeResult = 'Make';
                        message.channel.send(`Okay, I'll make that...`);
                    }
                    else if (response == 'no') {
                        typeResult = 'undefined';
                        message.channel.send(`Okay, I won't make that...`);
                    }
                    return typeResult.id;
            }
        }
        function NullMakeValue(type, result) {
            return !['null', 'Make'].includes(result) ? message.guild[`${type.toLowerCase()}s`].cache.get(result) : result;
        }
    });
}
function onTimeFinished(sent, value, winnersAllowed, embed, decidable, interval, params, previousWinners) {
    return __awaiter(this, void 0, void 0, function* () {
        clearInterval(interval);
        const { decidablesType, client, reactionEmojis } = params;
        decidable = yield (decidablesType == 'Poll' ?
            DecidePoll(decidable) :
            GetGiveawayWinner(decidablesType == 'Giveaway' ? decidable : decidable));
        SaveVerdictToPGuilds(params, decidable);
        client.log('console', `Updated **${decidable.author.name}**'s ${decidablesType.toLowerCase()} "**${decidable.value}**" (${decidable._id}) after timeout.`);
        function DecidePoll(poll) {
            return __awaiter(this, void 0, void 0, function* () {
                const { get } = sent.reactions.cache;
                poll = items_1.Poll.Decide(poll, get('👍').count, get('👎').count);
                sent.channel.send(`The poll of **${poll.value}**, voted **${poll.approved}**!`);
                client.log('console', `Poll, "${poll.value}" (${poll._id}) by ${poll.author.name}, voted ${poll.approved}.`);
                sent.edit(embed
                    .setTitle(`FINISHED! ${poll.value}`)
                    .setDescription(`Voting done! Final answer: ${poll.approved}\n` +
                    `**ID:** \`${poll._id}\``)
                    .setFooter(`Poll ended.`));
                return poll;
            });
        }
        function GetGiveawayWinner(decidable) {
            return __awaiter(this, void 0, void 0, function* () {
                const host = sent.guild.member(decidable.author._id);
                const { config, message } = params;
                const { guild } = message;
                const { winnerRole, allowSameWinner } = config;
                let winners = new Array();
                let reactedUsers = yield sent.reactions.cache.get(reactionEmojis[0]).users.fetch().catch(err => {
                    client.log('error', `Fetching ${reactionEmojis[0]} reaction from ${decidablesType.toLowerCase()}`, sent.content, err);
                    host.createDM().then(dm => dm.send(`Hi! I ran into an issue while finding a winner for your ${decidablesType.toLowerCase()} "${value}"... I've already contacted my developers!`).catch(err => null));
                    return null;
                });
                let members = yield guild.members.fetch({ user: reactedUsers.array() });
                const winnerOrWinners = `Winner${winnersAllowed > 1 ? 's' : ''}`;
                reactedUsers = reactedUsers.filter(u => {
                    if (u.bot)
                        return false;
                    const winnerRoleExists = winnerRole && true;
                    const userIsntWinner = winnerRole && !members.get(u.id).roles.cache.has(winnerRole._id);
                    const isTheme = decidablesType == 'Theme';
                    const themeConfig = isTheme && Configs.get(config);
                    const userIsntInPreviousWinners = themeConfig && themeConfig.collection
                        .filter((_, i, col) => col.length - i < themeConfig.ignoreLastWins)
                        .map(col => col.winners)
                        .some((_, __, col) => !col.reduce((arr, winners) => arr.concat(winners.map(pgm => pgm._id)), new Array()).includes(u.id));
                    return (allowSameWinner || winnerRoleExists && userIsntWinner) && isTheme ? userIsntInPreviousWinners : true;
                });
                const previousWinnersIds = previousWinners.map(gm => gm.id);
                const reactedUsersNoPreviousWinners = () => reactedUsers.filter((_, id) => previousWinnersIds.includes(id)).size > 0;
                for (let i = 0; i < winnersAllowed; i++) {
                    var winner = getWinner();
                    while (!winner || typeof winner != 'string' && previousWinnersIds.includes(winner.id)) {
                        if (reactedUsersNoPreviousWinners())
                            winner = getWinner();
                        else
                            break;
                    }
                    if (typeof winner == 'string') {
                        winner = 'no one';
                        winners[i] = winner;
                    }
                    else {
                        winners[i] = guild.member(winner);
                        reactedUsers.delete(winner.id);
                    }
                }
                if (winner == 'no one' && !winners.length || !winners[0]) {
                    sent.edit(embed
                        .setTitle(`Unable to find a winner for "${value}"!`)
                        .setDescription(getGiveawayDescription(winnerOrWinners, `__Winner not found!__`, host, decidable))
                        .setFooter(`${decidablesType} ended.`));
                    sent.channel.send(`A winner to "**${value}**" couldn't be found!`);
                    return decidable;
                }
                if (winners.length > 1) {
                    const lastWinner = winners.splice(winners.length - 1);
                    var winnersString = `${winners.join(', ')} & ${lastWinner}`;
                }
                else
                    winnersString = winners[0].toString();
                let announceMessage = yield sent.channel.send(`The ${winnerOrWinners.toLowerCase()} of **${value}**, hosted by ${host}, is no other than ${winnersString}! Congratulations!`);
                announceMessage.react(client.emotes.guild(client.savedServers.get('Pingu Support')).get('hypers'));
                if (winnerRole) {
                    RemovePreviousWinners(guild.members.cache.filter(m => m.roles.cache.has(winnerRole._id)).array());
                    for (let i = 0; i < winners.length; i++) {
                        yield guild.member(winners[i]).roles.add(winnerRole._id)
                            .catch(err => {
                            client.log('error', `Unable to give ${winners[i]} a ${decidablesType} "${guild}"'s ${decidablesType} Winner role, ${winnerRole.name} (${winnerRole._id})`, sent.content, err);
                            host.user.send(`I couldn't give ${winners[i]} a ${decidablesType} Winner role!`);
                        });
                    }
                }
                sent.edit(embed
                    .setTitle(`${winnerOrWinners} of "${value}"!`)
                    .setDescription(getGiveawayDescription(winnerOrWinners, winnersString, host, decidable))
                    .setFooter(`${decidablesType} ended.`)).catch(err => {
                    client.log('error', `Editing the ${decidablesType} Message`, sent.content, err);
                    host.user.send(`I encountered an error while updating the ${decidablesType.toLowerCase()} embed...`);
                });
                yield UpdatePGuildWinners();
                return decidable;
                function getWinner() {
                    let winner = (function selectWinner() {
                        if (!reactedUsers.size)
                            return `A winner couldn't be found!`;
                        let winner = reactedUsers.array()[Math.floor(Math.random() * reactedUsers.size)];
                        if (!winnerRole)
                            return winner;
                        else if (guild.member(winner).roles.cache.has(winnerRole._id))
                            return allowSameWinner ? winner : null;
                        return winner;
                    })();
                    if (typeof winner == 'string')
                        return winner;
                    return winners.includes(guild.member(winner)) ? null : winner;
                }
                function RemovePreviousWinners(previousWinners) {
                    for (const winner of previousWinners) {
                        winner.roles.remove(winnerRole._id);
                    }
                }
                function UpdatePGuildWinners() {
                    return __awaiter(this, void 0, void 0, function* () {
                        for (const winner of winners) {
                            if (typeof winner != 'string')
                                decidable.winners.push(new PGuildMember_1.default(guild.member(winner)));
                        }
                    });
                }
            });
        }
    });
}
function getGiveawayDescription(winnerOrWinners, winners, host, decidable) {
    return (`**${winnerOrWinners}:** ${winners}\n` +
        `**Host:** ${host}\n` +
        `**ID:** \`${decidable._id}\``);
}
function ListDecidables(params, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        const { pGuild, decidablesType, message, client, pGuildClient } = params;
        const listEmojis = ['⬅️', '🗑️', '➡️', '🛑'];
        let embeds = CreateEmbeds(false), embedIndex = 0;
        if (!decidablesType.length || !embeds.length)
            return message.channel.send(`There are no ${decidablesType.toLowerCase()}s saved!`);
        var sent = yield message.channel.send(embeds[embedIndex]);
        listEmojis.forEach(e => sent.react(e));
        const collector = sent.createReactionCollector((r, u) => listEmojis.includes(r.emoji.name) && u.id == message.author.id, { time: ms('20s') });
        collector.on('end', (collected) => __awaiter(this, void 0, void 0, function* () {
            if (!collected.map(r => r.emoji.name).includes('🛑')) {
                yield sent.delete();
                message.channel.send(`Stopped showing ${decidablesType.toLowerCase()}s.`).then(s => s.delete({ timeout: ms('5s') }));
            }
        }));
        collector.on('collect', (reaction) => __awaiter(this, void 0, void 0, function* () {
            const getEmbedDecidable = (embed) => collection.find(d => {
                const sentences = embed.description.split('\n');
                const idSentence = sentences[sentences.length - 1];
                const id = idSentence.split(' ')[1];
                return d._id == id;
            });
            const onArrowLeft = () => __awaiter(this, void 0, void 0, function* () { return direction(-1); });
            const onBin = () => __awaiter(this, void 0, void 0, function* () { return direction(0); });
            const onArrowRight = () => __awaiter(this, void 0, void 0, function* () { return direction(1); });
            const onStop = () => __awaiter(this, void 0, void 0, function* () { return collector.stop('Requested by author'); });
            collector.resetTimer();
            let embedToSend = yield (function HandleEmojiName() {
                return __awaiter(this, void 0, void 0, function* () {
                    switch (reaction.emoji.name) {
                        case '⬅️': return onArrowLeft();
                        case '👍':
                        case '👎': return onVerdict(reaction.emoji.name == '👍');
                        case '🗑️': return onBin();
                        case '➡️': return onArrowRight();
                        case '🛑': return onStop();
                        default: return onDefault();
                    }
                });
            })();
            if (!collection.length || !embedToSend) {
                message.channel.send(`No more ${decidablesType.toLowerCase()}s saved!`);
                return onStop();
            }
            sent.edit(embedToSend);
            sent.reactions.cache.get(reaction.emoji.name).users.remove(message.author);
            function onVerdict(approved) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (decidablesType != 'Suggestion')
                        return embeds[embedIndex];
                    collection = yield Decide(params, approved, getEmbedDecidable(embeds[embedIndex]), message.member);
                    CreateEmbeds(true);
                    return direction(1);
                });
            }
            function onDefault() {
                return __awaiter(this, void 0, void 0, function* () {
                    client.log('error', `${decidablesType.toLowerCase()}, ListDecidables(), collector.on(), default case: ${reaction.emoji.name}`, message.content);
                    return reaction.message.embeds[0];
                });
            }
            function direction(i) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!embeds)
                        return null;
                    embedIndex += i;
                    if (embedIndex <= 1) {
                        embedIndex = embeds.length - 1;
                        i = -1;
                    }
                    else if (embedIndex >= embeds.length) {
                        embedIndex = 0;
                        i = 1;
                    }
                    return i == 0 ? DeleteDecidable(embeds[embedIndex]) : embeds[embedIndex];
                });
            }
            function DeleteDecidable(embed) {
                return __awaiter(this, void 0, void 0, function* () {
                    let decidable = getEmbedDecidable(embed);
                    collection = yield RemoveDecidables(message, pGuild, decidablesType, [decidable]);
                    embeds = CreateEmbeds(true);
                    return !collection.includes(decidable) ?
                        ExpressDeletionSuccessful('✅', 1) :
                        ExpressDeletionSuccessful('❌', -1);
                    function ExpressDeletionSuccessful(emote, index) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const reaction = yield sent.react(emote);
                            yield new Promise(resolve => setTimeout(() => resolve(sent.reactions.cache.get(reaction.emoji.id).remove()), 1500));
                            return direction(index);
                        });
                    }
                });
            }
        }));
        function CreateEmbeds(autoCalled) {
            if (!collection.length)
                return null;
            let embeds = new Array(), toRemove = new Array();
            const createGiveawayEmbed = (g) => new discord_js_1.MessageEmbed({
                description: [
                    `**__Winner${g.winners.length > 1 ? 's' : ''}__**`,
                    g.winners.map(pg => `<@${pg._id}>`).join(', '), "",
                    `**Hosted by <@${g.author._id}>**`, "",
                    `**ID:** \`${g._id}\``
                ].join('\n')
            });
            const createPollEmbed = (p) => new discord_js_1.MessageEmbed({
                description: [
                    `**Verdict:** ${p.approved == 'Approved' ? '👍' : p.approved == 'Denied' ? '👎' : '🤷‍♂️'}\n`,
                    `**Hosted by <@${p.author._id}>**\n`,
                    `**ID:** \`${p._id}\``
                ].join('\n')
            });
            const createSuggestionEmbed = (s) => new discord_js_1.MessageEmbed({
                description: [
                    `**Verdict:** ${s.approved == 'Approved' ? '👍' : s.approved == 'Denied' ? '👎' : '🤷‍♂️'}\n`,
                    `**Suggested by <@${s.author._id}>**\n`,
                    s.approved != 'Undecided' ? `**Decided by <@${s.decidedBy._id}>**` : "",
                    `ID: ${s._id}`
                ].join('\n')
            });
            const createDecidableEmbed = new Map([
                ['Giveaway', createGiveawayEmbed],
                ['Poll', createPollEmbed],
                ['Suggestion', createSuggestionEmbed],
                ['Theme', createGiveawayEmbed]
            ]);
            for (let i = 0; i < collection.length; i++) {
                try {
                    embeds.push(createDecidableEmbed.get(decidablesType)(collection[i])
                        .setColor(pGuildClient.embedColor)
                        .setFooter(`Now viewing: ${i + 1}/${collection.length}`));
                }
                catch (err) {
                    client.log('error', `Error while adding ${decidablesType.toLowerCase()} to embeds`, message.content, err);
                    toRemove.push(collection[i]);
                }
            }
            RemoveDecidables(message, pGuild, decidablesType, toRemove);
            if (!embeds && !autoCalled)
                return null;
            return embeds;
        }
    });
}
function Decide(params, approved, suggestion, decidedBy) {
    return __awaiter(this, void 0, void 0, function* () {
        suggestion = items_1.Suggestion.Decide(suggestion, approved, new PGuildMember_1.default(decidedBy));
        (function UpdateSuggestionEmbed() {
            return __awaiter(this, void 0, void 0, function* () {
                const channel = decidedBy.guild.channels.cache.get(suggestion.channel._id);
                const message = yield channel.messages.fetch(suggestion._id);
                return message.embeds[0].setFooter(`Suggestion was ${approved} by ${decidedBy}`);
            });
        })();
        return SaveVerdictToPGuilds(params, suggestion);
    });
}
function SaveVerdictToPGuilds(params, decidable) {
    return __awaiter(this, void 0, void 0, function* () {
        let { pGuild, client, decidablesType, config, message } = params;
        const { collection } = Configs.get(config);
        const itemIndex = collection.findIndex(d => d._id == decidable._id);
        collection[itemIndex] = decidable;
        UpdatePGuild(client, pGuild, decidablesType, `Saved verdict for "${decidable.value}" to ${message.guild.name}'s PinguGuild.`);
        return collection;
    });
}
function RemoveDecidables(message, pGuild, type, decidables) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!decidables || !decidables.length || !decidables[0])
            return;
        const { client, guild } = message;
        const decidablesConfig = pGuild.settings.config.decidables;
        const decidableConfig = decidablesConfig[`${type.toLowerCase()}Config`];
        const logs = new Array();
        for (const d of decidables) {
            const { collection } = Configs.get(decidableConfig);
            collection.splice(collection.indexOf(d), 1);
            logs.push(`The ${type}, ${d.value} (${d._id}) was removed.`);
        }
        if (logs.length)
            client.log('console', logs.join('\n'));
        yield UpdatePGuild(client, pGuild, type, `Removed ${logs.length} ${type.toLowerCase()}s from **${guild.name}**'s ${type} list.`);
        return Configs.get(decidableConfig).collection;
    });
}
function Reroll(params, sent, decidable) {
    return __awaiter(this, void 0, void 0, function* () {
        const { message, args, decidablesType, client } = params;
        const { guild, channel } = message;
        const id = args[1];
        if (!id)
            return sent.edit(`${decidablesType.toLowerCase()} message not found - please provide a message ID.`);
        let previousMessage = channel.messages.cache.get(id);
        if (!previousMessage) {
            previousMessage = channel.messages.cache.get(id.split('/')[6]);
            if (!previousMessage)
                return sent.edit(`Unable to parse ${id} as ID, or message can't be found!`);
            else if (!previousMessage.embeds[0])
                return sent.edit(`There's no embed in that message!`);
            else if (previousMessage.author.id != client.id)
                return sent.edit(`That isn't my message!`);
        }
        const previousWinners = yield Promise.all(decidable.winners.map(w => guild.members.fetch(w._id)));
        const embed = previousMessage.embeds[0];
        const winnerLength = (() => {
            const winnerLine = embed.description.split(':')[0];
            const [left, right] = winnerLine.split('&');
            const partOne = left.split(',');
            return [...partOne, right].length;
        })();
        return onTimeFinished(previousMessage, decidable.value, winnerLength || 1, embed, decidable, null, params, previousWinners);
    });
}
function AddDecidableToPGuilds(params, decidable) {
    return __awaiter(this, void 0, void 0, function* () {
        const { client, message, pGuild, decidablesType, config } = params;
        Configs.get(config).collection.push(decidable);
        return UpdatePGuild(client, pGuild, decidablesType, `New ${decidablesType.toLowerCase()} was added to **${message.guild.name}**`);
    });
}
function UpdatePGuild(client, pGuild, decidableType, reason) {
    return __awaiter(this, void 0, void 0, function* () {
        return client.pGuilds.update(pGuild, `HandleDecidables: ${decidableType}`, reason);
    });
}
function isGiveawayType(decidablesType) {
    return ['Giveaway', 'Theme'].includes(decidablesType);
}
exports.default = HandleDecidables;
