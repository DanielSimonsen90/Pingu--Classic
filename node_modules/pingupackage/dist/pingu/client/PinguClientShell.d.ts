export declare const Clients: {
    PinguID: string;
    BetaID: string;
};
export declare type SavedServerNames = 'Danho Misc' | 'Pingu Support' | 'Pingu Emotes' | 'Deadly Ninja';
declare type ConsoleLogType = 'log' | 'warn' | 'error';
import { PinguCommandParams } from "../handlers/PinguCommand";
interface ErrorLogParams {
    params?: PinguCommandParams | {};
    trycatch?: {};
    additional?: {};
}
import { ActivityOptions, Client, ClientOptions, Collection, Guild, User, Message, MessageEmbed, PermissionString, TextChannel } from 'discord.js';
import { PinguGuild, PinguUser } from '..';
import IConfigRequirements from '../../helpers/Config';
import PinguBadge, { IAmBadge } from '../badge/PinguBadge';
import DeveloperCollection from '../collection/DeveloperCollection';
import EmojiCollection from '../collection/EmojiCollection';
import PinguCollection from '../collection/PinguCollection';
import PinguGuildMemberCollection from '../collection/PinguGuildMemberCollection';
import PermissionsManager from '../PermissionsManager';
import PinguCacheManager from "../PinguCacheManager";
import { TimestampStyle } from "../../helpers/TimeLeftObject";
interface LogTypes {
    achievement: [content: MessageEmbed];
    console: [message: string, type?: ConsoleLogType];
    error: [message: string, messageContent?: string, err?: Error, params?: ErrorLogParams];
    event: [content: MessageEmbed];
    ping: [timestamp: number];
    pGuild: [script: string, message: string, err?: Error];
    pUser: [script: string, message: string, err?: Error];
    raspberry: [];
    tell: [sender: User, receiver: User, message: Message | MessageEmbed];
}
export declare type LogChannels = keyof LogTypes;
export default abstract class PinguClientShell extends Client {
    static Clients: {
        PinguID: string;
        BetaID: string;
    };
    constructor(config: IConfigRequirements, permissions: PermissionString[], options?: ClientOptions);
    cache: PinguCacheManager;
    clients: Collection<"Live" | "Beta", User>;
    config: IConfigRequirements;
    permissions: PermissionsManager;
    emotes: EmojiCollection;
    pGuilds: PinguCollection<Guild, PinguGuild>;
    pGuildMembers: Collection<Guild, PinguGuildMemberCollection>;
    pUsers: PinguCollection<User, PinguUser>;
    badges: Collection<IAmBadge, PinguBadge>;
    developers: DeveloperCollection;
    logChannels: Collection<LogChannels, TextChannel>;
    savedServers: Collection<SavedServerNames, Guild>;
    readonly DefaultEmbedColor = 3447003;
    readonly invite = "https://discord.gg/gbxRV4Ekvh";
    DefaultPrefix: string;
    get id(): string;
    get isLive(): boolean;
    get member(): import("discord.js").GuildMember;
    private _logTypeHandlers;
    setActivity(options?: ActivityOptions): import("discord.js").Presence;
    log<Type extends LogChannels>(type: Type, ...args: LogTypes[Type]): Promise<Message>;
    DBExecute<T>(callback: (mongoose: typeof import('mongoose')) => Promise<T>): Promise<T>;
    DanhoDM(message: string): Promise<Message>;
    timeFormat(timestamp: number, format?: TimestampStyle): string;
    protected onceReady(): Promise<void>;
    protected abstract handlePath(path: string, type: 'command' | 'event'): void;
    private achievementLog;
    private consoleLog;
    private errorLog;
    private eventLog;
    private pingLog;
    private pGuildLog;
    private pUserLog;
    private raspberryLog;
    private tellLog;
}
export {};
