import { 
    Client, Collection, Message, 
    MessageReaction, Invite, Guild, 
    GuildMember, User, GuildEmoji, 
    Presence, Role, VoiceState, 
    MessageEmbed, GuildChannel, 
    DMChannel, GuildAuditLogsAction, 
    ClientEvents, GuildAuditLogsEntry,
} from 'discord.js'

import { PinguClient, ToPinguClient } from '../client/PinguClient'
export interface PinguClientEvents extends ClientEvents {
    onready: [PinguClient],
    ondebug: [PinguClient]
}

import { PinguHandler } from './PinguHandler'

import { errorLog, eventLog, errorCache, SavedServers } from "../library/PinguLibrary";
const PinguLibrary = { errorLog, eventLog, errorCache, SavedServers }

import { PinguGuild } from '../guild/PinguGuild';
import { Error } from '../../helpers';

export interface PinguEventParams {
    client?: Client,

    messages?: Collection<string, Message>,
    reaction?: MessageReaction,
    invite?: Invite,
    
    channel?: GuildChannel | DMChannel,
    preChannel?: GuildChannel | DMChannel,
    
    guild?: Guild,
    preGuild?: Guild,

    message?: Message,
    preMessage?: Message,

    member?: GuildMember,
    preMember?: GuildMember,

    user?: User,
    preUser?: User,

    emote?: GuildEmoji,
    preEmote?: GuildEmoji,

    presence?: Presence,
    prePresence?: Presence,

    role?: Role,
    preRole?: Role,

    state?: VoiceState
    preState?: VoiceState
}

//#region Statics
export const Colors = {
    Create: `#18f151`,
    Update: `#ddfa00`,
    Delete: `#db1108`
};
export const LoggedCache = new Array<MessageEmbed>();
export const noAuditLog = `**No Audit Log Permissions**`;

export async function GetAuditLogs(guild: Guild, type: GuildAuditLogsAction, key?: string, target: User = null, seconds: number = 1) {
    if (!guild.me.hasPermission('VIEW_AUDIT_LOG'))
        return noAuditLog;

    let now = new Date(Date.now());
    let logs = (await guild.fetchAuditLogs({ type }));
    now.setSeconds(now.getSeconds() - seconds);
    let filteredLogs = logs.entries.filter(e => e.createdTimestamp > now.getTime());

    try { return key ? filteredLogs.find(e => e.changes.find(change => change.key == key) && (target ? e.target == target : true)).executor.tag : filteredLogs.first().executor.tag; }
    catch (err) { if (err.message == `Cannot read property 'executor' of undefined`) return noAuditLog; }
}
export function UnknownUpdate(old: object, current: object) {
    let oldArr = Object.keys(old);
    let currentArr = Object.keys(current);

    for (var i = 0; i < currentArr.length || i < oldArr.length; i++) {
        if (currentArr[i] != oldArr[i])
            return SetDescriptionValues('Unknown', oldArr[i], currentArr[i]);
    }

    return null;
}

export function SetDescription(type: string, description: string) {
    return `[**${type}**]\n\n${description}`;
}
export function SetRemove(type: string, oldValue: object, newValue: object, SetString: string, RemoveString: string, descriptionMethod: (type: string, oldValue: object, newValue: object) => string) {
    return newValue && !oldValue ? SetDescription(type, SetString) :
        !newValue && oldValue ? SetDescription(type, RemoveString) : descriptionMethod(type, oldValue, newValue);
}
export function SetDescriptionValues(type: string, oldValue: any, newValue: any) {
    return SetDescription(type, `Old: ${oldValue}\n\nNew: ${newValue}`)
}
export function SetDescriptionValuesLink(type: string, oldValue: any, newValue: any) {
    return SetDescription(type, `[Old](${oldValue})\n[New](${newValue})`)
}
/**@param type [**${type}**]
 * @param preArr Previous array
 * @param newArr Current array
 * @param callback pre/new.find(i => callback(i, preItem/newItem))*/
export function GoThroughArrays<T>(type: string, preArr: T[], newArr: T[], callback: (item: T, loopItem: T) => T) {
    let updateMessage = `[**${type}**] `;
    let added = GoThroguhArray(newArr, preArr);
    let removed = GoThroguhArray(preArr, newArr);

    if (added.length == 0 && removed.length != 0) return updateMessage += removed.join(`, `).substring(removed.join(', ').length - 2);
    else if (removed.length == 0 && added.length != 0) return updateMessage += added.join(`, `).substring(added.join(', ').length - 2);
    return updateMessage += `Unable to find out what changed!`;

    function GoThroguhArray(cycleArr: T[], otherCycleArr: T[]) {
        let result = new Array<T>();

        for (var item of cycleArr) {
            let old = otherCycleArr.find(i => callback(i, item));
            if (!old) result.push(item);
        }
        return result;
    }
}
export function GoThroughObjectArray<T>(type: string, preArr: T[], newArr: T[]) {
    let updateMessage = `[**${type}**]\n`;
    let changes = new Collection<string, string>();

    if (preArr.length > newArr.length) return updateMessage += `Removed ${type.toLowerCase()}`;
    else if (newArr.length > preArr.length) return updateMessage += `Added new ${type.toLowerCase()}`;

    for (var i = 0; i < newArr.length; i++) {
        let newKeys = Object.keys(newArr[i]);
        let preKeys = Object.keys(preArr[i]);

        newKeys.forEach(key => {
            if (newArr[key] == preArr[key]) return;
            else if (!preArr[key]) changes.set(key, `__Added__: ${newArr[key]}`);
            else changes.set(key, `__Changed__: **${preArr[key]}** => **${newArr[key]}**`)
        });
        preKeys.forEach(key => {
            if (changes.get(key) || preKeys[key] == newKeys[key]) return
            else if (!newArr[key]) changes.set(key, `__Removed__: ${preArr[key]}`);
        });
    }

    changes.keyArray().forEach(key => updateMessage += `**${key}**: ${changes.get(key)}\n`)
    return updateMessage;
}
export async function HandleEvent<EventType extends keyof PinguClientEvents>(caller: EventType, client: Client, path: string, ...args: PinguClientEvents[EventType]) {
    try { var event = require(`../../../../..${path}`) as PinguEvent<EventType>; }
    catch (err) {
        console.log({
            err,
            caller,
            path
        })
        return /*await PinguLibrary.errorLog(client, `Unable to get event for ${caller}`, null, new Error(err));*/
    }
    
    if (!event || !event.execute && !event.setContent) return;

    //PinguLibrary.consoleLog(client, `Emitting ${eventName}`);
    try {
        if (event.execute != null) await event.execute(ToPinguClient(client), ...args)
            .catch(err => PinguLibrary.errorLog(client, `${event.name}.execute`, null, new Error(err), {
                params: { caller, client, path, args: {...args} },
                additional: { event }
            }));
        if (event.setContent != null) await SendToLog()
            .catch(err => PinguLibrary.errorLog(client, `${event.name}.setContent`, null, new Error(err), {
                params: { caller, client, path, args: {...args} },
                additional: { event }
            }));
    }
    catch (err) {
        if (!PinguLibrary.errorCache) {
            let { errorCache } = require('../library/PinguLibrary');
            PinguLibrary.errorCache = errorCache;
        }

        PinguLibrary.errorLog(client, err.message, JSON.stringify(args, null, 2), err, {
            params: { caller, client, path, args: {...args} },
            additional: { event }
        });
    }

    async function SendToLog() {
        var parameters = Object.assign({}, ...args);

        let emitAssociator = 
            parameters.author?.tag ||
            parameters.tag || 
            parameters.user?.tag || 
            parameters.member?.user.tag || 
            parameters.users?.cache.last()?.tag || 
            parameters.last?.()?.author.tag || 
            parameters.inviter?.tag || 
            parameters.name || 
            parameters.guild?.name || 
            "Unknown";

        let specialEvents = [
            'channelCreate', 'channelUpdate', 'channelDelete', 'channelPinsUpdate',
            'webhookUpdate',
            'emojiCreate', 'emojiUpdate', 'emojiDelete',
            'guildBanAdd', 'guildBanRemove', 'guildMemberUpdate',
            'guildUpdate', 'guildIntergrationsUpdate',
            'roleCreate', 'roleUpdate', 'roleDelete',
            'messageBulkDelete'
        ];
        if (specialEvents.includes(event.name)) emitAssociator = await GetFromAuditLog();

        if (emitAssociator == 'Unknown') PinguLibrary.errorLog(client, `Event parameter for ${event.name} was not recognized!`);
        if (parameters.message && ['event-log-📹', 'ping-log-🏓', 'console-log-📝'].includes((parameters.message.channel as GuildChannel).name)) return;
        let embed = await CreateEmbed();

        if (!PinguLibrary.eventLog) {
            const { eventLog } = require("../library/PinguLibrary");
            PinguLibrary.eventLog = eventLog;
        }

        if (embed) return await PinguLibrary.eventLog(client, embed);

        async function GetFromAuditLog() {
            const noAuditLog = PinguEvent.noAuditLog;

            switch (event.name) {
                case 'channelCreate': return !parameters.guild ? parameters.recipient.tag : await GetInfo(parameters.guild, 'CHANNEL_CREATE');
                case 'channelUpdate': return !parameters.guild ? parameters.recipient.tag : await GetInfo(parameters.guild, 'CHANNEL_UPDATE');
                case 'channelDelete': return !parameters.guild ? parameters.recipient.tag : await GetInfo(parameters.guild, 'CHANNEL_DELETE');
                case 'channelPinsUpdate': return !parameters.guild ? parameters.recipient.tag :
                    (await GetInfo(parameters.guild, 'MESSAGE_PIN') || await GetInfo(parameters.guild, 'MESSAGE_UNPIN'));

                case 'webhookCreate': return await GetInfo(parameters.guild, 'WEBHOOK_CREATE');
                case 'webhookUpdate': return await GetInfo(parameters.guild, 'WEBHOOK_UPDATE');
                case 'webhookDelete': return await GetInfo(parameters.guild, 'WEBHOOK_DELETE');

                case 'emojiCreate': return await GetInfo(parameters.guild, 'EMOJI_CREATE');
                case 'emojiUpdate': return await GetInfo(parameters.guild, 'EMOJI_UPDATE');
                case 'emojiDelete': return await GetInfo(parameters.guild, 'EMOJI_DELETE');

                case 'guildBanAdd': return await GetInfo(parameters, 'MEMBER_BAN_ADD');
                case 'guildMemberUpdate': return await GetInfo(parameters.guild, 'MEMBER_UPDATE');
                case 'guildBanRemove': return await GetInfo(parameters, 'MEMBER_BAN_REMOVE');

                case 'guildUpdate': return await GetInfo(parameters, 'GUILD_UPDATE');
                case 'guildIntegrationsUpdate': return await GetInfo(parameters, 'INTEGRATION_UPDATE');

                case 'messageBulkDelete': return await GetInfo(parameters.last().guild, 'MESSAGE_BULK_DELETE');

                case 'roleCreate': return await GetInfo(parameters.guild, 'ROLE_CREATE');
                case 'roleUpdate': return await GetInfo(parameters.guild, 'ROLE_UPDATE');
                case 'roleDelete': return await GetInfo(parameters.guild, 'ROLE_DELETE');
                default: PinguLibrary.errorLog(client, `"${event.name}" was not recognized as an event name when searching from audit log`); return "Unknown";
            }

            async function GetInfo(guild: Guild, auditLogEvent: import('discord.js').GuildAuditLogsAction): Promise<string> {
                let auditLogs = await getAuditLogs(guild, auditLogEvent);
                if (auditLogs == noAuditLog) return noAuditLog;

                auditLogs = auditLogs as Collection<string, GuildAuditLogsEntry>;
                return auditLogs.last() && auditLogs.last().executor.tag || PinguEvent.noAuditLog;
            }
            async function getAuditLogs(guild: Guild, type: import('discord.js').GuildAuditLogsAction) {
                if (!guild.me.hasPermission('VIEW_AUDIT_LOG'))
                    return noAuditLog;

                return (await guild.fetchAuditLogs({ type })).entries.filter(e => new Date(Date.now()).getSeconds() - e.createdAt.getSeconds() <= 1);
            }
        }
        async function CreateEmbed() {
            let user = client.users.cache.find(u => u.tag == emitAssociator);
            let guild = client.guilds.cache.find(g => g.name == emitAssociator);

            let executed = new Date(Date.now());
            function getDoubleDigit(num: number) {
                return num < 10 ? `0${num}` : `${num}`;
            }
            let defaultEmbed = new MessageEmbed()
                .setTitle(event.name)
                .setAuthor(emitAssociator, (!emitAssociator || emitAssociator == "Unknown" ? null :
                    emitAssociator.match(/#\d{4}$/g) ?
                        user && user.avatarURL() :
                        guild && guild.iconURL()))
                .setColor(await getColor())
                .setFooter(`${getDoubleDigit(executed.getHours())}.${getDoubleDigit(executed.getMinutes())}.${getDoubleDigit(executed.getSeconds())}:${executed.getMilliseconds()}`);
            if (event.setContent) {
                await event.setContent(...args);

                if (!event.content) return null;
                defaultEmbed = CombineEmbeds();

                function CombineEmbeds() {
                    for (var key in event.content)
                        if (event.content[key])
                            defaultEmbed[key] = event.content[key];
                    return defaultEmbed;
                }
            }

            return !defaultEmbed.description && (defaultEmbed.fields && defaultEmbed.fields[0] || true) ? null : defaultEmbed;

            async function getColor() {
                if (event.name.includes('Create') || event.name.includes('Add')) return PinguEvent.Colors.Create;
                else if (event.name.includes('Delete') || event.name.includes('Remove')) return PinguEvent.Colors.Delete;
                else if (event.name.includes('Update')) return PinguEvent.Colors.Update;
                try { return (await PinguGuild.GetPGuild(PinguLibrary.SavedServers.PinguSupport(client))).clients.find(c => c._id == client.user.id).embedColor; }
                catch { return ToPinguClient(client).DefaultEmbedColor; }
            }
        }
    }
}
//#endregion

export class PinguEvent<eventType extends keyof PinguClientEvents> extends PinguHandler {
    //#region Statics
    public static Colors = Colors;
    public static noAuditLog = noAuditLog;
    public static LoggedCache = LoggedCache;

    public static async GetAuditLogs(guild: Guild, type: GuildAuditLogsAction, key?: string, target: User = null, seconds: number = 1) { return GetAuditLogs(guild, type, key, target, seconds); }
    public static UnknownUpdate(old: object, current: object) { return UnknownUpdate(old, current); }

    public static SetDescription(type: string, description: string) { return SetDescription(type, description); }
    public static SetRemove(type: string, oldValue: object, newValue: object, SetString: string, RemoveString: string, descriptionMethod: (type: string, oldValue: object, newValue: object) => string) {
        return SetRemove(type, oldValue, newValue, SetString, RemoveString, descriptionMethod);
    }
    public static SetDescriptionValues(type: string, oldValue: any, newValue: any) { return SetDescriptionValues(type, oldValue, newValue); }
    public static SetDescriptionValuesLink(type: string, oldValue: any, newValue: any) { return SetDescriptionValuesLink(type, oldValue, newValue); }
    
    public static GoThroughArrays<T>(type: string, preArr: T[], newArr: T[], callback: (item: T, loopItem: T) => T) { return GoThroughArrays(type, preArr, newArr, callback); }
    public static GoThroughObjectArray<T>(type: string, preArr: T[], newArr: T[]) { return GoThroughObjectArray(type, preArr, newArr); }

    public static async HandleEvent<EventType extends keyof PinguClientEvents>(caller: EventType, client: Client, path: string, ...args: PinguClientEvents[EventType])
    { return HandleEvent(caller, client, path, ...args); }
    //#endregion

    constructor(
        name: eventType, 
        setContent?: (...args: PinguClientEvents[eventType]) => Promise<MessageEmbed>, 
        execute?: (client: PinguClient, ...args: PinguClientEvents[eventType]) => Promise<void | Message>
    ){
        super(name);
        if (setContent) this.setContent = setContent;
        this.execute = execute;
    }

    public name: eventType;
    public path: string;
    public content: MessageEmbed;

    public async setContent(...args: PinguClientEvents[eventType]): Promise<MessageEmbed> { return null; }
    public async execute(client: PinguClient, ...args: PinguClientEvents[eventType]): Promise<void | Message> {}
}