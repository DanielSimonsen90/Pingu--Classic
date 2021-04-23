import { 
    Client, Collection, Message, 
    MessageReaction, Invite, Guild, 
    GuildMember, User, GuildEmoji, 
    Presence, Role, VoiceState, 
    MessageEmbed, GuildChannel, 
    DMChannel, GuildAuditLogsAction, 
    ClientEvents, GuildAuditLogsEntry,
    ColorResolvable
} from 'discord.js'

import { PinguClient, ToPinguClient } from '../client/PinguClient'
interface ChosenOnes {
    chosenGuild: [Guild, PinguGuild],
    chosenUser: [User, PinguUser]
}

export interface PinguClientEvents extends ClientEvents, ChosenOnes {
    onready: [PinguClient],
    ondebug: [PinguClient],
    mostKnownUser: [User]
}

import { PinguHandler } from './PinguHandler'

import { errorLog, eventLog, errorCache, SavedServers, AchievementCheck } from "../library/PinguLibrary";
const PinguLibrary = { errorLog, eventLog, errorCache, SavedServers }

import { PinguGuild } from '../guild/PinguGuild';
import { Error } from '../../helpers';
import { PinguUser } from '../user/PinguUser';

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
        console.log({ err, caller, path });
        return PinguLibrary.errorLog(client, `Unable to get event for ${caller}`, null, new Error(err));
    }
    
    if (!event || !event.execute && !event.setContent) return; //Event not found or doesn't have any callbacks assigned

    async function execute() {
        try { return event.execute(ToPinguClient(client), ...args); } 
        catch (err) { PinguLibrary.errorLog(client, `${event.name}.execute`, null, new Error(err), {
                params: { caller, path, args: {...args} },
                additional: { event, args }
            }); 
        }
    }
    async function setContent() {
        try { return SendToLog(); } 
        catch (err) {
            PinguLibrary.errorLog(client, `${event.name}.setContent`, null, new Error(err), {
                params: { caller, path, args: {...args} },
                additional: { event, args }
            });
        }
    }

    try {
        if (event.execute && event.setContent) await Promise.all([execute(), setContent()]);
        else if (event.execute) await execute();
        else if (event.setContent) await setContent();
    }
    catch (err) {
        if (!PinguLibrary.errorCache) {
            const { errorCache } = require('../library/PinguLibrary');
            PinguLibrary.errorCache = errorCache;
        }

        PinguLibrary.errorLog(client, err.message, JSON.stringify(args, null, 2), err, {
            params: { caller, path, args: {...args} },
            additional: { event }
        });
    }

    const achievementOptions = (parameters: any = {}, type: 'User' | 'GuildMember' | 'Guild') => {
        switch (type) {
            case 'User': return [
                    parameters.author, parameters.user, parameters.inviter, FindClass("User"), 
                    parameters.users && parameters.users.first && parameters.users.first(),
                    parameters.last && parameters.last()
                ].filter(v => v)[0];
            case 'GuildMember': return [parameters.member, FindClass("GuildMember")].filter(v => v)[0];
            case 'Guild': return [parameters.guild, FindClass("Guild")].filter(v => v)[0];
        }
    }

    function getAchiever(type: 'User' | 'GuildMember' | 'Guild') {
        let result = null;
        for (const arg of args) {
            if (result) return result;
            else result = achievementOptions(arg, type);
        }
    }

    var [user, guild, guildMember] = [
        getAchiever('User') as User,
        getAchiever('Guild') as Guild,
        getAchiever('GuildMember') as GuildMember
    ];

    user = !user && guildMember ? guildMember.user : null;
    AchievementCheck(client, { user, guild, guildMember }, 'EVENT', caller, args);

    async function SendToLog() {
        const emitAssociatorOptions = (parameter: any = {}) => {
            const options = [
                parameter.author && parameter.author.tag,
                parameter.tag,
                parameter.user && parameter.user.tag,
                parameter.member && parameter.member.user.tag,
                parameter.users && parameter.users.cache.last() && parameter.users.cache.last().tag,
                parameter.last && parameter.last() && parameter.last().author.tag,
                parameter.inviter && parameter.inviter.tag,
                parameter.name,
                parameter.guild && parameter.guild.name
            ];
            return options.filter(v => v)[0];
        }
        let emitAssociator = "";
        for (const arg of args) {
            if (emitAssociator) break;
            else emitAssociator = emitAssociatorOptions(arg);
        }
        if (!emitAssociator) emitAssociator = "Unknown";

        //Don't log if emitter isn't a PinguUser
        let isPinguUser = emitAssociator.match(/#\d{4}$/g) && await PinguUser.Get(client.users.cache.find(u => u.tag == emitAssociator)) != null;
        // if (!isPinguUser) return null;

        let specialEvents = [
            'channelCreate', 'channelUpdate', 'channelDelete', 'channelPinsUpdate',
            'webhookUpdate',
            'emojiCreate', 'emojiUpdate', 'emojiDelete',
            'guildBanAdd', 'guildBanRemove', 'guildMemberUpdate',
            'guildUpdate', 'guildIntergrationsUpdate',
            'roleCreate', 'roleUpdate', 'roleDelete',
            'messageBulkDelete'
        ] as EventType[];
        if (specialEvents.includes(event.name)) emitAssociator = await GetFromAuditLog();

        if (emitAssociator == 'Unknown') throw { message: `Event parameter for ${event.name} was not recognized!` };
        if (caller == 'message' && ['event-log-📹', 'ping-log-🏓', 'console-log-📝'].includes((args[0].channel as GuildChannel).name)) return;
        let embed = await CreateEmbed();

        if (!PinguLibrary.eventLog) {
            const { eventLog } = require('../library/PinguLibrary');
            PinguLibrary.eventLog = eventLog;
        }

        if (embed) return PinguLibrary.eventLog(client, embed);

        async function GetFromAuditLog() {
            const noAuditLog = PinguEvent.noAuditLog;

            switch (event.name) {
                case 'channelCreate': return !args[0].guild ? args[0].recipient.tag : await GetInfo(args[0].guild, 'CHANNEL_CREATE');
                case 'channelUpdate': return !args[0].guild ? args[0].recipient.tag : await GetInfo(args[0].guild, 'CHANNEL_UPDATE');
                case 'channelDelete': return !args[0].guild ? args[0].recipient.tag : await GetInfo(args[0].guild, 'CHANNEL_DELETE');
                case 'channelPinsUpdate': return !args[0].guild ? args[0].recipient.tag :
                    (await GetInfo(args[0].guild, 'MESSAGE_PIN') || await GetInfo(args[0].guild, 'MESSAGE_UNPIN'));

                case 'webhookCreate': return await GetInfo(args[0].guild, 'WEBHOOK_CREATE');
                case 'webhookUpdate': return await GetInfo(args[0].guild, 'WEBHOOK_UPDATE');
                case 'webhookDelete': return await GetInfo(args[0].guild, 'WEBHOOK_DELETE');

                case 'emojiCreate': return await GetInfo(args[0].guild, 'EMOJI_CREATE');
                case 'emojiUpdate': return await GetInfo(args[0].guild, 'EMOJI_UPDATE');
                case 'emojiDelete': return await GetInfo(args[0].guild, 'EMOJI_DELETE');

                case 'guildBanAdd': return await GetInfo(args[0], 'MEMBER_BAN_ADD');
                case 'guildMemberUpdate': return await GetInfo(args[0].guild, 'MEMBER_UPDATE');
                case 'guildBanRemove': return await GetInfo(args[0], 'MEMBER_BAN_REMOVE');

                case 'guildUpdate': return await GetInfo(args[0], 'GUILD_UPDATE');
                case 'guildIntegrationsUpdate': return await GetInfo(args[0], 'INTEGRATION_UPDATE');

                case 'messageBulkDelete': return await GetInfo(args[0].last().guild, 'MESSAGE_BULK_DELETE');

                case 'roleCreate': return await GetInfo(args[0].guild, 'ROLE_CREATE');
                case 'roleUpdate': return await GetInfo(args[0].guild, 'ROLE_UPDATE');
                case 'roleDelete': return await GetInfo(args[0].guild, 'ROLE_DELETE');
                default: PinguLibrary.errorLog(client, `"${event.name}" was not recognized as an event name when searching from audit log`); return "Unknown";
            }

            async function GetInfo(guild: Guild, auditLogEvent: import('discord.js').GuildAuditLogsAction): Promise<string> {
                let auditLogs = await getAuditLogs(guild, auditLogEvent);
                if (auditLogs == noAuditLog) return noAuditLog;

                auditLogs = auditLogs as Collection<string, GuildAuditLogsEntry>;
                return auditLogs.last() && auditLogs.last().executor.tag || PinguEvent.noAuditLog;
            }
            async function getAuditLogs(guild: Guild, type: import('discord.js').GuildAuditLogsAction) {
                const me = guild.me || guild.member(guild.client.user);
                if (!me.hasPermission('VIEW_AUDIT_LOG'))
                    return noAuditLog;

                return (await guild.fetchAuditLogs({ type })).entries.filter(e => new Date(Date.now()).getSeconds() - e.createdAt.getSeconds() <= 1);
            }
        }
        async function CreateEmbed() {
            let [user, guild, executed] = [
                client.users.cache.find(u => u.tag == emitAssociator),
                client.guilds.cache.find(g => g.name == emitAssociator),
                new Date(Date.now())
            ];

            const getDoubleDigit = (num: number) => num < 10 ? `0${num}` : `${num}`;
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
                defaultEmbed = (function CombineEmbeds() {
                    for (var key in event.content)
                        if (event.content[key])
                            defaultEmbed[key] = event.content[key];
                    return defaultEmbed;
                })();
            }

            return !defaultEmbed.description && (defaultEmbed.fields && defaultEmbed.fields[0] || true) ? null : defaultEmbed;

            async function getColor(): Promise<ColorResolvable> {
                if (event.name.includes('Create') || event.name.includes('Add')) return PinguEvent.Colors.Create;
                else if (event.name.includes('Delete') || event.name.includes('Remove')) return PinguEvent.Colors.Delete;
                else if (event.name.includes('Update')) return PinguEvent.Colors.Update;
                try { return (await PinguGuild.Get(PinguLibrary.SavedServers.get('Pingu Support'))).clients.find(c => c._id == client.user.id).embedColor; }
                catch { return ToPinguClient(client).DefaultEmbedColor; }
            }
        }
    }

    function FindClass<ClassType>(type: string) {
        const objectsOfClass = args.filter(a => a && (a as object).constructor && (a as object).constructor.name == type);
        return objectsOfClass ? objectsOfClass[objectsOfClass.length - 1] as ClassType : null;

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
        execute?: (client: PinguClient, ...args: PinguClientEvents[eventType]) => Promise<Message>
    ){
        super(name);
        if (setContent) this.setContent = setContent;
        this.execute = execute;
    }

    public name: eventType;
    public path: string;
    public content: MessageEmbed;

    public async setContent(...args: PinguClientEvents[eventType]): Promise<MessageEmbed> { return null; }
    public async execute(client: PinguClient, ...args: PinguClientEvents[eventType]): Promise<Message> { return null; }
}