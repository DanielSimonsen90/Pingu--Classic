"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecidableCommand = void 0;
const discord_js_1 = require("discord.js");
const DecidableCommandProps_1 = require("./DecidableCommandProps");
const TimeSpan_1 = require("../helpers/TimeSpan");
const PinguCommand_1 = require("../pingu/handlers/Pingu/PinguCommand");
const json_1 = require("../database/json");
const config_1 = require("./config");
const items_1 = require("./items");
const DecidablesData_1 = require("./DecidablesData");
const DecidableCollection_1 = require("./DecidableCollection");
const Arguments_1 = require("../helpers/Arguments");
class DecidableCommand extends PinguCommand_1.default {
    static ValidateTime(input) {
        return TimeSpan_1.default.ms(input);
    }
    static ExecuteDecidables(cmd, params) {
        return cmd.handleDecdiables(params);
    }
    _configs;
    get _config() {
        return this._configs.get(this._data.config);
    }
    _data;
    _collector;
    _collection;
    async handleDecdiables(params) {
        this._data = new DecidablesData_1.default(params.executeProps);
        const { pGuild, client, replyReturn, type, lowerType, commandProps: { guild } } = this._data;
        //A decidables command must have a Pingu Guild registered
        if (!pGuild) {
            await client.log('error', `Unable to host ${lowerType} for ${guild}, as I couldn't get their PinguGuild!`);
            return replyReturn(`I couldn't get your PinguGuild, so I can't host the ${lowerType} for you!`);
        }
        const { replySemiPrivate } = this._data;
        const decidablesConfig = pGuild.settings.config.decidables;
        this._configs = (0, DecidableCommandProps_1.SetConfigObjects)(decidablesConfig);
        const permCheck = await this.permissionCheckDecidable();
        if (permCheck != client.permissions.PermissionGranted)
            return replySemiPrivate(permCheck);
        const { command, config, commandProps: { executor } } = this._data;
        const { firstTimeExecuted } = config;
        if (firstTimeExecuted || command == 'setup')
            return this.firstTimeExecuted();
        else if (command == 'list')
            return this.listDecidables();
        const reroll = this._data.isGiveawayType() && command == 'reroll';
        if (this._data.isTimable()) {
            var time = this._data.runOptions.time;
            if (this._data.isGiveawayType()) {
                var winners = this._data.runOptions.winners || 1;
                var decidablesChannel = (this._data.runOptions.channel || this._data.commandProps.channel);
            }
        }
        const users = new Map([
            [executor, ['VIEW_CHANNEL']],
            [client.user, ['SEND_MESSAGES', 'ADD_REACTIONS']]
        ]);
        for (const [u, perms] of users) {
            let channelPerms = client.permissions.checkFor({ member: guild.member(u), channel: decidablesChannel }, ...perms);
            if (channelPerms != client.permissions.PermissionGranted)
                return replyReturn(channelPerms);
        }
        let { value } = this._data.runOptions;
        const argsMentions = new Arguments_1.default(value).mentions;
        const mention = argsMentions.get('USER').argument();
        if (mention)
            value = value.replace(mention, guild.members.cache.get(argsMentions.get('SNOWFLAKE').argument()).displayName);
        if (reroll) {
            const sent = await replyReturn(`Rerolling ${type.toLowerCase()}...`);
            return this.reroll(sent);
        }
        const endsAt = new Date(Date.now() + TimeSpan_1.default.ms(time) + TimeSpan_1.default.ms('1s'));
        const { pGuildClient, reactions, replyPrivate } = this._data;
        const embed = new discord_js_1.MessageEmbed({
            title: this._data.is('Suggestion') ? 'Suggestion' : value,
            color: pGuildClient.embedColor,
            description: this._data.isGiveawayType() ? (`**React with ${reactions[0]} to enter!**\n` +
                `Winners: **${winners}**\n` +
                `Ends in: ${new TimeSpan_1.default(endsAt).toString()}\n` +
                `Hosted by ${executor}`) : this._data.is('Poll') ? (`Brought to you by ${executor}\n` +
                `Time left: ${new TimeSpan_1.default(endsAt).toString()}`) : value,
            footer: { text: this._data.is('Suggestion') ? `This suggestion is currently Undecided` : `Ends at` },
            timestamp: !this._data.is('Suggestion') ? endsAt : null
        });
        await replyPrivate(`Announcing the ${lowerType} in ${decidablesChannel} now!`);
        const sent = await decidablesChannel.sendEmbeds(embed);
        reactions.forEach(r => sent.react(r));
        sent.createReactionCollector({
            filter: (r, u) => reactions.includes(r.emoji.name) && !u.bot,
            time: endsAt && new TimeSpan_1.default(endsAt).date.getTime() || 0
        }).on('collect', (r, u) => client.log('console', `**${u.tag}** ${this._data.isGiveawayType() ?
            `entered ${lowerType}` :
            `voted **${'👍' == r.emoji.name ? 'Yes' : 'No'}**`}`));
        client.log('console', `**${executor.tag}** (${executor.id}) hosted ${type} in ${decidablesChannel} (${decidablesChannel.name}), ${guild}`);
        const decidable = new (this._config.constructor)(value, sent.id, new json_1.PGuildMember(guild.member(executor)), decidablesChannel, endsAt);
        this._addDecidableToPGuilds(decidable);
        if (this._data.is('Suggestion'))
            return sent;
        const interval = setInterval(() => {
            sent.editEmbeds(sent.embeds[0]
                .setDescription(this._data.isGiveawayType() ? (`**React with ${reactions[0]} to enter!**\n` +
                `Winners: **${winners}**\n` +
                `Ends in: ${new TimeSpan_1.default(endsAt).toString()}.\n` +
                `Hosted by <@${decidable.author._id}>`) : this._data.is('Poll') ? (`Brought to you by <@${decidable.author._id}>\n` +
                `Time left: ${new TimeSpan_1.default(endsAt).toString()}.`) : sent.embeds[0].description));
        }, TimeSpan_1.default.ms('5s'));
        setTimeout(() => this._onTimeFinished(sent, value, winners, embed, decidable, interval, []));
        return sent;
    }
    async _addDecidableToPGuilds(decidable) {
        this._config.collection.push(decidable);
        return this.updatePGuilds(`New ${this._data.lowerType} was added to **${this._data.commandProps.guild}**`);
    }
    async permissionCheckDecidable() {
        const { client, config, commandProps: { member }, executeProps } = this._data;
        const { PermissionGranted } = client.permissions;
        const { hostRole } = this._configs.get(config);
        if (!this._data.isGiveawayType()) {
            return PermissionGranted;
        }
        if (!member.permissions.has('ADMINISTRATOR') && hostRole && !member.roles.cache.has(hostRole._id)) {
            return "You don't have `Administrator` permissions" + (hostRole ? ` or the \`${hostRole.name}\` role` : "" + "!");
        }
        const { time } = this._data.runOptions;
        if (!time)
            return 'Please provide a valid time!';
        // const timeValue = parseInt(time.substring(0, time.length - 1))
        const timeValue = parseInt(time.clip(0, -1));
        if (time.endsWith('s') && timeValue < 30)
            return `Please specify a time higher than 29s!`;
        else if (time.length == timeValue.toString().length)
            this._data.runOptions.time += 'm'; //No s|m|h provided, treat as minutes
        return PermissionGranted;
    }
    async firstTimeExecuted() {
        const { command, replySemiPrivate, commandProps: { guild } } = this._data;
        if (command != 'setup')
            replySemiPrivate(`**Hold on fella!**\nWe need to get ${guild} set up first!`);
        const hasAllArguments = await this._checkAllArguments();
        if (hasAllArguments)
            return hasAllArguments;
        const { type, commandProps, config, replyReturn } = this._data;
        const { channel: executedFrom, executor } = commandProps;
        this._collector = executedFrom.createMessageCollector({ filter: m => m.author.id == executor.id });
        const lowerType = type.toLowerCase();
        const { staffRoleType } = this._configs.get(config);
        replyReturn(`Firstly, ${this._find('Role', staffRoleType, 'Exists', null)}`);
        this._collector.on('collect', async (input) => { await onCollect.bind(this)(input).next(); });
        this._collector.on('end', async () => {
            replyReturn(`Alright, you're all set!`);
            this._data.client.log('console', `${guild} successfully configured their ${type}Config.`);
            if (command != 'setup')
                DecidableCommand.ExecuteDecidables(this, { executeProps: this._data.executeProps });
        });
        async function* onCollect(input) {
            //staffRole Tag
            yield input.channel.send(this._find('Role', staffRoleType, 'Tag', input));
            //staffRole Find
            let staffRoleResult = this._find('Role', staffRoleType, 'Tag', input);
            let staffRole = this._nullMakeValue('Role', staffRoleResult);
            //winnerRole Exists
            if (this._data.isGiveawayType()) {
                yield input.channel.send(this._find('Role', `${type} Winner`, 'Exists', input));
                //winnerRole Find
                let winnerRoleResult = this._find('Role', `${type} Winner`, 'Find', input);
                var winnerRole = this._nullMakeValue('Role', winnerRoleResult);
            }
            //channel Tag
            yield input.channel.send(this._find('Channel', lowerType, 'Exists', input));
            //channel Find
            let channelResult = this._find('Channel', lowerType, 'Find', input);
            let channel = this._nullMakeValue('Channel', channelResult);
            //Poll & Suggestion finished
            const reason = `${executor.tag} requested`;
            const make = (type) => guild[`${type}s`].create(`${type}s`, { reason });
            const goodToGo = {
                channel: channel == 'make' ? await make('channel') : undefined,
                staffRole: staffRole == 'make' ? await make('role') : undefined
            };
            if (!this._data.isGiveawayType())
                return this._goodToGo(goodToGo);
            //allowSameWinner Ask
            yield input.channel.send(`Alright last thing, should I allow same winners? (A user winning a ${lowerType} can't win the next one, if you say no!)`);
            //allowSameWinner Process
            let allowSameWinner = input.content.toLowerCase() == 'yes';
            //Giveaway finished
            const winner = winnerRole == 'make' ? await make('role') : undefined;
            if (this._data.is('Giveaway'))
                return this._goodToGo({ ...goodToGo,
                    allowSameWinner, winner
                });
            //ignoreLastWins ask
            yield input.channel.send(`Okay last thing I promise- how many ${lowerType}s' winners should I ignore?` +
                `(If sete to 2, the winners for the last to ${lowerType}s will not be able to win the current one.) Default is 0.`);
            //Theme finished
            return this._goodToGo({ ...goodToGo, winner, allowSameWinner, ignoreLastWins: parseInt(input.content) || 0 });
        }
    }
    async _checkAllArguments() {
        const { setup, replySemiPrivate } = this._data;
        try {
            await this._goodToGo(setup);
            return replySemiPrivate('Setup done!');
        }
        catch (err) {
            return replySemiPrivate(err);
        }
    }
    async _goodToGo(setup) {
        const { pGuild, type } = this._data;
        const config = pGuild.settings.config.decidables;
        const staffRole = setup.staffRole && new json_1.PRole(setup.staffRole);
        const base = {
            firstTimeExecuted: false,
            channel: setup.channel && new json_1.PChannel(setup.channel)
        };
        const result = (function constructConfig(data) {
            if (data.is('Poll'))
                return config.pollConfig = new config_1.PollConfig({ ...base,
                    pollRole: staffRole, polls: new Array()
                });
            else if (data.is('Suggestion'))
                return config.suggestionConfig = new config_1.SuggestionConfig({ ...base,
                    managerRole: staffRole, suggestions: new Array()
                });
            else if (data.is('Giveaway'))
                return config.giveawayConfig = new config_1.GiveawayConfig({ ...base,
                    hostRole: staffRole, giveaways: new Array(),
                    winnerRole: data.setup.winner && new json_1.PRole(data.setup.winner),
                    allowSameWinner: data.setup.allowSameWinner });
            else if (data.is('Theme'))
                return config.themeConfig = new config_1.ThemeConfig({ ...base,
                    hostRole: staffRole, themes: new Array(),
                    winnerRole: data.setup.winner && new json_1.PRole(data.setup.winner),
                    allowSameWinner: data.setup.allowSameWinner,
                    ignoreLastWins: data.setup.ignoreLastWins });
        })(this._data);
        await this.updatePGuilds(`**${pGuild.name}**'s ${type}Config after setting it up.`);
        this._collector.stop('Setup done');
        const { executor, member, guild, channel } = this._data.commandProps;
        this._data.client.AchievementCheck({ user: executor, guildMember: member, guild }, 'CHANNEL', type, [channel]);
        return result;
    }
    _find(type, typeName, pinguResponse, message) {
        const response = message?.content?.toLowerCase();
        let typeResult /*: (Role | TextChannel) | string*/ = null;
        const lowerType = type.toLowerCase();
        switch (pinguResponse) {
            case 'Exists': return `Do you have a **${typeName}** ${lowerType}?`;
            case 'Tag': return (response == 'yes' ? `Please tag the ${lowerType} id` :
                response == 'no' ? `Would you like a **${typeName}** ${lowerType}` :
                    null);
            case 'Find':
                typeResult = message.guild[`${lowerType}s`].cache.findFromString(response) || message.mentions[`${lowerType}s`].first();
                if (typeResult)
                    message.channel.send(`Okay, I found ${typeResult.name}`);
                else if (response == 'yes') {
                    typeResult = 'make';
                    message.channel.send(`Okay, I'll make that...`);
                }
                else if (response == 'no') {
                    typeResult = 'undefined';
                    message.channel.send(`Okay, I won't make that`);
                }
                return typeResult.id || typeResult;
            default: return null;
        }
    }
    _nullMakeValue(type, result) {
        return [!'undefined', 'make'].includes(result) ? this._data.commandProps.guild[`${type.toLowerCase()}s`].cache.get(result) : result;
    }
    listDecidables() {
        let collection = this._config.collection.filter(async (d) => {
            const { filter, commandProps: { guild } } = this._data;
            const c = await guild.channels.fetch(d.channel._id);
            const m = await c.messages.fetch(d._id);
            const date = (() => (filter.date.before ? filter.date.before.getTime() < m.createdTimestamp : true &&
                filter.date.after ? filter.date.after.getTime() > m.createdTimestamp : true &&
                filter.date.during ? (filter.date.during.getFullYear() == m.createdAt.getFullYear() &&
                filter.date.during.getMonth() == m.createdAt.getMonth() &&
                filter.date.during.getDate() == m.createdAt.getDate()) : true))();
            const value = d.value ? d.value.includes(filter.value) : true;
            const channel = filter.from ? filter.from.id == d.channel._id : true;
            const by = (() => (this._data.isGiveawayType() ? (this._data.filter.by.hosted ? this._data.filter.by.hosted.id == d.author._id : true &&
                this._data.filter.by.won ? d.winners.some(pgm => pgm._id == this._data.filter.by.won.id) : true) : this._data.is('Poll') ? this._data.filter.by.asked ? this._data.filter.by.asked.id == d.author._id : true : (this._data.is('Suggestion') && (this._data.filter.by.decided ? this._data.filter.by.decided.id == d.decidedBy._id : true &&
                this._data.filter.by.suggested ? this._data.filter.by.suggested.id == d.author._id : true))))();
            const decision = this._data.is('Poll') || this._data.is('Suggestion') ? (this._data.filter.decision == d.approved) : true;
            return date && value && channel && by && decision;
        });
        const { limit } = this._data.filter;
        if (limit.newest)
            collection = collection.slice(collection.length - limit.newest + 1, collection.length);
        if (limit.oldest)
            collection = collection.slice(0, limit.oldest);
        this._collection ?? new DecidableCollection_1.default(this._data, collection);
        return this._collection.list();
    }
    async _onTimeFinished(sent, value, winnersAllowed, embed, decidable, interval, previousWinners) {
        if (interval)
            clearInterval(interval);
        const { _data: data, _getGiveawayDescription, updatePGuilds, _saveVerdict } = this;
        const { client, type, lowerType, commandProps: { guild } } = data;
        const config = this._config;
        const { winnerRole, allowSameWinner } = config;
        decidable = (await (this._data.is('Poll') ?
            decidePoll(decidable) :
            getGiveawayWinner(this._data.is('Giveaway') ? decidable : decidable)));
        await this._saveVerdict(decidable);
        client.log('console', `Updated **${decidable.author.name}**'s ${lowerType} "**${decidable.value}**" (${decidable._id}) after timeout.`);
        return sent;
        async function decidePoll(poll) {
            const { get } = sent.reactions.cache;
            poll = items_1.Poll.Decide(poll, get('👍').count, get('👎').count);
            sent.channel.send(`The poll of **${poll.value}**, voted **${poll.approved}**!`);
            data.client.log('console', `Poll, "${poll.value}" (${poll._id}) by ${poll.author.name}, voted ${poll.approved}.`);
            const approvedEmoji = poll.approved == 'Approved' ? '👍' : poll.approved == 'Denied' ? '👎' : '🤷🏼‍♂️';
            sent.editEmbeds(embed
                .setTitle(`FINISHED! ${poll.value}`)
                .setDescription(`Voting done! Final answer: **${approvedEmoji} ${poll.approved}**\n` +
                `**Id:** \`${poll._id}\``)
                .setFooter(`Poll ended.`));
            return poll;
        }
        async function getGiveawayWinner(decidable) {
            const host = await guild.members.fetch(decidable.author._id);
            const winners = new Array();
            let reactedUsers = await sent.reactions.cache.get(data.reactions[0]).users.fetch().catch(err => {
                client.log('error', `Fetching ${data.reactions[0]} reaction from ${lowerType}`, sent.content, err);
                host.createDM().then(dm => dm.send(`Hi! I ran into an issue while finding a winner for your ${lowerType} "${value}"... I've already contacted my developers!`).catch(err => null));
                return null;
            });
            const members = await guild.members.fetch({ user: reactedUsers.valueArr() });
            const winnerOrWinners = `Winner${winnersAllowed > 1 ? 's' : ''}`;
            reactedUsers = reactedUsers.filter(u => {
                if (u.bot)
                    return false;
                const winnerRoleExists = winnerRole && true;
                const userIsntWinner = winnerRole && !members.get(u.id).roles.cache.has(winnerRole._id);
                const isTheme = lowerType == 'theme';
                const themeConfig = isTheme && config;
                const userIsntInPreviousWinners = themeConfig && themeConfig.collection
                    .filter((_, i, col) => col.length - i < themeConfig.ignoreLastWins)
                    .map(col => col.winners)
                    .some((_, __, col) => !col.reduce((arr, winners) => arr.concat(winners.map(pgm => pgm._id)), new Array()).includes(u.id));
                return (allowSameWinner || winnerRoleExists && userIsntWinner) && isTheme ? userIsntInPreviousWinners : true;
            });
            const previousWinnersIds = previousWinners?.map(gm => gm.id);
            const reactedUsersNoPreviousWinners = () => reactedUsers.filter((_, id) => previousWinnersIds.includes(id)).size > 0;
            const NoWinnerString = `A winner couldn't be found!`;
            for (let i = 0; i < winnersAllowed; i++) {
                var winner = getWinner();
                while (!winner || reactedUsers.size > winnersAllowed) {
                    if (reactedUsersNoPreviousWinners())
                        winner = getWinner();
                    else
                        break;
                }
                if (winner == NoWinnerString)
                    winner = 'no one';
                else
                    reactedUsers.delete(winner);
                winners[i] = winner;
            }
            if (winner == 'no one' && !winners.filter(w => w != 'no one').length || !winners[0]) {
                sent.editEmbeds(embed
                    .setTitle(`Unable to find a winner for "${value}"!`)
                    .setDescription(_getGiveawayDescription(winnerOrWinners, `__Winner not found!__`, host, decidable))
                    .setFooter(`${type} ended.`));
                sent.channel.send(`A winner to "**${value}**" couldn't be found!`);
                return decidable;
            }
            const args = new Arguments_1.default(winners.join(' '));
            const mappedUsers = args.getAll(args.mentions.get('SNOWFLAKE').regex).reduce((users, id) => users.set(id, client.users.cache.get(id)), new Map());
            if (winners.length > 1) {
                const lastWinner = winners.splice(winners.length - 1)[0];
                var winnersString = `${winners.join(', ')} & ${lastWinner}`;
            }
            else
                winnersString = winners[0];
            mappedUsers.forEach((user, id) => winnersString.replace(id, user.toString()));
            const announcement = await sent.channel.send(`The ${winnerOrWinners.toLowerCase()} of **${value}**, hosted by ${host}, is no other than: ${winnersString}! Congratulations!`);
            announcement.react(client.emotes.getOne('hypers'));
            if (winnerRole) {
                //Remove previous winners
                await Promise.all(guild.members.cache.filter(m => m.roles.cache.has(winnerRole._id)).map(gm => gm.roles.remove(winnerRole._id)));
                await Promise.all(winners.map(id => id == NoWinnerString ?
                    null :
                    guild.members.cache.get(id).roles.add(winnerRole._id)));
            }
            sent.editEmbeds(embed
                .setTitle(`${winnerOrWinners} of "${value}"!`)
                .setDescription(_getGiveawayDescription(winnerOrWinners, winnersString, host, decidable))
                .setFooter(`${type} ended.`));
            await updatePGuildWinners();
            return decidable;
            function getWinner() {
                const winner = (function selectWinner() {
                    if (!reactedUsers.size)
                        return NoWinnerString;
                    const user = reactedUsers.valueArr().random();
                    const member = guild.member(user);
                    if (!winnerRole)
                        return member.id;
                    else if (member.roles.cache.has(winnerRole._id))
                        return allowSameWinner ? member.id : null;
                    return member.id;
                })();
                return winners.includes(winner) ? null : winner;
            }
            function updatePGuildWinners() {
                decidable.winners = winners
                    .filter(s => s != NoWinnerString)
                    .map(id => new json_1.PGuildMember(guild.members.cache.get(id)));
                return updatePGuilds(`Winner for ${value} was found: ${winnersString}`);
            }
        }
    }
    _getGiveawayDescription(winnerOrWinners, winners, host, decidable) {
        return (`**${winnerOrWinners}:** ${winners}\n` +
            `**Host:** ${host}\n` +
            `**Id:** \`${decidable._id}\``);
    }
    async reroll(sent) {
        let id = new Arguments_1.default(this._data.runOptions.value).mentions.get('SNOWFLAKE').argument();
        const { channel, guild } = sent;
        const config = this._configs.get(this._data.config);
        if (!id) {
            const messages = channel.messages.cache.valueArr();
            const preDecidables = config.collection.filter(d => d.channel._id == channel.id);
            id = messages.find(m => preDecidables.find(d => d._id == m.id))?.id;
            if (!id)
                return sent.edit(`${this._data.lowerType} message not found - please provide a message id!`);
        }
        let previousMessage = channel.messages.cache.get(id);
        if (!previousMessage) {
            previousMessage = channel.messages.cache.get(id.split('/')[6]) || channel.messages.cache.find(m => config.collection.some(d => d._id == m.id))?.[0];
            if (!previousMessage)
                return sent.edit(`Unable to parse ${id} as id, or message can't be found!`);
            else if (!previousMessage.embeds[0])
                return sent.edit(`There's no embed in that message!`);
            else if (previousMessage.author.id != this._data.client.id)
                return sent.edit(`That isn't my message!`);
        }
        const decidable = config.collection.find(d => d._id == id);
        const previousWinners = await Promise.all(decidable.winners.map(w => guild.members.fetch(w._id)));
        const embed = previousMessage.embeds[0];
        const winnerLength = (() => {
            const winnerLine = embed.description.split(':')[0];
            const [left, right] = winnerLine.split('&');
            const partOne = left.split(',');
            return [...partOne, right].length;
        })();
        return this._onTimeFinished(previousMessage, decidable.value, winnerLength || 1, embed, decidable, null, previousWinners);
    }
    async checkRoleUpdates() {
        const { executeProps: { config, type, commandProps: { guild } } } = this._data;
        const hostPRole = this._configs.get(config).hostRole;
        const winnerPRole = this._configs.get(config).winnerRole;
        const CheckRole = (pRole) => pRole && guild.roles.fetch(pRole._id);
        const [hostRole, winnerRole] = await Promise.all([
            CheckRole(hostPRole), CheckRole(winnerPRole)
        ]);
        const noWinnerRole = !winnerRole && !winnerPRole;
        const noHostRole = !hostRole && !hostPRole;
        const winnerNameChanged = !noWinnerRole && winnerRole.name != winnerPRole.name;
        const hostNameChanged = !noHostRole && hostRole.name != hostPRole.name;
        //Any condition is true
        if ([noWinnerRole, noHostRole, winnerNameChanged, hostNameChanged].some(v => v)) {
            await this.updatePGuilds(`${type} role${type == 'Giveaway' ? 's' : ''} updated.`);
        }
    }
    async _saveVerdict(decidable) {
        const itemIndex = this._config.collection.findIndex(d => d._id == decidable._id);
        this._config.collection[itemIndex] = decidable;
        await this.updatePGuilds(`Saved verdict for "${decidable.value}" to ${this._data.commandProps.guild}'s PinguGuild`);
        return this._config.collection;
    }
    updatePGuilds(reason) {
        const { executeProps: { client, type, pGuild } } = this._data;
        return client.pGuilds.update(pGuild, `HandleDecidables: ${type}`, reason);
    }
    setExecute(execute) {
        this._execute = execute;
        return this;
    }
}
exports.DecidableCommand = DecidableCommand;
exports.default = DecidableCommand;
