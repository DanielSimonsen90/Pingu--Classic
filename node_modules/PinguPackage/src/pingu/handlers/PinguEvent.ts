import { 
    Collection, Message, Guild, GuildMember, User, MessageEmbed, 
    GuildChannel, GuildAuditLogsAction, ClientEvents, GuildAuditLogsEntry, 
    ColorResolvable, DMChannel, GuildEmoji, Snowflake, Role, HexColorString
} from 'discord.js'

import PinguClient from '../client/PinguClient'
import PinguGuild from '../guild/PinguGuild';
import PinguUser from '../user/PinguUser';

interface ChosenOnes {
    chosenGuild: [guild: Guild, pGuild: PinguGuild],
    chosenUser: [user: User, pUser: PinguUser]
}
interface PinguEvents extends ChosenOnes {
    onready: [],
    mostKnownUser: [user: User]
}
export interface PinguClientEvents extends ClientEvents, PinguEvents {}

import { AchievementCheck } from '../achievements';
import Error from '../../helpers/Error';

//#region Statics
export const Colors = {
    Create: `#18f151` as HexColorString,
    Update: `#ddfa00` as HexColorString,
    Delete: `#db1108` as HexColorString
};
export const LoggedCache = new Array<MessageEmbed>();
export const noAuditLog = `**No Audit Log Permissions**`;

export async function GetAuditLogs(guild: Guild, type: GuildAuditLogsAction, key?: string, target: User = null, seconds: number = 1) {
    if (!guild.me || !guild.me.permissions.has('VIEW_AUDIT_LOG'))
        return noAuditLog;

    let now = new Date();
    let logs = await guild.fetchAuditLogs({ type });
    now.setSeconds(now.getSeconds() - seconds);
    let filteredLogs = logs.entries.filter(e => e.createdTimestamp > now.getTime());

    try { return key ? filteredLogs.find(e => e.changes.find(change => change.key == key) && (target ? e.target == target : true)).executor.tag : filteredLogs.first().executor.tag; }
    catch (err) { if (err.message == `Cannot read property 'executor' of undefined`) return noAuditLog; }
}
export function UnknownUpdate(previous: object, current: object) {
    let oldArr = Object.keys(previous);
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
export function SetRemove(type: string, previousValue: object, currentValue: object, SetString: string, RemoveString: string, descriptionMethod: (type: string, previousValue: object, currentValue: object) => string) {
    return currentValue && !previousValue ? SetDescription(type, SetString) :
        !currentValue && previousValue ? SetDescription(type, RemoveString) : descriptionMethod(type, previousValue, currentValue);
}
export function SetDescriptionValues(type: string, previousValue: any, currentValue: any) {
    return SetDescription(type, `Old: ${previousValue}\n\nNew: ${currentValue}`)
}
export function SetDescriptionValuesLink(type: string, previousValue: any, currentValue: any) {
    return SetDescription(type, `[Old](${previousValue})\n[New](${currentValue})`)
}
/**@param type [**${type}**]
 * @param preArr Previous array
 * @param curArr Current array
 * @param callback pre/new.find(i => callback(i, preItem/newItem))*/
export function GoThroughArrays<T>(type: string, preArr: T[], curArr: T[], callback: (item: T, loopItem: T) => T) {
    let updateMessage = `[**${type}**] `;
    let added = GoThroguhArray(curArr, preArr);
    let removed = GoThroguhArray(preArr, curArr);

    if (!added.length && removed.length) return updateMessage += removed.join(`, `).substring(removed.join(', ').length - 2);
    else if (!removed.length && added.length) return updateMessage += added.join(`, `).substring(added.join(', ').length - 2);
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
export function GoThroughObjectArray<T>(type: string, preArr: T[], curArr: T[]) {
    let updateMessage = `[**${type}**]\n`;
    let changes = new Collection<string, string>();

    if (preArr.length > curArr.length) return updateMessage += `Removed ${type.toLowerCase()}`;
    else if (curArr.length > preArr.length) return updateMessage += `Added new ${type.toLowerCase()}`;

    for (var i = 0; i < curArr.length; i++) {
        let newKeys = Object.keys(curArr[i]);
        let preKeys = Object.keys(preArr[i]);

        newKeys.forEach(key => {
            if (curArr[key] == preArr[key]) return;
            else if (!preArr[key]) changes.set(key, `__Added__: ${curArr[key]}`);
            else changes.set(key, `__Changed__: **${preArr[key]}** => **${curArr[key]}**`)
        });
        preKeys.forEach(key => {
            if (changes.get(key) || preKeys[key] == newKeys[key]) return
            else if (!curArr[key]) changes.set(key, `__Removed__: ${preArr[key]}`);
        });
    }

    changes.keyArray().forEach(key => updateMessage += `**${key}**: ${changes.get(key)}\n`)
    return updateMessage;
}
export async function HandleEvent<EventType extends keyof PinguClientEvents>(caller: EventType, client: PinguClient, ...args: PinguClientEvents[EventType]) {
    const event = client.events.get(caller);
    console.log(caller)
    if (!event || !event.execute && !event.setContent) return; //Event not found or doesn't have any callbacks assigned

    async function execute() {
        try { return event.execute(client, ...args); } 
        catch (err) { client.log('error',`${event.name}.execute`, null, new Error(err), {
                params: { caller, args: {...args} },
                additional: { event, args }
            }); 
        }
    }
    async function setContent() {
        if (!client.isLive) return;
        try { return SendToLog(); } 
        catch (err) {
            client.log('error',`${event.name}.setContent`, null, new Error(err), {
                params: { caller, args: {...args} },
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
        client.log('error',err.message, JSON.stringify(args, null, 2), err, {
            params: { caller, args: {...args} },
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
                parameter.author?.tag,
                parameter.tag,
                parameter.user?.tag,
                parameter.member?.user?.tag,
                parameter.users?.cache.last?.()?.tag,
                parameter.last?.()?.author.tag,
                parameter.inviter?.tag,
                parameter.name,
                parameter.guild?.name
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
        if (emitAssociator.match(/#\d{4}$/g)) {
            var isPinguUser = false;
            let user = client.users.cache.find(u => u.tag == emitAssociator);
            if (user) { 
                isPinguUser = !user.bot && client.pUsers.get(user) != null;
            }
            // if (!isPinguUser) return null;
        }

        let specialEvents = [
            'channelCreate', 'channelUpdate', 'channelDelete', 'channelPinsUpdate',
            'webhookUpdate',
            'emojiCreate', 'emojiUpdate', 'emojiDelete',
            'guildBanAdd', 'guildBanRemove', 'guildMemberUpdate',
            'guildUpdate', 'guildIntergrationsUpdate',
            'roleCreate', 'roleUpdate', 'roleDelete',
            'messageBulkDelete'
        ] as EventType[];
        if (specialEvents.includes(caller)) emitAssociator = await GetFromAuditLog();

        if (emitAssociator == 'Unknown') throw { message: `Event parameter for ${event.name} was not recognized!` };
        if (caller.startsWith('message') && 
            !caller.startsWith('messageReaction') && 
            ['event-log-📹', 'ping-log-🏓', 'console-log-📝'].includes((args[0] as Message).channel && ((args[0] as Message).channel as GuildChannel).name)) return;
        
        let embed = await CreateEmbed();

        if (embed) return client.log('event', embed);

        async function GetFromAuditLog() {
            const { noAuditLog } = PinguEvent;

            switch (caller) {
                case 'channelCreate': return !(args[0] as GuildChannel).guild ? (args[0] as DMChannel).recipient.tag : await GetInfo((args[0] as GuildChannel).guild, 'CHANNEL_CREATE');
                case 'channelUpdate': return !(args[0] as GuildChannel).guild ? (args[0] as DMChannel).recipient.tag : await GetInfo((args[0] as GuildChannel).guild, 'CHANNEL_UPDATE');
                case 'channelDelete': return !(args[0] as GuildChannel).guild ? (args[0] as DMChannel).recipient.tag : await GetInfo((args[0] as GuildChannel).guild, 'CHANNEL_DELETE');
                case 'channelPinsUpdate': return !(args[0] as GuildChannel).guild ? (args[0] as DMChannel).recipient.tag :
                    (await GetInfo((args[0] as GuildChannel).guild, 'MESSAGE_PIN') || await GetInfo((args[0] as GuildChannel).guild, 'MESSAGE_UNPIN'));

                case 'webhookCreate': return await GetInfo((args[0] as GuildChannel).guild, 'WEBHOOK_CREATE');
                case 'webhookUpdate': return await GetInfo((args[0] as GuildChannel).guild, 'WEBHOOK_UPDATE');
                case 'webhookDelete': return await GetInfo((args[0] as GuildChannel).guild, 'WEBHOOK_DELETE');

                case 'emojiCreate': return await GetInfo((args[0] as GuildEmoji).guild, 'EMOJI_CREATE');
                case 'emojiUpdate': return await GetInfo((args[0] as GuildEmoji).guild, 'EMOJI_UPDATE');
                case 'emojiDelete': return await GetInfo((args[0] as GuildEmoji).guild, 'EMOJI_DELETE');

                case 'guildBanAdd': return await GetInfo((args[0] as Guild), 'MEMBER_BAN_ADD');
                case 'guildMemberUpdate': return await GetInfo((args[0] as GuildMember).guild, 'MEMBER_UPDATE');
                case 'guildBanRemove': return await GetInfo((args[0] as Guild), 'MEMBER_BAN_REMOVE');

                case 'guildUpdate': return await GetInfo((args[0] as Guild), 'GUILD_UPDATE');
                case 'guildIntegrationsUpdate': return await GetInfo((args[0] as Guild), 'INTEGRATION_UPDATE');

                case 'messageBulkDelete': return await GetInfo((args[0] as Collection<Snowflake, Message>).last().guild, 'MESSAGE_BULK_DELETE');

                case 'roleCreate': return await GetInfo((args[0] as Role).guild, 'ROLE_CREATE');
                case 'roleUpdate': return await GetInfo((args[0] as Role).guild, 'ROLE_UPDATE');
                case 'roleDelete': return await GetInfo((args[0] as Role).guild, 'ROLE_DELETE');
                default: client.log('error', `"${event.name}" was not recognized as an event name when searching from audit log`); return "Unknown";
            }

            async function GetInfo(guild: Guild, auditLogEvent: import('discord.js').GuildAuditLogsAction): Promise<string> {
                let auditLogs = await getAuditLogs(guild, auditLogEvent);
                if (auditLogs == noAuditLog) return noAuditLog;

                auditLogs = auditLogs as Collection<string, GuildAuditLogsEntry>;
                return auditLogs.last()?.executor.tag || PinguEvent.noAuditLog;
            }
            async function getAuditLogs(guild: Guild, type: import('discord.js').GuildAuditLogsAction) {
                const me = guild.me || guild.member(guild.client.user);
                if (!me || !me.permissions.has('VIEW_AUDIT_LOG'))
                    return noAuditLog;

                return (await guild.fetchAuditLogs({ type })).entries.filter(e => new Date().getSeconds() - e.createdAt.getSeconds() <= 1);
            }
        }
        async function CreateEmbed() {
            let [user, guild, executed] = [
                client.users.cache.findByDisplayName(emitAssociator),
                client.guilds.cache.findByDisplayName(emitAssociator),
                new Date()
            ];

            const getDoubleDigit = (num: number) => num < 10 ? `0${num}` : `${num}`;
            let embed = new MessageEmbed({
                title: event.name,
                author: {
                    name: emitAssociator,
                    iconURL: (!emitAssociator || emitAssociator == "Unknown" ? null : user?.avatarURL() || guild?.iconURL())
                },
                color: getColor(),
                footer: { text: `${getDoubleDigit(executed.getHours())}.${getDoubleDigit(executed.getMinutes())}.${getDoubleDigit(executed.getSeconds())}:${executed.getMilliseconds()}` }
            });

            if (event.setContent) {
                await event.setContent(client, new MessageEmbed(), ...args);

                if (!event.content) return null;
                embed = {...embed, ...event.content} as MessageEmbed;
            }

            return !embed.description && (embed.fields?.[0] || true) ? null : embed;

            function getColor(): ColorResolvable {
                if (event.name.includes('Create') || event.name.includes('Add')) return PinguEvent.Colors.Create;
                else if (event.name.includes('Delete') || event.name.includes('Remove')) return PinguEvent.Colors.Delete;
                else if (event.name.includes('Update')) return PinguEvent.Colors.Update;
                try { return client.pGuilds.get(client.savedServers.get('Pingu Support')).clients.find(c => c._id == client.id).embedColor }
                catch { return client.DefaultEmbedColor; }
            }
        }
    }

    function FindClass<ClassType>(type: string) {
        const objectsOfClass = args.filter(a => a && (a as object).constructor && (a as object).constructor.name == type) as any[];
        return objectsOfClass ? objectsOfClass[objectsOfClass.length - 1] as ClassType : null;
    }
}
//#endregion

import PinguHandler from './PinguHandler'
export class PinguEvent<Event extends keyof PinguClientEvents> extends PinguHandler {
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

    public static async HandleEvent<EventType extends keyof PinguClientEvents>(caller: EventType, client: PinguClient, ...args: PinguClientEvents[EventType])
    { return HandleEvent(caller, client, ...args); }
    //#endregion

    constructor(
        name: Event, 
        setContent?: (client: PinguClient, embed: MessageEmbed, ...args: PinguClientEvents[Event]) => Promise<MessageEmbed>, 
        execute?: (client: PinguClient, ...args: PinguClientEvents[Event]) => Promise<Message>
    ){
        super(name);
        if (setContent) this.setContent = setContent;
        this.execute = execute;
    }

    public declare name: Event;
    public content: MessageEmbed;

    public async setContent(client: PinguClient, embed: MessageEmbed, ...args: PinguClientEvents[Event]): Promise<MessageEmbed> { return null; }
    public async execute(client: PinguClient, ...args: PinguClientEvents[Event]): Promise<Message> { return null; }
}

export default PinguEvent;