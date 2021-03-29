import { Client, Collection, Message, MessageReaction, Invite, Guild, GuildMember, User, GuildEmoji, Presence, Role, VoiceState, MessageEmbed, GuildChannel, DMChannel, GuildAuditLogsAction, ClientEvents } from 'discord.js';
import { PinguClient } from '../client/PinguClient';
interface ChosenOnes {
    chosenGuild: [Guild, PinguGuild];
    chosenGuildMember: [GuildMember, Guild, PinguGuildMember];
    chosenUser: [User, PinguUser];
}
export interface PinguClientEvents extends ClientEvents, ChosenOnes {
    onready: [PinguClient];
    ondebug: [PinguClient];
}
import { PinguHandler } from './PinguHandler';
import { PinguGuild } from '../guild/PinguGuild';
import { PinguGuildMember } from '../guildMember/PinguGuildMember';
import { PinguUser } from '../user/PinguUser';
export interface PinguEventParams {
    client?: Client;
    messages?: Collection<string, Message>;
    reaction?: MessageReaction;
    invite?: Invite;
    channel?: GuildChannel | DMChannel;
    preChannel?: GuildChannel | DMChannel;
    guild?: Guild;
    preGuild?: Guild;
    message?: Message;
    preMessage?: Message;
    member?: GuildMember;
    preMember?: GuildMember;
    user?: User;
    preUser?: User;
    emote?: GuildEmoji;
    preEmote?: GuildEmoji;
    presence?: Presence;
    prePresence?: Presence;
    role?: Role;
    preRole?: Role;
    state?: VoiceState;
    preState?: VoiceState;
}
export declare const Colors: {
    Create: string;
    Update: string;
    Delete: string;
};
export declare const LoggedCache: MessageEmbed[];
export declare const noAuditLog = "**No Audit Log Permissions**";
export declare function GetAuditLogs(guild: Guild, type: GuildAuditLogsAction, key?: string, target?: User, seconds?: number): Promise<string>;
export declare function UnknownUpdate(old: object, current: object): string;
export declare function SetDescription(type: string, description: string): string;
export declare function SetRemove(type: string, oldValue: object, newValue: object, SetString: string, RemoveString: string, descriptionMethod: (type: string, oldValue: object, newValue: object) => string): string;
export declare function SetDescriptionValues(type: string, oldValue: any, newValue: any): string;
export declare function SetDescriptionValuesLink(type: string, oldValue: any, newValue: any): string;
/**@param type [**${type}**]
 * @param preArr Previous array
 * @param newArr Current array
 * @param callback pre/new.find(i => callback(i, preItem/newItem))*/
export declare function GoThroughArrays<T>(type: string, preArr: T[], newArr: T[], callback: (item: T, loopItem: T) => T): string;
export declare function GoThroughObjectArray<T>(type: string, preArr: T[], newArr: T[]): string;
export declare function HandleEvent<EventType extends keyof PinguClientEvents>(caller: EventType, client: Client, path: string, ...args: PinguClientEvents[EventType]): Promise<void>;
export declare class PinguEvent<eventType extends keyof PinguClientEvents> extends PinguHandler {
    static Colors: {
        Create: string;
        Update: string;
        Delete: string;
    };
    static noAuditLog: string;
    static LoggedCache: MessageEmbed[];
    static GetAuditLogs(guild: Guild, type: GuildAuditLogsAction, key?: string, target?: User, seconds?: number): Promise<string>;
    static UnknownUpdate(old: object, current: object): string;
    static SetDescription(type: string, description: string): string;
    static SetRemove(type: string, oldValue: object, newValue: object, SetString: string, RemoveString: string, descriptionMethod: (type: string, oldValue: object, newValue: object) => string): string;
    static SetDescriptionValues(type: string, oldValue: any, newValue: any): string;
    static SetDescriptionValuesLink(type: string, oldValue: any, newValue: any): string;
    static GoThroughArrays<T>(type: string, preArr: T[], newArr: T[], callback: (item: T, loopItem: T) => T): string;
    static GoThroughObjectArray<T>(type: string, preArr: T[], newArr: T[]): string;
    static HandleEvent<EventType extends keyof PinguClientEvents>(caller: EventType, client: Client, path: string, ...args: PinguClientEvents[EventType]): Promise<void>;
    constructor(name: eventType, setContent?: (...args: PinguClientEvents[eventType]) => Promise<MessageEmbed>, execute?: (client: PinguClient, ...args: PinguClientEvents[eventType]) => Promise<void | Message>);
    name: eventType;
    path: string;
    content: MessageEmbed;
    setContent(...args: PinguClientEvents[eventType]): Promise<MessageEmbed>;
    execute(client: PinguClient, ...args: PinguClientEvents[eventType]): Promise<void | Message>;
}
export {};
