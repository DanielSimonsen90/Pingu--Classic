import { Collection, Guild, GuildChannel, GuildChannelResolvable, GuildMember, Message, MessageEmbed, MessageReaction, PermissionString, Role, RoleResolvable, TextChannel, User } from 'discord.js';
const ms = require('ms');

import { GiveawayConfig, PollConfig, SuggestionConfig, ThemeConfig } from './config';
import IDecidableConfigOptions from './interfaces/IDecidableConfigOptions';
import DecidablesConfig from './config/DecidablesConfig';

import Decidable from './items/Decidable';
import { Theme, Giveaway, Poll, Suggestion } from './items';

import PClient from '../database/json/PClient';
import PRole from '../database/json/PRole';
import PChannel from '../database/json/PChannel';
import PGuildMember from '../database/json/PGuildMember';

import PinguGuild from '../pingu/guild/PinguGuild';
import PinguClient from '../pingu/client/PinguClient';
import { AchievementCheck } from '../pingu/achievements';

import TimeLeftObject from '../helpers/TimeLeftObject';
import Arguments from '../helpers/Arguments';

export type DecidablesTypes = 'Giveaway' | 'Poll' | 'Suggestion' | 'Theme';
interface DecidablesParams {
    client: PinguClient,
    message: Message,
    args: Arguments,
    pGuild: PinguGuild,
    pGuildClient: PClient,
    decidablesType: DecidablesTypes,
    reactionEmojis: string[],
    config: GiveawayConfig | PollConfig | SuggestionConfig | ThemeConfig
}

interface ConfigKeys extends IDecidableConfigOptions {
    hostRole: PRole,
    collection: Decidable[],
    staffRoleType: string
    winnerRole?: PRole,
    constructor: typeof Decidable,
    allowSameWinner?: boolean,
    ignoreLastWins?: number,
}
function SetConfigObjects(config: DecidablesConfig) {
    const { giveawayConfig, pollConfig, suggestionConfig, themeConfig } = config;
    
    const giveawayObj = {
        constructor: Giveaway,
        firstTimeExecuted: giveawayConfig.firstTimeExecuted,
        channel: giveawayConfig.channel,
        hostRole: giveawayConfig.hostRole,
        winnerRole: giveawayConfig.winnerRole,
        collection: giveawayConfig.giveaways,
        allowSameWinner: giveawayConfig.allowSameWinner,
        staffRoleType: 'Giveaway Host'
    } as ConfigKeys;
    const pollObj = {
        constructor: Poll,
        firstTimeExecuted: pollConfig.firstTimeExecuted,
        channel: pollConfig.channel,
        hostRole: pollConfig.pollRole,
        collection: pollConfig.polls,
        staffRoleType: 'Poll Host'
    } as ConfigKeys;
    const suggestionsObj = {
        constructor: Suggestion,
        firstTimeExecuted: suggestionConfig.firstTimeExecuted,
        channel: suggestionConfig.channel,
        hostRole: suggestionConfig.managerRole,
        collection: suggestionConfig.suggestions,
        staffRoleType: 'Suggestion Manager'
    } as ConfigKeys;
    const themeMap = {
        constructor: Theme,
        firstTimeExecuted: themeConfig.firstTimeExecuted,
        channel: themeConfig.channel,
        winnerRole: themeConfig.winnerRole,
        hostRole: themeConfig.hostRole,
        collection: themeConfig.themes,
        allowSameWinner: themeConfig.allowSameWinner,
        ignoreLastWins: themeConfig.ignoreLastWins,
        staffRoleType: 'Theme Host'
    } as ConfigKeys;

    return Configs = new Map<IDecidableConfigOptions, ConfigKeys>([
        [giveawayConfig, giveawayObj],
        [pollConfig, pollObj],
        [suggestionConfig, suggestionsObj],
        [themeConfig, themeMap]
    ]);
}
let Configs: Map<IDecidableConfigOptions, ConfigKeys>;

const RegexUtil = {
    validTime: /^\d{1,}[s|m|h|d]$/,
    hasWinners: /^\d{1,}w$/
}

export async function HandleDecidables(params: DecidablesParams) {
    const { client, message, args, pGuild, pGuildClient, decidablesType, config, reactionEmojis } = params;
    const { guild, author, content, mentions, member } = message;
    const { firstTimeExecuted, channel } = config;

    //A decidables command must have a Pingu Guild registered
    if (!pGuild) {
        await client.log('error', `Unable to host ${decidablesType.toLowerCase()} for ${guild}, as I couldn't get their PinguGuild!`);
        return message.channel.send(`I couldn't get your PinguGuild, so I can't host the ${decidablesType.toLowerCase()} for you!`);
    }

    const decidablesConfig = pGuild.settings.config.decidables;
    SetConfigObjects(decidablesConfig);

    let permCheck = await PermissionCheckDecidable(params);
    if (permCheck != client.permissions.PermissionGranted) return message.channel.send(permCheck);

    //Is user trying to host?
    if (firstTimeExecuted || args[0] == 'setup') return FirstTimeExecuted(params);
    else if (args[0] == 'list') return ListDecidables(params, Configs.get(config).collection);

    const reroll = ['Giveaway', 'Theme'].includes(decidablesType) && args.get('reroll');

    if (decidablesType != 'Suggestion') {
        var time = args.get(RegexUtil.validTime);
        var winners = args.get(RegexUtil.hasWinners, false) && parseInt(args.get(RegexUtil.hasWinners))|| 1;
    }

    let decidablesChannel = guild.channels.cache.find(c => [c.id, c.name].includes(args[0]) || c == mentions.channels.first()) as TextChannel;
    if (decidablesChannel) args.shift();
    else decidablesChannel = (reroll ? guild.channels.cache.get(channel?._id) || message.channel : message.channel) as TextChannel;

    const users = new Map<User, Array<PermissionString>>([[author, ['VIEW_CHANNEL']], [client.user, ['SEND_MESSAGES', 'ADD_REACTIONS']]]);
    for (const [u, perms] of users) {
        let channelPerms = client.permissions.checkFor({ author: u, channel: decidablesChannel }, ...perms);
        if (channelPerms != client.permissions.PermissionGranted) return message.channel.send(channelPerms);
    }
    
    const mention = mentions.users.first();
    let value = args.join(' ');
    if (mention) value = value.replace(/<@!*\d{18}>/, guild.member(mention) ? guild.member(mention).displayName : mention.username);

    if (reroll) {
        const sent = await message.channel.send(`Rerolling ${decidablesType.toLowerCase()}...`);
        return Reroll(params, sent)
    }

    const endsAt = new Date(Date.now() + ms(time) + ms('1s'));
    const embed = new MessageEmbed({
        title: 'Suggestion' == decidablesType ? 'Suggestion' : value,
        color: pGuildClient.embedColor,
        description: isGiveawayType(decidablesType) ? (
            `**React with ${reactionEmojis[0]} to enter!**\n` +
            `Winners: **${winners}**\n` +
            `Ends in: ${new TimeLeftObject(new Date(), endsAt).toString()}\n` +
            `Hosted by ${author}`
        ) : decidablesType == 'Poll' ? (
            `Brought to you by ${author}\n` +
            `Time left: ${new TimeLeftObject(new Date(), endsAt).toString()}`
        ) : value,
        footer: { text: decidablesType == 'Suggestion' ? `This suggestion is currently Undecided` : `Ends at` },
        timestamp: decidablesType != 'Suggestion' ? endsAt : null 
    });

    if (message.channel.id == decidablesChannel.id &&
        client.permissions.checkFor(
            { author: client.user, channel: decidablesChannel },
            'MANAGE_MESSAGES'
        ) == client.permissions.PermissionGranted)
        message.delete();
    else message.channel.send(`Announcing the ${decidablesType.toLowerCase()} in ${decidablesChannel} now!`).then(s => s.doIn(s => s.delete(), '5s'));

    const sent = await message.channel.sendEmbeds(embed);
    reactionEmojis.forEach(e => sent.react(e));
    sent.createReactionCollector({
        filter: (r: MessageReaction, u: User) => reactionEmojis.includes(r.emoji.name) && !u.bot,
        time: endsAt && new TimeLeftObject(new Date(), endsAt).milliseconds || 0
    }).on('collect', (r, u) => client.log('console', 
        `**${u.tag}** ${isGiveawayType(decidablesType) ? 
            `entered ${decidablesType.toLowerCase()}` : 
            `voted **${'👍' == r.emoji.name ? 'Yes' : 'No'}**`}`
    ));

    client.log('console', `**${author.tag}** (${author.id}) hosted ${decidablesType} in ${decidablesChannel} (${decidablesChannel.name}), ${guild}`);

    const decidable = new (Configs.get(config).constructor)(value, sent.id, new PGuildMember(member), decidablesChannel, endsAt);

    AddDecidableToPGuilds(params, decidable);

    if (decidablesType == 'Suggestion') return sent;

    let interval = setInterval(function updateTimer() {
        sent.editEmbeds(sent.embeds[0]
            .setDescription(
                isGiveawayType(decidablesType) ? (
                    `**React with ${reactionEmojis[0]} to enter!**\n` +
                    `Winners: **${winners}**\n` +
                    `Ends in: ${new TimeLeftObject(new Date(), endsAt).toString()}.\n` +
                    `Hosted by <@${decidable.author._id}>`
                ) : decidablesType == 'Poll' ? (
                    `Brought to you by <@${decidable.author._id}>\n` +
                    `Time left: ${new TimeLeftObject(new Date(), endsAt).toString()}.`
                ) : sent.embeds[0].description
            )
        ).catch(err => {
            client.log('error', `Updating ${decidablesType.toLowerCase()} timer`, content, err);
            author.send(`I had an issue updating the ${decidablesType.toLowerCase()} message, so your ${decidablesType.toLowerCase()} might be broken!`);
        })
    }, ms('5s'));

    setTimeout(() => onTimeFinished(sent, value, winners, embed, decidable, interval, params, []), ms(time));
}

async function PermissionCheckDecidable(params: DecidablesParams) {
    const { client, message, config, args, decidablesType, pGuild } = params;
    const { firstTimeExecuted } = config;
    const { PermissionGranted } = client.permissions;
    let { hostRole } = Configs.get(config);

    //If executed for the first time or a sub command is used, no need to validate if args are okay
    if (firstTimeExecuted || ["reroll", "setup", "list"].includes(args[0])) return PermissionGranted;
    //!args[0] && !args[1]: [time, ...title]
    else if (args.length < 2) return `You didn't give me enough arguments!`;

    await (async function CheckRoleUpdates() {
        let hostPRole = Configs.get(config).hostRole;
        let winnerPRole = Configs.get(config).winnerRole;

        const CheckRole = (pRole: PRole) => pRole && message.guild.roles.fetch(pRole._id);

        const [hostRole, winnerRole] = await Promise.all([
            CheckRole(hostPRole),
            CheckRole(winnerPRole)
        ]);

        const noWinnerRole = !winnerRole && !winnerPRole;
        const noHostRole = !hostRole && !hostPRole;
        const winnerNameChanged = !noWinnerRole && winnerRole.name != winnerPRole.name;
        const hostNameChanged = !noHostRole && hostRole.name != hostPRole.name;

        //Any condition is true
        if ([noWinnerRole, noHostRole, winnerNameChanged, hostNameChanged].some(v => v)) {
            await UpdatePGuild(client, pGuild, decidablesType, `${decidablesType} role${decidablesType == 'Giveaway' ? 's' : ''} updated.`);
        }
    })();

    if (decidablesType == 'Suggestion') return PermissionGranted;

    const { member } = message;

    //Not admin nor have host role
    if (!member.permissions.has('ADMINISTRATOR') && hostRole && !member.roles.cache.has(hostRole._id)) {
        return "You don't have `Administrator` permissions" + (hostRole ? ` or the \`${hostRole.name}\` role` : "" + "!");
    }

    const time = args.get(RegexUtil.validTime, false) || args.get(/^\d$/, false);
    if (!time) return `Please provide a valid time!`;

    const timeValue = parseInt(time.substring(0, time.length - 1));

    if (time.endsWith('s') && timeValue < 30) return `Please specify a time higher than 29s!`;
    else if (time.length == timeValue.toString().length) args[0] += "m"; //No s/m/h provided, treat as minutes

    return PermissionGranted;
}

async function FirstTimeExecuted(params: DecidablesParams) {
    const { client, args, message, decidablesType, pGuild, config } = params;

    if (args[0] != 'setup') message.channel.send(`**Hold on fella!**\nWe need to get ${message.guild.name} set up first!`);

    const hasAllArguments = await HasAllArguments();
    if (hasAllArguments) return;

    const collector = message.channel.createMessageCollector({ filter: m => (m as Message).author.id == message.author.id })
    let decidablesChannelName = decidablesType.toLowerCase();
    const { staffRoleType } = Configs.get(config);

    message.channel.send(`Firstly, ${Find('Role', staffRoleType, 'Exists', message)}`);

    /* Expects Promise<void> */
    collector.on('collect', async input => {
        await onCollect(input).next();
    });
    collector.on('end', async () => {
        message.channel.send(`Alright, you're all set!`);
        client.log('console', `"${message.guild.name}" successfully configured their ${decidablesType}Config.`);

        if (args[0] != 'setup') HandleDecidables(params);
    });

    async function* onCollect(input: Message) {
        //hostRole Tag
        yield message.channel.send(Find('Role', staffRoleType, 'Tag', input));

        //hostRole Find
        let staffRoleResult = Find('Role', staffRoleType, 'Find', input);
        let staffRole = NullMakeValue<Role>('Role', staffRoleResult);

        //winnerRole Exists
        if (['Giveaway', 'Theme'].includes(decidablesType)) {
            yield message.channel.send(Find('Role', `${decidablesType} Winner`, 'Exists', input));

            //winnerRole Find
            let winnerRoleResult = Find('Role', `${decidablesType} Winner`, 'Find', input);
            var winnerRole = NullMakeValue<Role>('Role', winnerRoleResult);
        }

        //channel Tag
        yield message.channel.send(Find('Channel', decidablesChannelName, 'Exists', input));

        //channel Find
        let channelResult = Find('Channel', decidablesChannelName, 'Find', input);
        let channel = NullMakeValue<TextChannel>('Channel', channelResult);

        //Poll & Suggestion finished
        let goodToGo = { staffRole, channel } as any;
        if (!['Giveaway', 'Theme'].includes(decidablesType)) return GoodToGo(goodToGo);
        
        //allowSameWinner Ask
        yield message.channel.send(`Alright last thing, should I allow same winners? (A user winning a ${decidablesType.toLowerCase()} can't win the next one, if you say no!)`);
        
        //allowSameWinner Process
        let allowSameWinner = input.content.toLowerCase() == 'yes';

        //Giveaway finished
        if ('Giveaway' == decidablesType) return GoodToGo(goodToGo = { ...goodToGo, winnerRole, allowSameWinner });

        //ignoreLastWins ask
        yield message.channel.send(
            `Okay last thing I promise- how many previous ${decidablesType.toLowerCase()}s' winners should I ignore?` + 
            `(If set to 2, the winners for the last 2 ${decidablesType.toLowerCase()}s will not be able to win the current one.) Default is 0`
        );
        
        //Theme finished
        return GoodToGo({ ...goodToGo, ignoreLastWins: parseInt(input.content.toLowerCase()) || 0 });
    }
    async function HasAllArguments() {
        //   0        1         2            2        3        3       4         4         5           5
        //[setup, staffRole, channel || winnerRole, null || channel, null || sameWinner, null || ignoreLastWins]

        if (decidablesType == 'Giveaway' && args.length != 5) return false //Not enough arguments
        if (decidablesType == 'Theme' && args.length != 6) return false //Not enough arguments

        class T { id: string; name: string; }

        let find = (i: T, arg: string) => [i.id, i.name.toLowerCase(), i.toString().toLowerCase()].includes(arg) && i;
        let findRole = (argument: string) => argument == 'null' ? null : message.guild.roles.cache.find(r => find(r, argument) != null) as RoleResolvable;
        let findChannel = (argument: string) => argument == 'null' ? null : message.guild.channels.cache.find(c => find(c, argument) && c.isText()) as TextChannel;

        let staffRole = findRole(args[1]);
        let channel = findChannel(args[decidablesType != 'Giveaway' && decidablesType != 'Theme' ? 2 : 3]);

        if (['Giveaway', 'Theme'].includes(decidablesType)) {
            await GoodToGo({
                staffRole, channel,
                winnerRole: findRole(args[2]),
                allowSameWinner: ['yes', 'true'].includes(args[4].toLowerCase()),
                ignoreLastWins: decidablesType == 'Theme' && !isNaN(parseInt(args[5])) ? parseInt(args[5]) : 0
            })
        } else await GoodToGo({ staffRole, channel });

        message.channel.send("Setup done!");
        return true;
    }
    async function GoodToGo(params: { staffRole: RoleResolvable, channel: GuildChannelResolvable, winnerRole?: RoleResolvable, allowSameWinner?: boolean, ignoreLastWins?: number }) {
        let { channel, staffRole, allowSameWinner, winnerRole, ignoreLastWins } = params;
        const decidablesConfig = pGuild.settings.config.decidables;

        if (typeof staffRole == 'string' && staffRole == 'make') staffRole = await MakeRole(message.guild, staffRoleType);
        if (typeof channel == 'string' && channel == 'Make') channel = await MakeChannel(message.guild, decidablesChannelName);
        if (winnerRole && typeof winnerRole == 'string' && winnerRole == 'Make') winnerRole = await MakeRole(message.guild, "Giveaway Winner");

        const _firstTimeExecuted = false;
        const _channel = channel && channel != 'null' ? new PChannel(channel as GuildChannel) : null;
        const _staffRole = staffRole && staffRole != 'null' ? new PRole(staffRole as Role) : null;
        const _winnerRole = winnerRole && winnerRole != 'null' ? new PRole(winnerRole as Role) : null;

        const basic = {
            firstTimeExecuted: _firstTimeExecuted,
            channel: _channel
        }

        const result = (function assignConfig() {
            switch (decidablesType) {
                case 'Giveaway': return decidablesConfig.giveawayConfig = new GiveawayConfig({
                    ...basic,
                    hostRole: _staffRole,
                    winnerRole: _winnerRole,
                    giveaways: [],
                    allowSameWinner
                });
                case 'Poll': return decidablesConfig.pollConfig = new PollConfig({
                    ...basic,
                    pollRole: _staffRole,
                    polls: []
                }); 
                case 'Suggestion': return decidablesConfig.suggestionConfig = new SuggestionConfig({
                    ...basic,
                    managerRole: _staffRole,
                    suggestions: []
                });
                case 'Theme': return decidablesConfig.themeConfig = new ThemeConfig({
                    ...basic,
                    hostRole: _staffRole,
                    winnerRole: _winnerRole,
                    themes: [],
                    allowSameWinner, ignoreLastWins, 
                }); 
            }
        })();


        await UpdatePGuild(client, pGuild, decidablesType, `**${pGuild.name}**'s ${decidablesType}Config after setting it up.`);

        collector.stop('Setup done');


        const { author, member, guild } = message;
        AchievementCheck(client, {
            user: author,
            guildMember: member,
            guild
        }, 'CHANNEL' as any, decidablesType, [message.channel]);

        return result;

        async function MakeRole(guild: Guild, name: string): Promise<Role> {
            return guild.roles.create({ name, reason: `Auto-created when setting up ${decidablesType.toLowerCase()}`}).catch(err => {
                client.log('error', `Creating ${name} role`, message.content, err)
                return null;
            });
        }
        async function MakeChannel(guild: Guild, name: string): Promise<TextChannel> {
            return guild.channels.create(name, { 
                reason: `Auto-created when setting up ${decidablesType.toLowerCase()}`
            }).catch(err => {
                client.log('error', `Creating ${name} channel`, message.content, err)
                return null;
            });
        }
    }
    /***@returns Response to 'Exists' & 'Create', but returns id of type || "Make" || "undefined" as final result*/
    function Find(type: 'Role' | 'Channel', typeName: string, pinguResponse: 'Exists' | 'Tag' | 'Find', userInput: Message): string {
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

                if (typeResult) message.channel.send(`Okay, I found ${typeResult.name}`);
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
    function NullMakeValue<T extends Role | TextChannel>(type: 'Role' | 'Channel', result: string): string | T {
        return !['null', 'Make'].includes(result) ? message.guild[`${type.toLowerCase()}s`].cache.get(result) : result;
    }
}

async function onTimeFinished(sent: Message, value: string, winnersAllowed: number, embed: MessageEmbed, decidable: Decidable, interval: NodeJS.Timeout, params: DecidablesParams, previousWinners: Array<GuildMember>) {
    clearInterval(interval);

    const { decidablesType, client, reactionEmojis } = params;

    decidable = await (decidablesType == 'Poll' ?
        DecidePoll(decidable as Poll) :
        GetGiveawayWinner(decidablesType == 'Giveaway' ? decidable as Giveaway : decidable as Theme));

    SaveVerdictToPGuilds(params, decidable);
    client.log('console', `Updated **${decidable.author.name}**'s ${decidablesType.toLowerCase()} "**${decidable.value}**" (${decidable._id}) after timeout.`);

    async function DecidePoll(poll: Poll) {
        const { get } = sent.reactions.cache;
        poll = Poll.Decide(
            poll,
            get('👍').count,
            get('👎').count
        );

        sent.channel.send(`The poll of **${poll.value}**, voted **${poll.approved}**!`);
        client.log('console', `Poll, "${poll.value}" (${poll._id}) by ${poll.author.name}, voted ${poll.approved}.`);

        sent.editEmbeds(embed
            .setTitle(`FINISHED! ${poll.value}`)
            .setDescription(
                `Voting done! Final answer: ${poll.approved}\n` +
                `**ID:** \`${poll._id}\``
            )
            .setFooter(`Poll ended.`)
        );
        return poll;
    }
    async function GetGiveawayWinner(decidable: Giveaway | Theme) {
        const host = sent.guild.members.cache.get(decidable.author._id);
        const { config, message } = params;
        const { guild } = message;
        const { winnerRole, allowSameWinner } = config as GiveawayConfig | ThemeConfig;
        let winners = new Array<GuildMember | string>();

        let reactedUsers = await sent.reactions.cache.get(reactionEmojis[0]).users.fetch().catch(err => {
            client.log('error', `Fetching ${reactionEmojis[0]} reaction from ${decidablesType.toLowerCase()}`, sent.content, err);
            host.createDM().then(dm => dm.send(`Hi! I ran into an issue while finding a winner for your ${decidablesType.toLowerCase()} "${value}"... I've already contacted my developers!`).catch(err => null));
            return null as Promise<Collection<string, User>>;
        });

        let members = await guild.members.fetch({ user: reactedUsers.array() });
        const winnerOrWinners = `Winner${winnersAllowed > 1 ? 's' : ''}`;

        reactedUsers = reactedUsers.filter(u => {
            if (u.bot) return false;

            const winnerRoleExists = winnerRole && true;
            const userIsntWinner = winnerRole && !members.get(u.id).roles.cache.has(winnerRole._id);
            const isTheme = decidablesType == 'Theme';
            const themeConfig = isTheme && Configs.get(config);
            const userIsntInPreviousWinners = themeConfig && (themeConfig.collection as Theme[])
                .filter((_, i, col) => col.length - i < themeConfig.ignoreLastWins)
                .map(col => col.winners)
                .some((_, __, col) => !col.reduce((arr, winners) => 
                    arr.concat(winners.map(pgm => pgm._id)), 
                new Array<string>()).includes(u.id));

            return (allowSameWinner || winnerRoleExists && userIsntWinner) && isTheme ? userIsntInPreviousWinners : true
        });

        const previousWinnersIds = previousWinners.map(gm => gm.id);
        const reactedUsersNoPreviousWinners = () => reactedUsers.filter((_, id) => previousWinnersIds.includes(id)).size > 0;
        for (let i = 0; i < winnersAllowed; i++) {
            var winner = getWinner();
            while (!winner || typeof winner != 'string' && previousWinnersIds.includes(winner.id) && reactedUsers.size > winnersAllowed) {
                if (reactedUsersNoPreviousWinners())
                    winner = getWinner();
                else break;
            }
            
            if (typeof winner == 'string') winner = 'no one';
            else reactedUsers.delete(winner.id);

            winners[i] = winner;
        }
        if (winner == 'no one' && !winners.filter(w => w != 'no one').length || !winners[0]) {
            sent.editEmbeds(embed
                .setTitle(`Unable to find a winner for "${value}"!`)
                .setDescription(getGiveawayDescription(winnerOrWinners, `__Winner not found!__`, host, decidable))
                .setFooter(`${decidablesType} ended.`)
            );
            sent.channel.send(`A winner to "**${value}**" couldn't be found!`);
            return decidable;
        }


        if (winners.length > 1) {
            const lastWinner = winners.splice(winners.length - 1);
            var winnersString = `${winners.join(', ')} & ${lastWinner}`;
        }
        else winnersString = winners[0].toString();

        let announceMessage = await sent.channel.send(`The ${winnerOrWinners.toLowerCase()} of **${value}**, hosted by ${host}, is no other than ${winnersString}! Congratulations!`);
        announceMessage.react(client.emotes.guild(client.savedServers.get('Pingu Support')).get('hypers'));

        if (winnerRole) {
            RemovePreviousWinners([...guild.members.cache.filter(m => m.roles.cache.has(winnerRole._id)).values()])
            
            for (let i = 0; i < winners.length; i++) {
                await (winners[i] as GuildMember).roles.add(winnerRole._id)
                .catch(err => {
                    client.log('error', `Unable to give ${winners[i]} a ${decidablesType} "${guild}"'s ${decidablesType} Winner role, ${winnerRole.name} (${winnerRole._id})`, sent.content, err);
                    host.user.send(`I couldn't give ${winners[i]} a ${decidablesType} Winner role!`)
                });                
            }
        }

        sent.editEmbeds(embed
            .setTitle(`${winnerOrWinners} of "${value}"!`)
            .setDescription(getGiveawayDescription(winnerOrWinners, winnersString, host, decidable))
            .setFooter(`${decidablesType} ended.`)
        ).catch(err => {
            client.log('error', `Editing the ${decidablesType} Message`, sent.content, err);
            host.user.send(`I encountered an error while updating the ${decidablesType.toLowerCase()} embed...`)
        });

        await UpdatePGuildWinners();

        return decidable;

        function getWinner() {
            let winner = (function selectWinner() {
                if (!reactedUsers.size) return `A winner couldn't be found!`;

                let user = reactedUsers.array()[Math.floor(Math.random() * reactedUsers.size)];
                const member = guild.member(user);

                if (!winnerRole) return member;
                else if (member.roles.cache.has(winnerRole._id)) return allowSameWinner ? member : null;
                return member;
            })();

            if (typeof winner == 'string') return winner;

            return winners.includes(winner) ? null : winner;
        }
        function RemovePreviousWinners(previousWinners: GuildMember[]) {
            for (const winner of previousWinners) {
                winner.roles.remove(winnerRole._id);
            }
        }
        async function UpdatePGuildWinners() {
            for (const winner of winners) {
                if (typeof winner != 'string') 
                    decidable.winners.push(new PGuildMember(winner));
            }
        }
    }
}
function getGiveawayDescription(winnerOrWinners: string, winners: string, host: GuildMember, decidable: Decidable) {
    return (
        `**${winnerOrWinners}:** ${winners}\n` +
        `**Host:** ${host}\n` +
        `**ID:** \`${decidable._id}\``
    )
}

async function ListDecidables(params: DecidablesParams, collection: Decidable[]) {
    const { pGuild, decidablesType, message, client, pGuildClient } = params;
    const listEmojis = ['⬅️', '🗑️', '➡️', '🛑'];
    let embeds = CreateEmbeds(false), embedIndex = 0;

    if (!decidablesType.length || !embeds.length) return message.channel.send(`There are no ${decidablesType.toLowerCase()}s saved!`);

    var sent = await message.channel.sendEmbeds(embeds[embedIndex]);
    listEmojis.forEach(e => sent.react(e));

    const collector = sent.createReactionCollector({
        filter: (r: MessageReaction, u: User) => listEmojis.includes(r.emoji.name) && u.id == message.author.id,
        time: ms('20s')
    });

    collector.on('end', async collected => {
        if (!collected.map(r => r.emoji.name).includes('🛑')) {
            await sent.delete();
            message.channel.send(`Stopped showing ${decidablesType.toLowerCase()}s.`).then(s => s.doIn(s => s.delete(), '5s'));
        }
    });
    collector.on('collect', async reaction => {
        const getEmbedDecidable = (embed: MessageEmbed) => collection.find(d => {
            const sentences = embed.description.split('\n');
            const idSentence = sentences[sentences.length - 1];
            const id = idSentence.split(' ')[1];
            return d._id == id;
        });
        const onArrowLeft = async () => direction(-1);
        const onBin = async () => direction(0);
        const onArrowRight = async () => direction(1);
        const onStop = async () => collector.stop('Requested by author');

        collector.resetTimer();

        let embedToSend: MessageEmbed = await (async function HandleEmojiName() {
            switch (reaction.emoji.name) {
                case '⬅️': return onArrowLeft();
                case '👍': case '👎': return onVerdict(reaction.emoji.name == '👍');
                case '🗑️': return onBin();
                case '➡️': return onArrowRight();
                case '🛑': return onStop() as null;
                default: return onDefault();
            }
        })();

        if (!collection.length || !embedToSend) {
            message.channel.send(`No more ${decidablesType.toLowerCase()}s saved!`);
            return onStop();
        }

        sent.editEmbeds(embedToSend);
        sent.reactions.cache.get(reaction.emoji.name).users.remove(message.author);

        async function onVerdict(approved: boolean) {
            if (decidablesType != 'Suggestion') return embeds[embedIndex];

            collection = await Decide(params, approved, getEmbedDecidable(embeds[embedIndex]) as Suggestion, message.member);
            CreateEmbeds(true);
            return direction(1);
        }
        async function onDefault() {
            client.log('error', `${decidablesType.toLowerCase()}, ListDecidables(), collector.on(), default case: ${reaction.emoji.name}`, message.content);
            return reaction.message.embeds[0];
        }

        async function direction(i: number): Promise<MessageEmbed> {
            if (!embeds) return null;

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
        }
        async function DeleteDecidable(embed: MessageEmbed) {
            let decidable = getEmbedDecidable(embed);
            collection = await RemoveDecidables(message, pGuild, decidablesType, [decidable]);
            embeds = CreateEmbeds(true);

            return !collection.includes(decidable) ?
                ExpressDeletionSuccessful('✅', 1) :
                ExpressDeletionSuccessful('❌', -1);

            async function ExpressDeletionSuccessful(emote: '✅' | '❌', index: 1 | -1) {
                const reaction = await sent.react(emote);
                await new Promise((resolve, reject) => 
                    sent.doIn(() => sent.reactions.cache.get(reaction.emoji.id).remove(), 1500)
                    .then(r => resolve(r))
                    .catch(err => reject(err)));
                return direction(index);
            }
        }
    });

    function CreateEmbeds(autoCalled: boolean) {
        if (!collection.length) return null;

        let embeds = new Array<MessageEmbed>(), toRemove = new Array<Decidable>();

        const createGiveawayEmbed = (g: Giveaway | Theme) => new MessageEmbed({
            description: [
                `**__Winner${g.winners.length > 1 ? 's' : ''}__**`, 
                g.winners.map(pg => `<@${pg._id}>`).join(', '), "",
                `**Hosted by <@${g.author._id}>**`, "",
                `**ID:** \`${g._id}\``
            ].join('\n')
        });
        const createPollEmbed = (p: Poll) => new MessageEmbed({
            description: [
                `**Verdict:** ${p.approved == 'Approved' ? '👍' : p.approved == 'Denied' ? '👎' : '🤷‍♂️'}\n`,
                `**Hosted by <@${p.author._id}>**\n`,
                `**ID:** \`${p._id}\``
            ].join('\n')
        });
        const createSuggestionEmbed = (s: Suggestion) => new MessageEmbed({
            description: [
                `**Verdict:** ${s.approved == 'Approved' ? '👍' : s.approved == 'Denied' ? '👎' : '🤷‍♂️'}\n`,
                `**Suggested by <@${s.author._id}>**\n`,
                s.approved != 'Undecided' ? `**Decided by <@${s.decidedBy._id}>**` : "",
                `ID: ${s._id}`
            ].join('\n')
        });

        const createDecidableEmbed = new Map<DecidablesTypes, (d: Decidable) => MessageEmbed>([
            ['Giveaway', createGiveawayEmbed],
            ['Poll', createPollEmbed],
            ['Suggestion', createSuggestionEmbed],
            ['Theme', createGiveawayEmbed]
        ]);

        for (let i = 0; i < collection.length; i++) {
            try {
                embeds.push(createDecidableEmbed.get(decidablesType)(collection[i])
                    .setColor(pGuildClient.embedColor)
                    .setFooter(`Now viewing: ${i + 1}/${collection.length}`)
                );
            } catch (err) {
                client.log('error', `Error while adding ${decidablesType.toLowerCase()} to embeds`, message.content, err);
                toRemove.push(collection[i]);                
            }
        }

        RemoveDecidables(message, pGuild, decidablesType, toRemove);
        if (!embeds && !autoCalled) return null;
        return embeds;
    }
}

async function Decide(params: DecidablesParams, approved: boolean, suggestion: Suggestion, decidedBy: GuildMember) {
    suggestion = Suggestion.Decide(suggestion, approved, new PGuildMember(decidedBy));

    (async function UpdateSuggestionEmbed() {
        const channel = decidedBy.guild.channels.cache.get(suggestion.channel._id) as TextChannel;
        const message = await channel.messages.fetch(suggestion._id);
        return message.embeds[0].setFooter(`Suggestion was ${approved} by ${decidedBy}`);
    })();

    return SaveVerdictToPGuilds(params, suggestion);
}
async function SaveVerdictToPGuilds(params: DecidablesParams, decidable: Decidable) {
    let { pGuild, client, decidablesType, config, message } = params;
    const { collection } = Configs.get(config);

    const itemIndex = collection.findIndex(d => d._id == decidable._id);
    collection[itemIndex] = decidable;

    UpdatePGuild(client, pGuild, decidablesType, `Saved verdict for "${decidable.value}" to ${message.guild.name}'s PinguGuild.`);
    return collection;
}
async function RemoveDecidables(message: Message, pGuild: PinguGuild, type: DecidablesTypes, decidables: Decidable[]) {
    if (!decidables || !decidables.length || !decidables[0]) return;

    const { client, guild } = message;

    const decidablesConfig = pGuild.settings.config.decidables;
    const decidableConfig = decidablesConfig[`${type.toLowerCase()}Config`] as IDecidableConfigOptions;

    const logs = new Array<string>();
    for (const d of decidables) {
        const { collection } = Configs.get(decidableConfig);
        collection.splice(collection.indexOf(d), 1);
        logs.push(`The ${type}, ${d.value} (${d._id}) was removed.`);
    }

    if (logs.length) (client as PinguClient).log('console', logs.join('\n'));
    
    await UpdatePGuild(client as PinguClient, pGuild, type, `Removed ${logs.length} ${type.toLowerCase()}s from **${guild.name}**'s ${type} list.`);

    return Configs.get(decidableConfig).collection;
}
async function Reroll(params: DecidablesParams, sent: Message) {
    const { message, args, decidablesType, client, config } = params;
    const { guild, channel } = message;
    let id = args.mentions.get('SNOWFLAKE').argument();

    if (!id) {
        const messages = channel.messages.cache.array();
        const preDecidables = Configs.get(config).collection.filter(d => d.channel._id == channel.id);
        id = messages.find(m => preDecidables.find(d => d._id == m.id))?.id;

        if (!id) return sent.edit(`${decidablesType.toLowerCase()} message not found - please provide a message ID.`);
    }

    let previousMessage = channel.messages.cache.get(id);
    if (!previousMessage) {
        previousMessage = channel.messages.cache.get(id.split('/')[6]) || channel.messages.cache.filter(m => Configs.get(config).collection.some(d => d._id == m.id))?.[0];
        if (!previousMessage) return sent.edit(`Unable to parse ${id} as ID, or message can't be found!`);
        else if (!previousMessage.embeds[0]) return sent.edit(`There's no embed in that message!`);
        else if (previousMessage.author.id != client.id) return sent.edit(`That isn't my message!`);
    }

    const decidable = Configs.get(config).collection.find(d => d._id == id) as Giveaway | Theme;
    const previousWinners = await Promise.all(decidable.winners.map(w => guild.members.fetch(w._id)));
    const embed = previousMessage.embeds[0];
    
    const winnerLength = (() => {
        const winnerLine = embed.description.split(':')[0];
        const [left, right] = winnerLine.split('&');
        const partOne = left.split(',');
        return [...partOne, right].length;
    })();

    return onTimeFinished(
        previousMessage,
        decidable.value,
        winnerLength || 1,
        embed,
        decidable,
        null,
        params,
        previousWinners
    )
}

async function AddDecidableToPGuilds(params: DecidablesParams, decidable: Decidable) {
    const { client, message, pGuild, decidablesType, config } = params;

    Configs.get(config).collection.push(decidable);

    return UpdatePGuild(client, pGuild, decidablesType, `New ${decidablesType.toLowerCase()} was added to **${message.guild.name}**`);
}
async function UpdatePGuild(client: PinguClient, pGuild: PinguGuild, decidableType: DecidablesTypes, reason: string) {
    return client.pGuilds.update(pGuild, `HandleDecidables: ${decidableType}`, reason);
}
function isGiveawayType(decidablesType: DecidablesTypes) {
    return ['Giveaway', 'Theme'].includes(decidablesType);
}

export default HandleDecidables;