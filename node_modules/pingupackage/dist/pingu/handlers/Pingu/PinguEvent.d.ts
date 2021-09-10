import { Message, Guild, User, MessageEmbed, GuildAuditLogsAction, ClientEvents } from 'discord.js';
import PinguClient from '../../client/PinguClient';
import PinguGuild from '../../guild/PinguGuild';
import PinguUser from '../../user/PinguUser';
interface ChosenOnes {
    chosenGuild: [guild: Guild, pGuild: PinguGuild];
    chosenUser: [user: User, pUser: PinguUser];
}
interface PinguEvents extends ChosenOnes {
    onready: [];
    mostKnownUser: [user: User];
}
export interface PinguClientEvents extends ClientEvents, PinguEvents {
}
export declare const Colors: {
    Create: `#${string}`;
    Update: `#${string}`;
    Delete: `#${string}`;
};
export declare const LoggedCache: MessageEmbed[];
export declare const noAuditLog = "**No Audit Log Permissions**";
export declare function GetAuditLogs(guild: Guild, type: GuildAuditLogsAction, key?: string, target?: User, seconds?: number): Promise<string>;
export declare function UnknownUpdate(previous: object, current: object): string;
export declare function SetDescription(type: string, description: string): string;
export declare function SetRemove(type: string, previousValue: object, currentValue: object, SetString: string, RemoveString: string, descriptionMethod: (type: string, previousValue: object, currentValue: object) => string): string;
export declare function SetDescriptionValues(type: string, previousValue: any, currentValue: any): string;
export declare function SetDescriptionValuesLink(type: string, previousValue: any, currentValue: any): string;
/**@param type [**${type}**]
 * @param preArr Previous array
 * @param curArr Current array
 * @param callback pre/new.find(i => callback(i, preItem/newItem))*/
export declare function GoThroughArrays<T>(type: string, preArr: T[], curArr: T[], callback: (item: T, loopItem: T) => T): string;
export declare function GoThroughObjectArray<T>(type: string, preArr: T[], curArr: T[]): string;
export declare function HandleEvent<EventType extends keyof PinguClientEvents>(caller: EventType, client: PinguClient, ...args: PinguClientEvents[EventType]): Promise<void>;
import PinguHandler from '../PinguHandler';
export declare class PinguEvent<Event extends keyof PinguClientEvents> extends PinguHandler {
    static Colors: {
        Create: `#${string}`;
        Update: `#${string}`;
        Delete: `#${string}`;
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
    static HandleEvent<EventType extends keyof PinguClientEvents>(caller: EventType, client: PinguClient, ...args: PinguClientEvents[EventType]): Promise<void>;
    constructor(name: Event, setContent?: (client: PinguClient, embed: MessageEmbed, ...args: PinguClientEvents[Event]) => Promise<MessageEmbed>, execute?: (client: PinguClient, ...args: PinguClientEvents[Event]) => Promise<Message>);
    name: Event;
    content: MessageEmbed;
    setContent(client: PinguClient, embed: MessageEmbed, ...args: PinguClientEvents[Event]): Promise<MessageEmbed>;
    execute(client: PinguClient, ...args: PinguClientEvents[Event]): Promise<Message>;
}
export default PinguEvent;
