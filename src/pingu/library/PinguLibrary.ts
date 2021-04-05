﻿import {
    Client, Collection, Guild, GuildChannel, Message, 
    MessageAttachment, MessageEmbed, MessageReaction,
    User, PermissionString, Snowflake, TextChannel, GuildMember
} from 'discord.js';

import * as fs from 'fs';
import * as request from 'request';

import { PClient } from "../../database";
import { Error, DiscordPermissions, BitPermission } from '../../helpers';

//#region Permissions
interface Check {
    author: User,
    channel: GuildChannel,
    client: Client,
    content?: string
}
export const PermissionGranted = "Permission Granted";
export function PermissionCheck(check: Check, ...permissions: PermissionString[]) {
    if (permissions[0].length == 1) {
        PinguLibrary.errorLog(check.client, `Permissions not defined correctly!`, check.content);
        return "Permissions for this script was not defined correctly!";
    }

    for (var x = 0; x < permissions.length; x++) {
        var permString = permissions[x].toLowerCase().replace('_', ' ');

        if (!checkPermisson(check.channel, check.client.user, permissions[x]))
            return `I don't have permission to **${permString}** in ${check.channel.name}.`;
        else if (!checkPermisson(check.channel, check.author, permissions[x]) &&
            (PinguLibrary.isPinguDev(check.author) && ToPinguClient(check.client).config.testingMode || !this.isPinguDev(check.author)))
            return `<@${check.author.id}> you don't have permission to **${permString}** in #${check.channel.name}.`;
    }
    return PermissionGranted;

    function checkPermisson(channel: GuildChannel, user: User, permission: PermissionString) {
        return channel.permissionsFor(user).has(permission);
    }
}
export function Permissions(): {
    given: BitPermission[],
    missing: BitPermission[],
    all: BitPermission[]
} {
    //let all = Array.from(getPermissions()).reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    let givenStrings = [
        'MANAGE_ROLES',
        'MANAGE_CHANNELS',
        'CHANGE_NICKNAME',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'MANAGE_EMOJIS',
        'READ_MESSAGE_HISTORY',
        'USE_EXTERNAL_EMOJIS',
        'ADD_REACTIONS',
        'CONNECT',
        'SPEAK',
        'USE_VAD',
        'VIEW_AUDIT_LOG'
    ] as PermissionString[];

    let given = [], missing = [], all = [];
    for (var perm of Array.from(getPermissions())) {
        let permObj = new BitPermission(perm[0], perm[1]);

        if (givenStrings.includes(perm[0]))
            given.push(permObj);
        else missing.push(permObj);
        all.push(permObj);
    }

    return { given, missing, all };

    function getPermissions() {
        let temp = new Map<PermissionString, number>();
        let bits = getBitValues();
        for (var prop in DiscordPermissions) {
            temp.set(prop as PermissionString, bits.find(bits => bits.permString == prop).bit);
        }
        return temp;
    }
    function getBitValues() {
        let permissions = Object.keys(DiscordPermissions)
            .map(permString => new BitPermission(permString, 0))

        for (var i = 0; i < permissions.length; i++)
            permissions[i].bit = i == 0 ? 1 : permissions[i - 1].bit * 2;

        return permissions;
    }
}
//#endregion

//#region Servers
export const PinguSupportInvite = `https://discord.gg/gbxRV4Ekvh`;
export const SavedServers = {
    DanhoMisc(client: Client) {
        return getServer(client, '460926327269359626');
    },
    PinguSupport(client: Client) {
        return getServer(client, '756383096646926376');
    },
    PinguEmotes(client: Client) {
        return getServer(client, '791312245555855401');
    },
    DeadlyNinja(client: Client) {
        return getServer(client, '405763731079823380');
    }
}
export function getServer(client: Client, id: string) {
    return client.guilds.cache.find(g => g.id == id);
}
export async function getSharedServers(client: Client, user: User) {
    let servers = new Array<Guild>();
    for (var guild of client.guilds.cache.array()) {
        if (await guild.members.fetch(user))
            servers.push(guild);
    }
    return servers;
}
//#endregion

//#region Developers
type DeveloperNames = 'Danho' | 'SynthySytro' | 'Slothman' | 'DefilerOfCats';
class Developer {
    constructor(name: DeveloperNames, id: Snowflake) {
        this.name = name;
        this.id = id;
    }

    public name: DeveloperNames;
    public id: Snowflake;
}
const developers = [
    new Developer('Danho', '245572699894710272'),
    new Developer('SynthySytro', '405331883157880846'),
    new Developer('Slothman', '290131910091603968'),
    new Developer('DefilerOfCats', '803903863706484756')
];

export const Developers = new Collection<DeveloperNames, User>();
export async function CacheDevelopers(client: Client): Promise<Collection<DeveloperNames, User>> {
    for (const developer of developers) {
        let user = await client.users.fetch(developer.id);
        Developers.set(developer.name, user);
    }
    return Developers;
}
export function isPinguDev(user: User): boolean {
    return Developers.get(developers.find(dev => dev.id == user.id).name) != null;
}
//#endregion

//#region Channels
export function getTextChannel(client: Client, guildID: string, channelName: string) {
    var guild = client.guilds.cache.find(guild => guild.id == guildID);
    if (!guild) {
        console.error(`Unable to get guild from ${guildID}`);
        return null;
    }
    var channel = guild.channels.cache.find(channel => channel.name == channelName);
    if (!channel) {
        console.error(`Unable to get channel from ${channelName}`);
        return null;
    }
    return channel as TextChannel;
}
export async function outages(client: Client, message: string) {
    var outageChannel = getTextChannel(client, '756383096646926376', 'outages');
    if (!outageChannel) return DanhoDM(`Couldn't get #outage channel in Pingu Support, ${PinguLibrary.PinguSupportInvite}`);
    consoleLog(client, message);
    let sent = await outageChannel.send(message);
    return sent.crosspost();
}
export async function DanhoDM(message: string) {
    console.error(message);

    let Danho = Developers.get('Danho');
    if (!Danho) return;

    return (await Danho.createDM()).send(message);
}
//#endregion

//#region Log Channels
export const errorCache = new Collection<number, Message[]>();
import { PinguCommandParams } from "../handlers/PinguCommand";
interface ErrorLogParams { 
    params?: PinguCommandParams | {}, 
    trycatch?: {}
    additional?: {}
}
type errorLogParams = ErrorLogParams
export async function errorLog(client: Client, message: string, messageContent?: string, err?: Error, params: errorLogParams = {}) {
    //Get #error-log
    var errorlogChannel = getTextChannel(client, SavedServers.PinguSupport(client).id, 'error-log-⚠');
    if (!errorlogChannel) return DanhoDM(`Unable to find #error-log-⚠️ in Pingu Support, ${PinguSupportInvite}`);
    
    let errorDir = './errors';
    let errorID = fs.readdirSync(errorDir).filter(file => file.endsWith('.json')).length;
    
    //Write or append to errorfile
    let errorFilePath = `${errorDir}/${errorID}.json`;
    fs.writeFile(errorFilePath, JSON.stringify({ err, params }, null, 2), () => consoleLog(client, `Created error file for error #${errorID}.`));

    //Send and react
    let sent = await sendMessage(getErrorMessage(message, messageContent, err));
    let paramsSent = await sendMessage("```\n[Parameters]:\n" + JSON.stringify(params, null, 2) + "\n```").catch(async err => {
        if (err.message.includes('Must be 2000 or fewer in length'))
            return await errorlogChannel.send(new MessageAttachment(errorFilePath, `Error ${errorID}.json`));
    })

    //Add to errorCache
    errorCache.set(errorID, [sent, paramsSent]);

    //Send original errror message
    return sent;

    function getErrorMessage(message: string, messageContent?: string, err?: Error) {
        let result = {
            errorID: `Error #${errorID}\n`,
            format: "```\n",
            providedMessage: `[Provided Message]\n${message}\n\n`,
            errorMessage: `[Error message]: \n${err && err.message}\n\n`,
            messageContent: `[Message content]\n${messageContent}\n\n`,
            stack: `[Stack]\n${err && err.stack}\n\n\n`,
        };

        let returnMessage = (
            result.errorID +
            result.format +
            result.providedMessage +
            (messageContent ? result.messageContent : "") +
            (err ? result.errorMessage + result.stack : "") +
            result.format
        );

        consoleLog(client, returnMessage);
        return returnMessage
    }
    async function sendMessage(content: string) {
        console.error(content.includes('`') ? content.replace('`', ' ') : content);

        let sent = await errorlogChannel.send(content);
        await sent.react(SavedServers.DanhoMisc(client).emojis.cache.find(e => e.name == 'Checkmark')); //Mark as solved
        await sent.react('📄'); //Get error file
        
        //Create reaction handler
        sent.createReactionCollector(() => true).on('collect', async (reaction, user) => {
            if (!isPinguDev(user) || !reaction.users.cache.has(client.user.id)) return reaction.remove();

            if (reaction.emoji.name == '📄') {
                let fileMessage = await reaction.message.channel.send(new MessageAttachment(errorFilePath, `Error ${errorID}.json`));
                return errorCache.set(errorID, [...errorCache.get(errorID), fileMessage]);
            }

            errorCache.get(errorID).forEach(m => m.delete({ reason: `Error #${errorID}, was marked as solved by ${user.tag}` }));

            fs.unlink(errorFilePath, () => consoleLog(client, `Deleted error #${errorID}.`));
        })
        
        return sent;
    }
}
export async function pGuildLog(client: Client, script: string, message: string, err?: Error) {
    var pinguGuildLog = PinguLibrary.getTextChannel(client, PinguLibrary.SavedServers.PinguSupport(client).id, "pingu-guild-log-🏡");
    if (!pinguGuildLog) return PinguLibrary.DanhoDM(`Couldn't get #pingu-guild-log-🏡 in Pingu Support, ${PinguLibrary.PinguSupportInvite}`)

    if (err) {
        var errorLink = (await errorLog(client, `PinguGuild Error: "${message}"`, null, err) as Message).url;
        return pinguGuildLog.send(`[**Failed**] [**${script}**]: ${message}\n${err.message}\n\n${errorLink}\n\n<@&756383446871310399>`);
    }
    return pinguGuildLog.send(`[**Success**] [**${script}**]: ${message}`);
}
export async function pUserLog(client: Client, script: string, message: string, err?: Error) {
    var pinguUserLog = PinguLibrary.getTextChannel(client, PinguLibrary.SavedServers.PinguSupport(client).id, "pingu-user-log-🧍");
    if (!pinguUserLog) return PinguLibrary.DanhoDM(`Couldn't get #pingu-user-log-🧍 in Pingu Support, ${PinguLibrary.PinguSupportInvite}`)

    if (err) {
        var errorLink = (await errorLog(client, `PinguUser Error (**${script}**): "${message}"`, null, err) as Message).url;
        return pinguUserLog.send(`[**Failed**] [**${script}**]: ${message}\n${err.message}\n\n${errorLink}\n\n<@&756383446871310399>`);
    }
    return pinguUserLog.send(`[**Success**] [**${script}**]: ${message}`);
}
export async function consoleLog(client: Client, message: string) {
    let timeFormat = `[${new Date(Date.now()).toLocaleTimeString()}]`;
    console.log(`${timeFormat} ${message}`);

    let consoleLogChannel = PinguLibrary.getTextChannel(client, PinguLibrary.SavedServers.PinguSupport(client).id, "console-log-📝");
    if (!consoleLogChannel) return PinguLibrary.DanhoDM(`Unable to find #console-log-📝 in Pingu Support, ${PinguLibrary.PinguSupportInvite}`);

    consoleLogChannel.send(message);
}

import { LoggedCache } from "../handlers";
import { ToPinguClient } from '../client/PinguClient';
export async function eventLog(client: Client, content: MessageEmbed) {
    if (!ToPinguClient(client).isLive) return;

    let eventLogChannel = getTextChannel(client, SavedServers.PinguSupport(client).id, "event-log-📹");
    if (!eventLogChannel) return DanhoDM(`Couldn't get #event-log-📹 channel in Pingu Support, ${PinguLibrary.PinguSupportInvite}`)

    let lastCache = LoggedCache[0];
    if (lastCache && (
        lastCache.description && lastCache.description == content.description ||
        lastCache.fields[0] && content.fields[0] && lastCache.fields[0].value == content.fields[0].value)
    ) return;

    LoggedCache.unshift(content);
    return await eventLogChannel.send(content);
}
export async function achievementLog(client: Client, achievementEmbed: MessageEmbed) {
    const achievementChannel = getTextChannel(client, SavedServers.PinguSupport(client).id, 'achievement-log-🏆');
    if (!achievementChannel) return DanhoDM(`Couldn't get #achievement-log-🏆 channel in Pingu Support, ${PinguSupportInvite}`);

    return achievementChannel.send(achievementEmbed);
}
export async function tellLog(client: Client, sender: User, reciever: User, message: Message | MessageEmbed) {
    if (!ToPinguClient(client).isLive) return;

    var tellLogChannel = getTextChannel(client, SavedServers.PinguSupport(client).id, 'tell-log-💬');
    if (!tellLogChannel) return DanhoDM(`Couldn't get #tell-log-💬 channel in Pingu Support, ${PinguLibrary.PinguSupportInvite}`)

    if ((message as object).constructor.name == "Message") {
        var messageAsMessage = message as Message;
        var consoleLogValue =
            messageAsMessage.content ? `${sender.username} sent a message to ${reciever.username} saying ` :
                messageAsMessage.attachments.array().length == 1 ? `${sender.username} sent a file to ${reciever.username}` :
                    messageAsMessage.attachments.array().length > 1 ? `${sender.username} sent ${messageAsMessage.attachments.array().length} files to ${reciever.username}` :
                        `${sender.username} sent something unknown to ${reciever.username}!`;

        if (messageAsMessage.content) consoleLogValue += messageAsMessage.content;
        if (messageAsMessage.attachments) consoleLogValue += messageAsMessage.attachments.map(a => `\n${a.url}`);

        consoleLog(client, consoleLogValue);

        var format = (ping: boolean) => `${new Date(Date.now()).toLocaleTimeString()} [<@${(ping ? sender : sender.username)}> ➡️ <@${(ping ? reciever : reciever.username)}>]`;

        if (messageAsMessage.content && messageAsMessage.attachments)
            tellLogChannel.send(format(false) + `: ||${messageAsMessage.content}||`, messageAsMessage.attachments.array())
                .then(sent => sent.edit(format(true) + `: ||${messageAsMessage.content}||`));

        else if (messageAsMessage.content)
            tellLogChannel.send(format(false) + `: ||${messageAsMessage.content}||`)
                .then(sent => sent.edit(format(true) + `: ||${messageAsMessage.content}||`));

        else if (messageAsMessage.attachments)
            tellLogChannel.send(format(false), messageAsMessage.attachments.array())
                .then(sent => sent.edit(format(true)));

        else errorLog(client, 
            `${sender} ➡️ ${reciever} sent something that didn't have content or attachments`, 
            (message as object).constructor.name == 'Message' ? (message as Message).content : (message as MessageEmbed).description,
            null, {
                params: { client, sender, reciever, message },
                additional: { tellLogChannel, consoleLogValue }
            }).then(() => tellLogChannel.send(`Ran else statement - I've contacted my developers!`));
    }
    else if ((message as MessageEmbed).constructor.name == "MessageEmbed") {
        consoleLog(client, `The link between ${sender.username} & ${reciever.username} was unset.`);
        tellLogChannel.send(message as MessageEmbed)
    }
}
export async function latencyCheck(message: Message) {
    //Get latency
    let pingChannel = getTextChannel(message.client, SavedServers.PinguSupport(message.client).id, "ping-log-🏓");
    if (!pingChannel) return DanhoDM(`Couldn't get #ping-log-🏓 channel in Pingu Support, ${PinguSupportInvite}`)

    if (message.channel == pingChannel || message.author.bot) return null;

    let pingChannelSent = await pingChannel.send(`Calculating ping`);

    let latency = pingChannelSent.createdTimestamp - message.createdTimestamp;
    pingChannelSent.edit(latency + 'ms');

    //Get outages channel
    let outages = getTextChannel(message.client, SavedServers.PinguSupport(message.client).id, "outages-😵");
    if (!outages) return errorLog(message.client, `Unable to find #outages-😵 channel from LatencyCheck!`);

    //Set up to find last Pingu message
    let outagesMessages = outages.messages.cache.array();
    let outageMessagesCount = outagesMessages.length - 1;

    //Find Pingu message
    for (var i = outageMessagesCount - 1; i >= 0; i--) {
        if (outagesMessages[i].author != message.client.user) continue;
        var lastPinguMessage = outagesMessages[i];
    }

    if (!lastPinguMessage) return null;

    let sendMessage = !lastPinguMessage.content.includes(`I have a latency delay on`);
    if (!sendMessage) {
        let lastMessageArgs = lastPinguMessage.content.split(` `);
        let lastLatencyExclaim = lastMessageArgs[lastMessageArgs.length - 1];
        let lastLatency = parseInt(lastLatencyExclaim.substring(0, lastLatencyExclaim.length - 1));

        if (lastLatency > 1000)
            return lastPinguMessage.edit(`I have a latency delay on ${latency}!`);
    }

    if (latency > 1000) PinguLibrary.outages(message.client, `I have a latency delay on ${latency}!`);
}
export async function raspberryLog(client: Client) {
    if (!ToPinguClient(client).isLive) return;

    let raspberryLogChannel = getTextChannel(client, SavedServers.PinguSupport(client).id, 'raspberry-log-🍇');
    if (!raspberryLogChannel) return DanhoDM(`Couldn't get #raspberry-log-🍇 channel in Pingu Support, ${PinguSupportInvite}`)

    return raspberryLogChannel.send(`Pulled version ${ToPinguClient(client).config.version} from Github`);
}
//#endregion

//#region Achievements
import { AchieverTypes, AchievementBaseType } from "../achievements/items/AchievementBase";
import { UserAchievement, UserAchievementType, UserAchievementTypeKey, UserAchievementCallbackParams } from "../achievements/items/UserAchievement";
import { GuildMemberAchievement, GuildMemberAchievementType, GuildMemberAchievementTypeKey, GuildMemberAchievementCallbackParams } from "../achievements/items/GuildMemberAchievement";
import { GuildAchievement, GuildAchievementType, GuildAchievementTypeKey, GuildAchievementCallbackParams } from "../achievements/items/GuildAchievement";

import { GetPUser, UpdatePUser } from "../user/PinguUser";
import { GetPGuildMember, UpdatePGuildMember } from "../guildMember/PinguGuildMember";
import { GetPGuild, UpdatePGuild } from "../guild/PinguGuild";
import { PAchievement } from "../../database/json/PAchievement";

import { UserAchievementConfig } from "../achievements/config/UserAchievementConfig";
import { GuildMemberAchievementConfig } from "../achievements/config/GuildMemberAchievementConfig";
import { GuildAchievementConfig } from "../achievements/config/GuildAchievementConfig";

interface Achievements {
    USER: UserAchievement<UserAchievementTypeKey, UserAchievementType[UserAchievementTypeKey]>,
    GUILDMEMBER: GuildMemberAchievement<GuildMemberAchievementTypeKey, GuildMemberAchievementType[GuildMemberAchievementTypeKey]>,
    GUILD: GuildAchievement<GuildAchievementTypeKey, GuildMemberAchievementType[GuildMemberAchievementTypeKey]>
}
interface AchievementTypes {
    USER: UserAchievementType,
    GUILDMEMBER: GuildMemberAchievementType,
    GUILD: GuildAchievementType
}
interface AchieverConfigs {
    USER: UserAchievementConfig,
    GUILDMEMBER: GuildMemberAchievementConfig,
    GUILD: GuildAchievementConfig
}
interface Achievers {
    USER: User,
    GUILDMEMBER: GuildMember,
    GUILD: Guild
}
interface AchievementCallbackParams {
    USER: UserAchievementCallbackParams,
    GUILDMEMBER: GuildMemberAchievementCallbackParams,
    GUILD: GuildAchievementCallbackParams
}
export async function AchievementCheckType
    <AchieverType extends AchieverTypes,
    AchievementType extends Achievements[AchieverType],
    Key extends keyof AchievementTypes[AchieverType],
    Type extends AchievementTypes[AchieverType][Key],
    CallbackKey extends keyof AchievementCallbackParams[AchieverType]>
    (
        client: Client,
        achieverType: AchieverType, 
        achiever: Achievers[AchieverType], 
        key: Key, 
        keyType: Type,
        config: AchieverConfigs[AchieverType],
        callbackKey: CallbackKey,
        callback: AchievementCallbackParams[AchieverType][CallbackKey][keyof AchievementCallbackParams[AchieverType][CallbackKey]]
    ) {
    const filter = (arr: AchievementType[]) =>  arr.filter(i => i.key == key && i.type == (keyType as any));

    let allAchievements = filter((function getAllAchievements() {
        switch (achieverType) {
            case 'USER': return UserAchievement.Achievements as AchievementType[];
            case 'GUILDMEMBER': return GuildMemberAchievement.Achievements as AchievementType[];
            case 'GUILD': return GuildAchievement.Achievements as AchievementType[];
            default: return null;
        }
    })());
    if (!allAchievements) return null;

    let pAchievements = (await (async function getAllPAchievements() {
        switch (achieverType) {
            case 'USER': return (await GetPUser(achiever as User)).achievementConfig.achievements;
            case 'GUILDMEMBER': return (await GetPGuildMember(achiever as GuildMember)).achievementsConfig.achievements;
            case 'GUILD': return (await GetPGuild(achiever as Guild)).settings.config.achievements.achievements;
            default: return null;
        }
    })()).map(pa => pa._id);

    //Find an achievement matching Key & Type, that achiever doesn't have, and the achievement's callback returns true
    let achievement = await (async function Find() {
        for (const a of allAchievements)
            if (!pAchievements.includes(a._id) && await a.callback(callback as never))
                return a;
        return null;
    })();

    if (!achievement) return null;

    let pAchievement = new PAchievement({
        _id: achievement._id,
        achievedAt: new Date(Date.now())
    });

    await (async function UpdateDB() {
        const scriptName = 'PinguLibrary.AchievementCheckType()'
        switch (achieverType) {
            case 'USER':
                let pUser = await GetPUser(achiever as User);
                pUser.achievementConfig.achievements.push(pAchievement);
                return UpdatePUser(client, { achievementConfig: pUser.achievementConfig }, pUser, scriptName, 
                    `Added ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${(achiever as User).tag}**'s PinguUser achievements collection`,
                    `Failed to add ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${(achiever as User).tag}**'s PinguUser achievements collection`
                );
            case 'GUILDMEMBER':
                let pGuildMember = await GetPGuildMember(achiever as GuildMember);
                pGuildMember.achievementsConfig.achievements.push(pAchievement);
                return UpdatePGuildMember(achiever as GuildMember, pGuildMember, scriptName, 
                    `Added ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${(achiever as GuildMember).user.tag}**'s PinguGuildMember achievements collection`,
                    `Failed to add ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${(achiever as GuildMember).user.tag}**'s PinguGuildMember achievements collection`
                );
            case 'GUILD':
                let pGuild = await GetPGuild(achiever as Guild);
                pGuild.settings.config.achievements.achievements.push(pAchievement);
                return UpdatePGuild(client, { settings: pGuild.settings }, pGuild, scriptName,
                    `Added ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${(achiever as Guild).name}**'s PinguGuild achievements collection`,
                    `Failed to add ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${(achiever as Guild).name}**'s PinguGuild achievements collection`
                );
            default: return null;
        }
    })();

    return (function notify() {
        switch (achieverType) {
            case 'USER': return UserAchievementConfig.notify(client, achiever as User, achievement as UserAchievement<UserAchievementTypeKey, UserAchievementType[UserAchievementTypeKey]>);
            case 'GUILDMEMBER': return GuildMemberAchievementConfig.notify(client, achiever as GuildMember, achievement as GuildMemberAchievement<GuildMemberAchievementTypeKey, GuildMemberAchievementType[GuildMemberAchievementTypeKey]>, config as GuildMemberAchievementConfig);
            case 'GUILD': return GuildAchievementConfig.notify(client, achiever as Guild, achievement as GuildAchievement<GuildMemberAchievementTypeKey, GuildMemberAchievementType[GuildMemberAchievementTypeKey]>, config as GuildAchievementConfig);
            default: return null;
        }
    })();
}
interface AchievementCheckData {
    user: User,
    guildMember?: GuildMember,
    guild?: Guild
}

export async function AchievementCheck
<AchievementType extends GuildMemberAchievementType | GuildAchievementType | AchievementBaseType,
Key extends keyof AchievementType, Type extends AchievementType[Key],>
(client: Client, data: AchievementCheckData, key: Key, type: Type, callback: any[]) {
    let pUser = await GetPUser(data.user);
    let givenAchievement = await AchievementCheckType(
        client, 
        'USER', 
        data.user, 
        key as keyof UserAchievementType, 
        type as unknown as string, pUser.achievementConfig, 
        key as keyof UserAchievementType, 
        callback as never
    );

    if (data.guild) {
        let pGuild = await GetPGuild(data.guild);
        givenAchievement = await AchievementCheckType(
            client, 
            'GUILD', 
            data.guild, 
            key as keyof GuildAchievementType, 
            type as unknown as string, 
            pGuild.settings.config.achievements, 
            key as keyof GuildAchievementType, 
            callback as never
        );
    }
    if (data.guildMember) {
        let pGuildMember = await GetPGuildMember(data.guildMember);
        givenAchievement = await AchievementCheckType(
            client, 
            'GUILDMEMBER', 
            data.guildMember, 
            key as keyof GuildMemberAchievementType, 
            type as unknown as string, 
            pGuildMember.achievementsConfig, 
            key as keyof GuildMemberAchievementType, 
            callback as never
        );
    }
    return givenAchievement != null;
}
//#endregion

//#region Statics
import { BlankEmbedField } from "../../helpers"; export { BlankEmbedField }
import { DBExecute } from "../../database"; export { DBExecute }
export function getImage(script: string, imageName: string) {
    return `./embedImages/${script}/${imageName}.png`;
}
export function getEmote(client: Client, name: string, emoteGuild: Guild) {
    if (!client || !name || !emoteGuild) return '😵';

    let emote = client.guilds.cache.find(g => g.id == emoteGuild.id).emojis.cache.find(e => e.name == name);
    if (emote) return emote;
    errorLog(client, `Unable to find Emote **${name}** from ${emoteGuild.name}`, null, null, {
        params: { client, name, emoteGuild }
    });
    return '😵';
}
export async function RequestImage(message: Message, pGuildClient: PClient, caller: 'gif' | 'meme', types: string[], searchTerm?: (type: string) => string) {
    const client = ToPinguClient(message.client);
    const { config } = client;

    if (!config || !config.api_key || !config.google_custom_search) {
        return errorLog(client, `Unable to send ${caller}\nImage search requires both a YouTube API key and a Google Custom Search key!`, message.content, null, {
            params: { message, pGuildClient, caller, types },
            additional: { api_key: config.api_key, google_custom_search: config.google_custom_search }
        }).then(() =>
            message.channel.send(`I was unable to search for a ${type}! I have contacted my developers...`));
    }

    // gets us a random result in first 5 pages
    const page = 1 + Math.floor(Math.random() * 5) * 10;
    //const type = Math.floor(Math.random() * 2) == 1 ? "Club Penguin" : "Pingu";
    const type = types[Math.floor(Math.random() * types.length)];
    if (!searchTerm) searchTerm = type => `${type} ${caller}`;

    // we request 10 items
    request(`https://www.googleapis.com/customsearch/v1?key=${config.api_key}&cx=${config.google_custom_search}&q=${searchTerm(type)}&searchType=image&alt=json&num=10&start=${page}`, async (err, res, body) => {
        if (err) return errorLog(client, `Error getting results when searching for ${searchTerm(type)}`, message.content, new Error(err), {
            params: { message, pGuildClient, caller, types },
            additional: {
                page, type,
                keys: {
                    api_key: config.api_key, 
                    google_custom_search: config.google_custom_search
                }
            }
        });

        // "https://www.googleapis.com/customsearch/v1?key=AIzaSyAeAr2Dv1umzuLes_zhlY0lON4Pf_uAKeM&cx=013524999991164939702:z24cpkwx9nz&q=pinguh&searchType=image&alt=json&num=10&start=31"
        try { var data = JSON.parse(body); }
        catch (err) { errorLog(client, `Getting data in ${caller}, PinguLibrary.RequestImage()`, message.content, new Error(err), {
            params: { message, pGuildClient, caller, types },
            additional: { page, type, data }
        }); }

        if (!data) {
            return errorLog(client, `Getting data in ${caller}, PinguLibrary.RequestImage()`, message.content, null, {
                params: { message, pGuildClient, caller, types },
                additional: { page, type, data }
            }).then(() =>
                message.channel.send(`I was unable to recieve a gif! I have contacted my developers...`));
        }
        else if (!data.items || !data.items.length) {
            return errorLog(client, `Data for ${caller} has no items`, message.content, null, {
                params: { message, pGuildClient, caller, types },
                additional: { page, type, data }
            }).then(() =>
                message.channel.send(`I was unable to find a gif! I have contacted my developers...`));
        }

        return message.channel.send(new MessageEmbed()
            .setImage(data.items[Math.floor(Math.random() * data.items.length)].link)
            .setColor(pGuildClient.embedColor || client.DefaultEmbedColor)
        );
    });
}
//#endregion

export class PinguLibrary {
    //#region Permissions
    public static PermissionCheck(check: Check, ...permissions: PermissionString[]) { return PermissionCheck(check, ...permissions); }
    public static readonly PermissionGranted = PermissionGranted;
    public static Permissions() { return Permissions(); }
    //#endregion

    //#region Servers
    public static PinguSupportInvite = PinguSupportInvite;
    public static readonly SavedServers = SavedServers
    public static async getSharedServers(client: Client, user: User) { return getSharedServers(client, user); }
    //#endregion

    //#region Pingu Developers
    public static readonly Developers = Developers;
    public static async CacheDevelopers(client: Client): Promise<Collection<DeveloperNames, User>> { return CacheDevelopers(client); }
    public static isPinguDev(user: User) { return isPinguDev(user); }
    //#endregion

    //#region Channels
    public static getTextChannel(client: Client, guildID: string, channelName: string) { return getTextChannel(client, guildID, channelName); }
    public static async outages(client: Client, message: string) { return outages(client, message); }
    public static async DanhoDM(message: string) { return DanhoDM(message); }
    //#endregion

    //#region Log Channels
    public static errorCache = errorCache;
    public static async errorLog(client: Client, message: string, messageContent?: string, err?: Error, params: errorLogParams = {}) { return errorLog(client, message, messageContent, err, params); }
    public static async pGuildLog(client: Client, script: string, message: string, err?: Error) { return pGuildLog(client, script, message, err); }
    public static async pUserLog(client: Client, script: string, message: string, err?: Error) { return pUserLog(client, script, message, err); }
    public static async consoleLog(client: Client, message: string) { return consoleLog(client, message); }
    public static async eventLog(client: Client, content: MessageEmbed) { return eventLog(client, content); }
    public static async tellLog(client: Client, sender: User, reciever: User, message: Message | MessageEmbed) { return tellLog(client, sender, reciever, message); }
    public static async latencyCheck(message: Message) { return latencyCheck(message); }
    public static async raspberryLog(client: Client) { return raspberryLog(client); }
    //#endregion

    //#region Achievement
    public static async AchievementCheck
    <AchievementType extends GuildMemberAchievementType | GuildAchievementType | AchievementBaseType,
    Key extends keyof AchievementType, Type extends AchievementType[Key]>
    (client: Client, data: AchievementCheckData, key: Key, type: Type, callbackParams: any[]) {
        return AchievementCheck<AchievementType, Key, Type>(client, data, key, type, callbackParams);
    }
    //#endregion

    //#region Statics
    public static getEmote(client: Client, name: string, emoteGuild: Guild) { return getEmote(client, name, emoteGuild); }
    public static getImage(script: string, imageName: string) { return getImage(script, imageName); }
    public static async DBExecute(client: Client, callback: (mongoose: typeof import('mongoose')) => void) { return DBExecute(client, callback); }
    public static BlankEmbedField(inline = false) { return BlankEmbedField(inline); }
    public static async RequestImage(message: Message, pGuildClient: PClient, caller: 'gif' | 'meme', types: string[], searchTerm?: (type: string) => string)
    { return RequestImage(message, pGuildClient, caller, types, searchTerm); }
    //#endregion
}