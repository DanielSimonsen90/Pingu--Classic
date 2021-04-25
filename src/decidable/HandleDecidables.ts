﻿import { GuildChannelResolvable, RoleResolvable, PermissionString } from 'discord.js'; //Interfaces
import { Guild, GuildChannel, GuildMember, Role } from 'discord.js' //Guild stuff
import { Message, MessageEmbed, TextChannel, MessageReaction, User, Client } from 'discord.js'; //Discord classes

import { PClient, PGuildMember, PRole, PChannel } from '../database/json'; //PItems
import { DiscordPermissions, TimeLeftObject, EmbedField } from '../helpers'; //Pingu Helpers

import { errorLog, consoleLog, PermissionGranted, PermissionCheck, SavedServers, getEmote, AchievementCheck } from "../pingu/library/PinguLibrary";
const PinguLibrary = { 
    errorLog, consoleLog,
    PermissionGranted, PermissionCheck,
    SavedServers,
    getEmote,
    AchievementCheck
}

import { PinguGuild } from '../pingu/guild/PinguGuild';

import { GiveawayConfig, PollConfig, SuggestionConfig, ThemeConfig } from '../decidable/config'; //Decidable configs
import { Giveaway, Poll, Suggestion, Theme, Decidable } from '../decidable/items'; //Decidable items

const ms = require('ms');

enum DecidablesEnum {
    Giveaway = 'Giveaway',
    Poll = 'Poll',
    Suggestion = 'Suggestion',
    Theme = 'Theme'
}
type DecidablesTypes = keyof typeof DecidablesEnum;
interface DecidablesParams {
    message: Message,
    args: string[],
    pGuild: PinguGuild,
    pGuildClient: PClient,
    decidablesType: DecidablesTypes,
    reactionEmojis: string[],
    listEmojis: string[],
    config: GiveawayConfig | PollConfig | SuggestionConfig | ThemeConfig
}

export async function HandleDecidables(params: DecidablesParams) {
    const { message, args, pGuild, pGuildClient, decidablesType, config, reactionEmojis } = params;
    const { firstTimeExecuted, channel } = config;
    const reroll = () => (Is(DecidablesEnum.Giveaway) || Is(DecidablesEnum.Theme)) && args[0] == `reroll`;

    if (!pGuild) {
        await PinguLibrary.errorLog(message.client, `Unable to host ${decidablesType.toLowerCase()} for ${message.guild.name}, as I couldn't get their PinguGuild!`);
        return message.channel.send(`I couldn't get your PinguGuild, so I can't host the ${decidablesType.toLowerCase()} for you!`);
    }
    const decidablesConfig = pGuild.settings.config.decidables;

    //Test if all permissions are available & if all arguments are met
    let permCheck = await PermissionCheckDecidable(params);
    if (permCheck != PinguLibrary.PermissionGranted) return message.channel.send(permCheck);

    //Is user trying to host?
    if (firstTimeExecuted || args[0] == 'setup')
        return await FirstTimeExecuted(params);
    else if (args[0] == 'list') return ListDecidables(params,
        Is(DecidablesEnum.Giveaway) ? decidablesConfig.giveawayConfig.giveaways :
        Is(DecidablesEnum.Poll) ? decidablesConfig.pollConfig.polls :
        Is(DecidablesEnum.Suggestion) ? decidablesConfig.suggestionConfig.suggestions :
        decidablesConfig.themeConfig.themes
    );

    //#region Variable Creation
    if (!Is(DecidablesEnum.Suggestion)) {
        var time = args[0]
        if (reroll()) args.shift();
        else if (Is(DecidablesEnum.Giveaway) || Is(DecidablesEnum.Theme)) {
            var winners = 1;

            if (args[0].endsWith('w') && !isNaN(parseInt(args[0].substr(0, args[0].length - 1)))) {
                let winnerString = args.shift();
                winners = parseInt(winnerString.substring(0, winnerString.length - 1));
            }
        }
    }

    var decidablesChannel = message.guild.channels.cache.find(c => [c.id, c.name].includes(args[0]) || c == message.mentions.channels.first()) as TextChannel;
    if (decidablesChannel) args.shift();
    else decidablesChannel = (args[0] != `reroll` ? message.guild.channels.cache.find(c => c.id == channel._id) || message.channel : message.channel) as TextChannel;

    let check = {
        author: message.author,
        channel: decidablesChannel,
        client: message.client,
        content: message.content
    }
    let channelPerms = PinguLibrary.PermissionCheck(check, 'VIEW_CHANNEL');
    if (channelPerms != PinguLibrary.PermissionGranted) return message.channel.send(channelPerms);

    check.author = message.client.user;
    channelPerms = PinguLibrary.PermissionCheck(check, 'SEND_MESSAGES', 'ADD_REACTIONS');
    if (channelPerms != PinguLibrary.PermissionGranted) return message.channel.send(channelPerms);

    let value = args.join(' ');
    let mention = message.mentions.users.first();

    if (value.includes('<@'))
        value = value.replace(/(<@!*[\d]{18}>)/, (message.guild.member(mention) ? message.guild.member(mention).displayName : mention.username));

    if (!Is(DecidablesEnum.Suggestion))
        var endsAt = new Date(Date.now() + ms(time));

    let embed = new MessageEmbed()
        .setTitle(Is(DecidablesEnum.Suggestion) ? 'Suggestion' : value)
        .setColor(pGuildClient.embedColor)
        .setDescription((
            Is(DecidablesEnum.Giveaway) || Is(DecidablesEnum.Theme) ? (
                `React with ${reactionEmojis[0]} to enter!\n` +
                `Winners: **${winners}**\n` +
                `Ends in: ${new TimeLeftObject(new Date(Date.now()), endsAt).toString()}\n` +
                `Hosted by ${message.author}`) :
                Is(DecidablesEnum.Poll) ?
                    `Brought to you by <@${message.author.id}>\n` +
                    `Time left: ${new TimeLeftObject(new Date(Date.now()), endsAt).toString()}` :
                    value
        ))
        .setFooter(Is(DecidablesEnum.Suggestion) ? `This suggestion is currently Undecided` : `Ends at`)
        .setTimestamp(Is(DecidablesEnum.Suggestion) ? null : endsAt);
    //#endregion

    if (reroll()) await message.channel.send(`Rerolling ${decidablesType.toLowerCase()}...`);
    else if (message.channel.id == decidablesChannel.id &&
        PinguLibrary.PermissionCheck(
            { author: message.client.user, client: message.client, channel: decidablesChannel, content: null },
            'MANAGE_MESSAGES'
        ) == PinguLibrary.PermissionGranted)
        message.delete();
    else message.channel.send(`Announcing the ${decidablesType.toLowerCase()} in ${decidablesChannel} now!`).then(sent => sent.delete({ timeout: 5000 }));

    //Giveaway reroll
    if (reroll()) return await Reroll(params, embed, (Is(DecidablesEnum.Giveaway) ? decidablesConfig.giveawayConfig.giveaways : decidablesConfig.themeConfig.themes).find(d => d._id == value));

    //Announce decidable
    let sent = await message.channel.send(`New ${decidablesType}!`, embed);
    reactionEmojis.forEach(async emoji => await sent.react(emoji));
    PinguLibrary.consoleLog(message.client, `${message.author} hosted ${decidablesType} in #${decidablesChannel.name}, ${message.guild}`);

    let decidable = new Decidable(value, sent.id, new PGuildMember(message.member), decidablesChannel, endsAt);

    AddDecidableToPGuilds(params, decidable);

    if (Is(DecidablesEnum.Suggestion)) return;

    var interval = setInterval(() => UpdateTimer(), ms('5s'));
    setTimeout(() => AfterTimeOut(sent, value, winners, embed, decidable, interval, params, null), ms(time));
    function UpdateTimer() {
        sent.edit(sent.embeds[0].setDescription(
            Is(DecidablesEnum.Giveaway) || Is(DecidablesEnum.Theme) ? (
                `React with ${reactionEmojis[0]} to enter!\n` +
                `Winners: **${winners}**\n` +
                `Ends in: ${new TimeLeftObject(new Date(Date.now()), endsAt).toString()}\n` +
                `Hosted by <@${decidable.author._id}>`
            ) : Is(DecidablesEnum.Poll) ? (
                `Brought to you by <@${decidable.author._id}>\n` +
                `Time left: ${new TimeLeftObject(new Date(Date.now()), endsAt).toString()}`
            ) : sent.embeds[0].description
        )).catch(async err => {
            await PinguLibrary.errorLog(message.client, `Updating ${decidablesType.toLowerCase()} timer`, message.content, err)
            message.author.send(`I had an issue updating the ${decidablesType.toLowerCase()} message, so your ${decidablesType.toLowerCase()} might be broken!`);
        });
    }
    function Is(type: DecidablesEnum) {
        return decidablesType == type;
    }
}

async function PermissionCheckDecidable(params: DecidablesParams) {
    let { message, config, args, decidablesType, pGuild } = params;
    let pRole =
        DecidablesEnum.Giveaway == decidablesType ? (config as GiveawayConfig).hostRole :
            DecidablesEnum.Poll == decidablesType ? (config as PollConfig).pollRole : 
            DecidablesEnum.Suggestion == decidablesType ? (config as SuggestionConfig).managerRole : 
            (config as ThemeConfig).hostRole;

    if (config.firstTimeExecuted || ["reroll", "setup", "list"].includes(args[0])) return PinguLibrary.PermissionGranted;
    else if (!args[0] && !args[1]) return `You didn't give me enough arguments!`;

    await CheckRoleUpdates();

    if (decidablesType == DecidablesEnum.Suggestion) return PinguLibrary.PermissionGranted;

    if (!message.member.hasPermission(DiscordPermissions.ADMINISTRATOR as PermissionString) && pRole && !message.member.roles.cache.has(pRole._id))
        return "You don't have `Administrator` permissions" + (pRole ? ` or the \`${pRole.name}\` role` : "" + "!");

    if (decidablesType == DecidablesEnum.Giveaway && args[0].endsWith('w') && !isNaN(parseInt(args[0].substring(0, args[0].length - 1))))
        args.shift();

    else if (args[0].endsWith('s') && parseInt(args[0].substring(0, args[0].length - 1)) < 30)
        return 'Please specfify a time higher than 29s';
    else if (!ms(args[0])) return 'Please provide a valid time!';
    else if (!isNaN(parseInt(args[0].substring(args[0].length - 1, args[0].length)))) //No s,m,h provided, treat as minutes
        args[0] = args[0] + "m";

    return PinguLibrary.PermissionGranted;

    async function CheckRoleUpdates() {
        let staffPRole = pRole;
        let winnerPRole = DecidablesEnum.Giveaway ? pGuild.settings.config.decidables.giveawayConfig.winnerRole : 
            DecidablesEnum.Theme ? pGuild.settings.config.decidables.themeConfig.winnerRole : undefined;

        let winnerRole = CheckRole(winnerPRole);
        let staffRole = CheckRole(staffPRole);

        if (!winnerRole && winnerPRole != undefined || winnerPRole != undefined && winnerRole || //Winner role (doesn't) exist(s)
            !staffRole && staffPRole != undefined || staffPRole != undefined && staffRole || //Staff role (doesn't) exist(s)
            winnerPRole && winnerRole && winnerRole.name != winnerPRole.name || //Winner role's name changed
            staffPRole && staffPRole && staffRole.name != staffPRole.name) //Staff role's name changed
            await UpdatePGuild(message.client, pGuild, decidablesType, `${decidablesType.toLowerCase()} role${decidablesType == DecidablesEnum.Giveaway ? 's' : ''}`);


        function CheckRole(pRole: PRole) {
            if (!pRole) return undefined;
            return message.guild.roles.cache.find(r => r.id == pRole._id);
        }
    }
}
async function FirstTimeExecuted(params: DecidablesParams) {
    let { args, message, decidablesType, pGuild } = params;

    if (args[0] != 'setup') message.channel.send(`**Hold on fella!**\nWe need to get ${message.guild.name} set up first!`);

    if (await HasAllArguments()) return;

    let collector = message.channel.createMessageCollector(m => (m as Message).author.id == message.author.id),
        collectorCount = 0, reply = "";
        let staffRole = undefined, decidablesChannel = undefined, winnerRole = undefined, allowSameWinner = undefined;

    let staffRoleType = 
        decidablesType == DecidablesEnum.Giveaway ? 'Giveaway Host' : 
        decidablesType == DecidablesEnum.Poll ? 'Poll Host' : 
        decidablesType == DecidablesEnum.Suggestion ? 'Suggestion Manager' :
        'Theme Host';
    let decidablesChannelName = decidablesType.toLowerCase();
    let hostDone = false;

    message.channel.send(`Firstly, ${Find('Role', staffRoleType, 'Exists', message)}`);

    collector.on('collect', async input => {
        let userInput = input as Message;
        let lastInput = userInput.content.toLowerCase();

        switch (collectorCount) {
            case 0: reply = Find('Role', hostDone ? `${decidablesType} Winner` : staffRoleType, 'Tag', userInput); break;
            case 1:
                if (!hostDone) {
                    var staffRoleResult = Find('Role', hostDone ? `${decidablesType} Winner` : staffRoleType, 'Find', userInput);
                    staffRole = !["undefined", "Make"].includes(staffRoleResult) ? message.guild.roles.cache.get(staffRoleResult) : staffRoleResult;
                    reply = null;

                    if ([DecidablesEnum.Giveaway, DecidablesEnum.Theme].includes(decidablesType as DecidablesEnum)) {
                        reply = Find('Role', `${decidablesType} Winner`, 'Exists', userInput);
                        collectorCount -= 2;
                    }
                }
                else {
                    var winnerRoleResult = Find('Role', `${decidablesType} Winner`, 'Find', userInput);
                    winnerRole = !["undefined", "Make"].includes(winnerRoleResult) ? message.guild.roles.cache.get(winnerRoleResult) : winnerRoleResult;
                    reply = null;
                }

                hostDone = true;

                if (!reply) reply = Find('Channel', decidablesChannelName, 'Exists', userInput);
                break;
            case 2: reply = Find('Channel', hostDone ? `${decidablesType} Winner` : staffRoleType, 'Tag', userInput); break;
            case 3:
                var decidablesChannelResult = Find('Channel', decidablesChannelName, 'Find', userInput);
                decidablesChannel = !["undefined", "Make"].includes(decidablesChannelResult) ? message.guild.channels.cache.get(decidablesChannelResult) : decidablesChannelResult;

                //Giveaway allowSameWinner
                if (![DecidablesEnum.Giveaway, DecidablesEnum.Theme].includes(decidablesType as DecidablesEnum)) return GoodToGo({ staffRole, decidablesChannel });
                reply = `Alright last thing, should I allow same winners? (A user wins a ${decidablesType.toLowerCase()} can't win the next one, if you say no)`;
                break;
            case 4: 
                allowSameWinner = lastInput == 'yes';
                if (DecidablesEnum.Giveaway == decidablesType) return GoodToGo({ staffRole, decidablesChannel, winnerRole, allowSameWinner });
                message.channel.send(`Alright noted!`);
                reply = `Okay last thing I promise- how many previous themes' winners should I ignore? (If set to 2, the winners for the last 2 themes will not be able to win the current one) Default is 0`
                break;
            case 5: return GoodToGo({staffRole, decidablesChannel, winnerRole, allowSameWinner, ignoreLastWins: parseInt(lastInput) || 0 })
            default:
                PinguLibrary.errorLog(message.client, `Ran default in HandleDecidables, ${decidablesType}, collector.on, FirstTimeExecuted(), ${collectorCount}`, message.content);
                collector.stop("Ran default switch-case");
                return;
        }

        collectorCount++;

        if (!reply) {
            switch (collectorCount) {
                case 0: reply = `I need to know if there's a ${hostDone ? 'Giveaway Winner' : staffRoleType} role! \`Yes\` or \`no\`?`; break;
                case 1: reply = lastInput == `yes` ?
                    "Please tag the role, or send the role ID." :
                    `I need to know if you would like a **${hostDone ? 'Giveaway Winner' : staffRoleType}** role.`;
                    break;
                case 3: reply = lastInput == 'yes' ?
                    "Please tag the channel, or send the channel ID" :
                    `I need to know if you would like a channel for ${decidablesChannelName}.`;

                default: return PinguLibrary.errorLog(message.client, `Ran default in HandleDecidables, ${decidablesType}, collector.on, FirstTimeExecuted(), ${collectorCount}, !reply`, message.content);
            }
            collectorCount--;
        }
        message.channel.send(reply);
    });
    collector.on('end', async () => {
        message.channel.send(`Alright, you're all set!`);
        PinguLibrary.consoleLog(message.client, `"${message.guild.name}" was successfully sat up with *${decidablesType.toLowerCase()}.`);

        if (args[0] != 'setup') return HandleDecidables(params);
    });

    async function HasAllArguments() {
        /*
         [0]: setup
         [1]: staffRole
         [2]: channel || winnerRole
         [3]: null || channel
         [4]: null || sameWinner
         [5]: null || ignoreLastWins
         */

        if (DecidablesEnum.Giveaway == decidablesType && args.length != 5) return false; //Not enough arguments
        else if (DecidablesEnum.Theme == decidablesType && args.length != 6) return false //Not enough arguments
        else if (args.length != 3 || !isNaN(ms(args[0]))) return false; //Not enough arguments & args[0] is not ms convertable (is a number, but not 'ms' number(?))

        class T { id: string; name: string; }

        let find = (i: T, arg: string) => { return [i.id, i.name.toLowerCase(), i.toString().toLowerCase()].includes(arg) && i }
        let findRole = (argument: string) => argument == 'null' ? null : message.guild.roles.cache.find(r => find(r, argument) != null) as RoleResolvable
        let findChannel = (argument: string) => argument == 'null' ? null : message.guild.channels.cache.find(c => find(c, argument) && c.isText());

        var staffRole = findRole(args[1]);
        let channel = findChannel(args[decidablesType != DecidablesEnum.Giveaway ? 2 : 3])
        if ([DecidablesEnum.Giveaway, DecidablesEnum.Theme].includes(decidablesType as DecidablesEnum))
            await GoodToGo({ 
                staffRole, decidablesChannel: channel, 
                winnerRole: findRole(args[2]), 
                allowSameWinner: ['yes', 'true'].includes(args[4].toLowerCase()), 
                ignoreLastWins: DecidablesEnum.Theme == decidablesType && !isNaN(parseInt(args[5])) ? parseInt(args[5]) : 0 });
        else await GoodToGo({ staffRole, decidablesChannel: channel });

        message.channel.send('Setup done!');
        return true;
    }

    /**
     * @returns Response to 'Exists' & 'Create', but returns id of type || "Make" || "undefined" as final result
     */
    function Find(type: 'Role' | 'Channel', typeName: string, pinguResponse: 'Exists' | 'Tag' | 'Find', userInput: Message): string {
        let response = userInput.content.toLowerCase();
        let typeResult = null;

        switch (pinguResponse) {
            case 'Exists': return `Do you have a **${typeName}** ${type.toLowerCase()}?`;
            case 'Tag': return response == 'yes' ? `Please tag the ${type.toLowerCase()} or send the ${type.toLowerCase()} ID` : response == 'no' ? `Would you like a **${typeName}** ${type.toLowerCase()}?` : null;
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
    async function GoodToGo(params: { staffRole: RoleResolvable, decidablesChannel: GuildChannelResolvable, winnerRole?: RoleResolvable, allowSameWinner?: boolean, ignoreLastWins?: number }) {
        let { decidablesChannel, staffRole, allowSameWinner, winnerRole, ignoreLastWins } = params;
        const decidablesConfig = pGuild.settings.config.decidables;

        if (typeof staffRole == 'string' && staffRole == 'Make') staffRole = await MakeRole(message.guild, staffRoleType);
        if (typeof decidablesChannel == 'string' && decidablesChannel == 'Make') decidablesChannel = await MakeChannel(message.guild, decidablesChannelName);
        if (winnerRole && typeof winnerRole == 'string' && winnerRole == 'Make') winnerRole = await MakeRole(message.guild, "Giveaway Winner");

        let firstTimeExecuted = false;
        let channel = decidablesChannel && decidablesChannel != 'undefined' ? new PChannel(decidablesChannel as GuildChannel) : undefined;
        let managerRole = staffRole && staffRole != 'undefined' ? new PRole(staffRole as Role) : undefined;
        let finalWinnerRole = winnerRole && winnerRole != 'undefined' ? new PRole(winnerRole as Role) : undefined;

        switch (decidablesType) {
            case DecidablesEnum.Giveaway: decidablesConfig.giveawayConfig = new GiveawayConfig({
                firstTimeExecuted, allowSameWinner, channel, hostRole: managerRole,
                winnerRole: finalWinnerRole, giveaways: []
            }); break;
            case DecidablesEnum.Poll: decidablesConfig.pollConfig = new PollConfig({
                firstTimeExecuted, channel, pollRole: managerRole, polls: []
            }); break;
            case DecidablesEnum.Suggestion: decidablesConfig.suggestionConfig = new SuggestionConfig({
                firstTimeExecuted, channel, managerRole, suggestions: []
            }); break;
            case DecidablesEnum.Theme: decidablesConfig.themeConfig = new ThemeConfig({
                firstTimeExecuted, allowSameWinner, ignoreLastWins, channel, hostRole: managerRole,
                winnerRole: finalWinnerRole, themes: []
            }); break;
        }

        await UpdatePGuild(message.client, pGuild, decidablesType, `**${pGuild.name}**'s ${decidablesType}Config after setting it up`);

        collector.stop('Setup done');

        PinguLibrary.AchievementCheck(message.client, {
            user: message.author,
            guild: message.guild,
            guildMember: message.member
        }, 'CHANNEL' as any, decidablesType, [message.channel]);

        return decidablesType == DecidablesEnum.Giveaway ? decidablesConfig.giveawayConfig :
            decidablesType == DecidablesEnum.Poll ? decidablesConfig.pollConfig : 
                decidablesType == DecidablesEnum.Suggestion ? decidablesConfig.suggestionConfig :
                decidablesConfig.themeConfig;

        async function MakeRole(guild: Guild, name: string): Promise<Role> {
            return guild.roles.create({
                data: { name },
                reason: `Auto-created when setting up ${decidablesType.toLowerCase()}`
            }).catch(err => {
                PinguLibrary.errorLog(message.client, `Creating ${name} role`, message.content, err)
                return null;
            });
        }
        async function MakeChannel(guild: Guild, name: string): Promise<TextChannel> {
            return guild.channels.create(name, {
                reason: `Auto-created when setting up ${decidablesType.toLowerCase()}`
            }).catch(err => {
                PinguLibrary.errorLog(message.client, `Creating ${name} channel`, message.content, err)
                return null;
            });
        }
    }
}
async function ListDecidables(params: DecidablesParams, decidables: Decidable[]) {
    let { pGuild, listEmojis, decidablesType, message, pGuildClient } = params;
    let embeds = CreateEmbeds(false), embedIndex = 0;

    if (!decidables.length || !embeds.length) return message.channel.send(`There are no ${decidablesType.toLowerCase()} saved!`);

    var sent = await message.channel.send(embeds[embedIndex]);
    listEmojis.forEach(e => sent.react(e));
    if (decidablesType == DecidablesEnum.Suggestion) listEmojis[1] = 'Checkmark';

    const reactionCollector = sent.createReactionCollector((reaction: MessageReaction, user: User) =>
        listEmojis.includes(reaction.emoji.name) && user.id == message.author.id, { time: ms('20s') });

    reactionCollector.on('end', async reactionsCollected => {
        if (!reactionsCollected.array().map(r => r.emoji.name).includes('🛑')) {
            await sent.delete();
            message.channel.send(`Stopped showing ${decidablesType.toLowerCase()}.`).then(sent => sent.delete({ timeout: 5000 }));
        }
    });
    reactionCollector.on('collect', async reaction => {
        let decidable = decidables.find(d => d._id == (
            [DecidablesEnum.Giveaway, DecidablesEnum.Theme].includes(decidablesType as DecidablesEnum) ?
                reaction.message.embeds[0].fields[0].value :
                reaction.message.embeds[0].description.substring(4, reaction.message.embeds[0].description.length)
        ));

        reactionCollector.resetTimer({ time: ms('20s') });
        switch (reaction.emoji.name) {
            case '⬅️': var embedToSend = await ReturnEmbed(-1); break;
            case 'Checkmark': case '❌':
                if (decidablesType != DecidablesEnum.Suggestion) {
                    embedToSend = sent.embeds[0];
                    break;
                }
                decidables = await Decide(params, reaction.emoji.name != '❌', decidable as Suggestion, message.member);
                CreateEmbeds(true);
                embedToSend = await ReturnEmbed(1);
                break;
            case '🗑️': embedToSend = await ReturnEmbed(0); break;
            case '➡️': embedToSend = await ReturnEmbed(1); break;
            case '🛑': reactionCollector.stop(); return;
            default:
                PinguLibrary.errorLog(message.client, `${decidablesType.toLowerCase()}, ListDecidables(), reactionCollector.on() default case: ${reaction.emoji.name}`, message.content);
                embedToSend = reaction.message.embeds[0];
                break;
        }

        if (!decidables.length || !embedToSend) {
            message.channel.send(`No more ${decidablesType.toLowerCase()}s to find!`);
            return reactionCollector.stop();
        }

        await sent.edit(embedToSend.setFooter(`Now viewing: ${embedIndex + 1}/${embeds.length}`));
        sent.reactions.cache.forEach(r => {
            if (r.users.cache.size > 1)
                r.users.cache.forEach(async user => {
                    if (user.id != message.client.user.id)
                        await r.users.remove(user);
                })
        })

        async function ReturnEmbed(index: number) {
            if (!embeds) return null;

            embedIndex += index;
            if (embedIndex <= 1) {
                embedIndex = embeds.length - 1;
                index = -1;
            }
            else if (embedIndex >= embeds.length) {
                embedIndex = 0;
                index = 1;
            }

            if (index == 0) return await DeleteDecidable(embeds[embedIndex]);
            return embeds[embedIndex];
        }
        async function DeleteDecidable(embed: MessageEmbed) {
            const deletingDecidable = decidables.find(d => d._id == (
                decidablesType == DecidablesEnum.Suggestion ?
                    reaction.message.embeds[0].description.substring(4, reaction.message.embeds[0].description.length) :
                    reaction.message.embeds[0].fields[0].value
            ));
            decidables = await RemoveDecidables(message, pGuild, decidablesType, [deletingDecidable]);
            embeds = CreateEmbeds(true);

            return !decidables.includes(decidable) ?
                await DoTheEmojiThing('✅', 1) :
                await DoTheEmojiThing('❌', -1);

            async function DoTheEmojiThing(emote: '✅' | '❌', index: 1 | -1) {
                await sent.react(emote);
                setTimeout(async () => await sent.reactions.cache.find(r => r.emoji.name == emote).remove(), 1500);
                return await ReturnEmbed(index);
            }
        }
    });

    function CreateEmbeds(autocalled: boolean) {
        let embeds = new Array<MessageEmbed>(), ToRemove = new Array<Decidable>();

        if (!decidables.length) return null;

        for (var i = 0; i < decidables.length; i++) {
            try {
                embeds[i] = ([DecidablesEnum.Giveaway, DecidablesEnum.Theme].includes(decidablesType as DecidablesEnum) ? CreateGiveawayEmbed(decidables[i] as Giveaway) :
                    decidablesType == DecidablesEnum.Poll ? CreatePollEmbed(decidables[i] as Poll) : CreateSuggestionEmbed(decidables[i] as Suggestion))
                    .setColor(pGuildClient.embedColor)
                    .setFooter(`Now viewing: ${i + 1}/${decidables.length}`);
            } catch (err) { PinguLibrary.errorLog(message.client, `Error while adding ${decidablesType.toLowerCase()} to embeds`, message.content, err); ToRemove.push(decidables[i]); }
        }
        RemoveDecidables(message, pGuild, decidablesType, ToRemove);
        if (!embeds && !autocalled) return null;
        return embeds;

        function CreateGiveawayEmbed(g: Giveaway) {
            const winners = g.winners.map(pg => `<@${pg._id}>`).join(", ") || "No winners",
                host = `<@${g.author._id}>`;
            return new MessageEmbed()
                .setTitle(g.value)
                .setDescription(`**__Winner(s)__**\n` + winners)
                .addField(`ID`, g._id, true)
                .addField(`Host`, host, true)
        }
        function CreatePollEmbed(p: Poll) {
            return new MessageEmbed()
                .setTitle(p.value)
                .setDescription(`ID: ${p._id}`)
                .addField(`Verdict`, p.approved, true)
                .addField(`Host`, `<@${p.author._id}>`, true)
        }
        function CreateSuggestionEmbed(s: Suggestion) {
            return new MessageEmbed()
                .setTitle(s.value)
                .setDescription(`ID: ${s._id}`)
                .addFields([
                    new EmbedField(`Verdict`, `${(s.approved == 'Approved' ? GetCheckMark() : s.approved == 'Denied' ? '❌' : '🤷')}` + s.approved, true),
                    new EmbedField(`Suggested By`, `<@${s.author._id}>`, true),
                    s.approved != 'Undecided' ? new EmbedField(`Decided By`, `<@${s.decidedBy._id}>`, true) : EmbedField.Blank(true)
                ]);
        }
    }
}

async function AfterTimeOut(sent: Message, value: string, amountOfWinners: number, embed: MessageEmbed, decidable: Decidable, interval: NodeJS.Timeout, params: DecidablesParams, previousWinner: GuildMember) {
    clearInterval(interval);
    let { decidablesType, pGuild, message } = params;
    const decidablesConfig = pGuild.settings.config.decidables;

    if (decidablesType == DecidablesEnum.Poll) DecidePoll(decidable as Poll);
    else GetGiveawayWinner(decidablesType == DecidablesEnum.Giveaway ? decidable as Giveaway : decidable as Theme);

    SaveVerdictToPGuilds(params, decidable);
    PinguLibrary.consoleLog(sent.client, `Updated ${decidablesType.toLowerCase()} "${decidable._id}" after timeout.`);

    function DecidePoll(poll: Poll) {
        poll = Poll.Decide(
            poll,
            sent.reactions.cache.get('👍').count,
            sent.reactions.cache.get('👎').count
        );

        //Submitting Verdict
        sent.channel.send(`The poll of "**${poll.value}**", voted **${poll.approved}**!`);

        sent.edit(embed
            .setTitle(`FINISHED!: ${poll.value}`)
            .setDescription(`Voting done! Final answer: ${poll.approved}`)
            .setFooter(`Poll Ended.`)
        );
    }
    async function GetGiveawayWinner(decidable: Giveaway | Theme) {
        const creator = sent.guild.member(decidable.author._id);
        const config = decidablesType == DecidablesEnum.Giveaway ? decidablesConfig.giveawayConfig : decidablesConfig.themeConfig,
            winnerRole = config.winnerRole,
            allowSameWinner = config.allowSameWinner;
        let winners = new Array<GuildMember>();

        try { var peopleReacted = (await sent.reactions.cache.get(`${params.reactionEmojis[0]}`).users.fetch()).array(); }
        catch (err) {
            await PinguLibrary.errorLog(sent.client, `Fetching ${params.reactionEmojis[0]} reactions from ${decidablesType.toLowerCase()}`, sent.content, err);
            var GiveawayCreatorDM = await creator.createDM();
            GiveawayCreatorDM.send(`Hi! I ran into an issue while finding a winner for your ${decidablesType.toLowerCase()} "${value}"... I've already contacted my developers!`);
        }

        let members = await sent.guild.members.fetch({ user: peopleReacted });

        peopleReacted = peopleReacted.filter(user =>
            !user.bot && //Not bot
            allowSameWinner != null && ( //allowSameWinner exists
                allowSameWinner || //Allow same winner
                winnerRole && //Winner role exists
                !members.get(user.id).roles.cache.has(winnerRole._id) && //Don't allow same winner and user doesn't have winner role
                (decidablesType == DecidablesEnum.Theme && ( //decidableType is theme & not giveaway
                    (config as ThemeConfig).themes
                        .filter((_, i, themes) => themes.length - i < (config as ThemeConfig).ignoreLastWins) //Get last .ignoreLastWins themes
                        .map(theme => theme.winners) //Convert from theme to PGuildMember[]
                        .find((_, __, arr) => {
                            let previousWinners = new Array<PGuildMember>(); //All previous winners go here
                            arr.forEach(winners => winners.forEach(winner => previousWinners.push(winner))); //Set previousWinners data
                            return !previousWinners.map(pgm => pgm._id).includes(user.id); //If array of previousWinner IDs has user's id, return false
                        })
                ) || true)
            ));

        // While there's no winner
        for (var i = 0; i < amountOfWinners; i++) {
            var winner = FindWinner();
            while (!winner || previousWinner && previousWinner.id == (winner as User).id)
                winner = FindWinner();

            //Winner not found
            if (typeof winner == 'string' && winner == `A winner couldn't be found!`) winner = "no one";
            winners[i] = sent.guild.member(winner as User);
            peopleReacted.splice(peopleReacted.indexOf(winner as User), 1);
        }

        if (winner == `no one` || !winners.length || !winners[0]) {
            sent.edit(embed
                .setTitle(`Unable to find a winner for "${value}"!`)
                .setDescription(`Winner not found!`)
                .setFooter(`Giveaway ended.`)
            );
            return sent.channel.send(`A winner to "**${value}**" couldn't be found!`);
        }

        let WinnerArrStringed = winners.join(' & ');

        //Announce Winner
        var WinnerMessage = await sent.channel.send(`The winner of "**${value}**" is no other than ${WinnerArrStringed}! Congratulations!`)
        WinnerMessage.react(PinguLibrary.getEmote(sent.client, 'hypers', PinguLibrary.SavedServers.get('Pingu Support')));

        RemovePreviousWinners(sent.guild.members.cache.filter(Member => Member.roles.cache.has(winnerRole._id)).array());

        let gCreatorMessage = '';
        for (var i = 0; i < winners.length; i++) {
            await sent.guild.member(winners[i]).roles.add(winnerRole._id)
                .catch(async err => {
                    if (err != `TypeError [INVALID_TYPE]: Supplied roles is not a Role, Snowflake or Array or Collection of Roles or Snowflakes.`) {
                        await PinguLibrary.errorLog(sent.client, `Unable to give <@${(winner as User).id}> "${sent.guild.name}"'s Giveaway Winner Role, ${winnerRole.name} (${winnerRole._id})`, message.content, err);
                        creator.user.send(`I couldn't give <@${(winner as User).id}> a ${decidablesType} Winner role! I have already notified my developers.`);
                    }
                    //`Please give me a role above the Giveaway Winner role, or move my role above it!`
                });
            gCreatorMessage += `<@${winners[i].id}> & `;
        }
        creator.user.send(gCreatorMessage.substring(0, gCreatorMessage.length - 3) + ` won your ${decidablesType.toLowerCase()}, "**${value}**" in **${sent.guild.name}**!\n${sent.url}`)

        //Edit embed to winner
        sent.edit(embed
            .setTitle(`Winner of "${value}"!`)
            .setDescription(`${(winners.length == 1 ? `Winner` : `Winners`)}: ${WinnerArrStringed}\nHosted by: ${creator.user}`)
            .setFooter(`${decidablesType} ended.`)
        ).catch(err => PinguLibrary.errorLog(sent.client, `Editing the ${decidablesType} Message`, sent.content, err)
            .then(() => creator.user.send(`I had an error while updating the original ${decidablesType.toLowerCase()} message... I've already notified my developers!`))
        );

        await UpdatePGuildWinners();

        function FindWinner() {
            let winner = SelectWinner();

            if (typeof winner == 'string') return winner;

            // If PreviousWinner roles don't exist
            if (!winnerRole) message.author.send(`I couldn't find a "${decidablesType} Winner(s)" role!\nI have selected a random winner from everyone.`);

            return winners.includes(sent.guild.member(winner)) ? null : winner;

            function SelectWinner() {
                if (!peopleReacted.length) return `A winner couldn't be found!`;

                let winner = peopleReacted[Math.floor(Math.random() * peopleReacted.length)];

                if (!winnerRole) return winner;
                else if (message.guild.member(winner).roles.cache.has(winnerRole._id))
                    return config.allowSameWinner ? winner : null;
                return winner;
            }
        }
        function RemovePreviousWinners(WinnerArray: GuildMember[]) {
            for (var x = 0; x < WinnerArray.length; x++)
                WinnerArray[x].roles.remove(winnerRole._id);
        }
        async function UpdatePGuildWinners() {
            for (var i = 0; i < winners.length; i++) {
                decidable.winners.push(new PGuildMember(sent.guild.member(winners[i])));
            }
        }
    }
}
async function RemoveDecidables(message: Message, pGuild: PinguGuild, type: DecidablesTypes, decidables: Decidable[]) {
    if (!decidables || !decidables.length || !decidables[0]) return;
    const decidablesConfig = pGuild.settings.config.decidables;

    decidables.forEach(d => 
        type == DecidablesEnum.Giveaway ? decidablesConfig.giveawayConfig.giveaways.splice(decidablesConfig.giveawayConfig.giveaways.indexOf(d as Giveaway), 1) :
        type == DecidablesEnum.Poll ? decidablesConfig.pollConfig.polls.splice(decidablesConfig.pollConfig.polls.indexOf(d as Poll), 1) :
        type == DecidablesEnum.Suggestion ? decidablesConfig.suggestionConfig.suggestions.splice(decidablesConfig.suggestionConfig.suggestions.indexOf(d as Suggestion), 1) :
        decidablesConfig.themeConfig.themes.splice(decidablesConfig.themeConfig.themes.indexOf(d as Theme), 1));

    PinguLibrary.consoleLog(message.client, `The ${type}, ${decidables[0].value} (${decidables[0]._id}) was removed.`);

    await UpdatePGuild(message.client, pGuild, type, `Removing ${decidables.length} ${type}s from **${message.guild.name}**'s ${type} list.`)

    switch (type) {
        case DecidablesEnum.Giveaway: return decidablesConfig.giveawayConfig.giveaways as Decidable[];
        case DecidablesEnum.Poll: return decidablesConfig.pollConfig.polls as Decidable[];
        case DecidablesEnum.Suggestion: return decidablesConfig.suggestionConfig.suggestions as Decidable[];
        case DecidablesEnum.Theme: return decidablesConfig.themeConfig.themes as Decidable[];
    }
}

async function Reroll(params: DecidablesParams, embed: MessageEmbed, decidable: Giveaway | Theme) {
    let { message, args, decidablesType } = params;
    
    if (!args[1]) return message.edit(`${decidablesType.toLowerCase()} message not found - please provide with a message ID`);

    let previousMessage = message.channel.messages.cache.find(premsg => premsg.id == args[1]);
    if (!previousMessage) {
        previousMessage = message.channel.messages.cache.find(premsg => premsg.id == args[1].split('/')[6]);
        if (!previousMessage)
            return message.author.send(`Unable to parse ${args[1]} as ID, or message can't be found!`);
        else if (!previousMessage.embeds[0])
            return message.author.send(`I couldn't find the ${decidablesType.toLowerCase()} embed from that message link!`);
    }

    return await AfterTimeOut(
        previousMessage,
        decidable.value,
        decidable.winners.length || 1,
        embed,
        decidable,
        null,
        params,
        message.guild.members.cache.get(decidable.winners[0]._id)
    );
}
async function Decide(params: DecidablesParams, approved: boolean, suggestion: Suggestion, decidedBy: GuildMember) {
    suggestion = Suggestion.Decide(suggestion, approved, new PGuildMember(decidedBy));

    UpdateSuggestionEmbed(decidedBy.guild.channels.cache.get(suggestion.channel._id) as TextChannel);

    return await SaveVerdictToPGuilds(params, suggestion as Decidable);

    async function UpdateSuggestionEmbed(channel: TextChannel) {
        let fetchedMessage = await channel.messages.fetch(suggestion._id);
        return fetchedMessage.embeds[0].setFooter(`Suggestion was ${suggestion.value} by <@${suggestion.author._id}>`);
    }
}
function GetCheckMark() {
    return PinguLibrary.SavedServers.get('Danho Misc').emojis.cache.find(e => e.name == 'Checkmark');
}

async function UpdatePGuild(client: Client, pGuild: PinguGuild, decidableType: DecidablesTypes, reason: string) {
    return PinguGuild.Update(client, ['settings'], pGuild, 
        `HandleDecidables: ${decidableType}`, reason
    );
}
async function SaveVerdictToPGuilds(params: DecidablesParams, decidable: Decidable) {
    let { pGuild, message, decidablesType } = params;
    const decidablesConfig = pGuild.settings.config.decidables;
    const arr = (
        decidablesType == DecidablesEnum.Giveaway ? decidablesConfig.giveawayConfig.giveaways : 
        decidablesType == DecidablesEnum.Poll ? decidablesConfig.pollConfig.polls : 
        decidablesType == DecidablesEnum.Suggestion ? decidablesConfig.suggestionConfig.suggestions : 
        decidablesConfig.themeConfig.themes) as Decidable[];

    const thisDecidableMan = arr.find(d => d._id == decidable._id);
    arr[arr.indexOf(thisDecidableMan)] = decidable;

    await UpdatePGuild(message.client, pGuild, decidablesType, `Saved the verdict for "${decidable.value}" to ${message.guild.name} PinguGuild.`);

    switch (decidablesType) {
        case DecidablesEnum.Giveaway: return decidablesConfig.giveawayConfig.giveaways as Decidable[];
        case DecidablesEnum.Poll: return decidablesConfig.pollConfig.polls as Decidable[];
        case DecidablesEnum.Suggestion: return decidablesConfig.suggestionConfig.suggestions as Decidable[];
        case DecidablesEnum.Theme: return decidablesConfig.themeConfig.themes as Decidable[];
    }
}
async function AddDecidableToPGuilds(params: DecidablesParams, decidable: Decidable) {
    const { message, pGuild, decidablesType } = params;
    const decidablesConfig = pGuild.settings.config.decidables;


    switch (decidablesType) {
        case DecidablesEnum.Giveaway: decidablesConfig.giveawayConfig.giveaways.push(decidable as Giveaway);
        case DecidablesEnum.Poll: decidablesConfig.pollConfig.polls.push(decidable as Poll);
        case DecidablesEnum.Suggestion: decidablesConfig.suggestionConfig.suggestions.push(decidable as Suggestion);
        case DecidablesEnum.Theme: decidablesConfig.themeConfig.themes.push(decidable as Theme);
    }

    return await UpdatePGuild(message.client, pGuild, decidablesType, `New ${decidablesType.toLowerCase()} was added  to **${message.guild.name}**'s PinguGuild.`);
}