import { Message, Guild, User, MessageEmbed, GuildAuditLogsAction, ClientEvents } from 'discord.js';
import { PinguClient } from '../client/PinguClient';
interface ChosenOnes {
    chosenGuild: [Guild, PinguGuild];
    chosenUser: [User, PinguUser];
}
interface PinguEvents extends ChosenOnes {
    onready: [];
    mostKnownUser: [User];
}
export interface PinguClientEvents extends ClientEvents, PinguEvents {
}
import PinguGuild from '../guild/PinguGuild';
import PinguUser from '../user/PinguUser';
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
export declare function HandleEvent<EventType extends keyof PinguClientEvents>(caller: EventType, client: PinguClient, path: string, ...args: PinguClientEvents[EventType]): Promise<Message>;
import PinguHandler from './PinguHandler';
export declare class PinguEvent<Event extends keyof PinguClientEvents> extends PinguHandler {
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
    static HandleEvent<EventType extends keyof PinguClientEvents>(caller: EventType, client: PinguClient, path: string, ...args: PinguClientEvents[EventType]): Promise<Message>;
    constructor(name: Event, setContent?: (client: PinguClient, ...args: PinguClientEvents[Event]) => Promise<MessageEmbed>, execute?: (client: PinguClient, ...args: PinguClientEvents[Event]) => Promise<Message>);
    name: Event;
    path: string;
    content: MessageEmbed;
    setContent(client: PinguClient, ...args: PinguClientEvents[Event]): Promise<MessageEmbed>;
    execute(client: PinguClient, ...args: PinguClientEvents[Event]): Promise<Message>;
}
export default PinguEvent;
