import { ActivityOptions, Client, ClientEvents, ClientOptions, Collection, Guild, Message, MessageEmbed, PermissionString, TextChannel, User } from "discord.js";
export declare const Clients: {
    PinguID: string;
    BetaID: string;
};
export declare function ToBasePinguClient(client: Client): BasePinguClient<any>;
import PinguHandler from "../handlers/PinguHandler";
import { PinguCommandParams } from "../handlers/PinguCommand";
import IConfigRequirements from "../../helpers/Config";
import PinguCollection from '../collection/PinguCollection';
import DeveloperCollection from '../collection/DeveloperCollection';
import EmojiCollection from '../collection/EmojiCollection';
import PinguGuildMemberCollection from '../collection/PinguGuildMemberCollection';
import PermissionsManager from '../PermissionsManager';
import PinguCacheManager from '../PinguCacheManager';
import { IAmBadge, PinguBadge } from '../badge/PinguBadge';
import PinguUser from '../user/PinguUser';
import PinguGuild from '../guild/PinguGuild';
declare type ConsoleLogType = 'log' | 'warn' | 'error';
interface ErrorLogParams {
    params?: PinguCommandParams | {};
    trycatch?: {};
    additional?: {};
}
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
export declare type SavedServerNames = 'Danho Misc' | 'Pingu Support' | 'Pingu Emotes' | 'Deadly Ninja';
export declare abstract class BasePinguClient<Events extends ClientEvents = any> extends Client {
    static Clients: {
        PinguID: string;
        BetaID: string;
    };
    constructor(config: IConfigRequirements, permissions: PermissionString[], subscribedEvents: Array<keyof ClientEvents>, dirname: string, commandsPath?: string, eventsPath?: string, options?: ClientOptions);
    get id(): string;
    get isLive(): boolean;
    readonly DefaultEmbedColor = 3447003;
    readonly invite = "https://discord.gg/gbxRV4Ekvh";
    commands: Collection<string, PinguHandler>;
    events: Collection<string | keyof Events, PinguHandler>;
    subscribedEvents: (string | keyof Events)[];
    DefaultPrefix: string;
    clients: Collection<"Live" | "Beta", User>;
    permissions: PermissionsManager;
    cache: PinguCacheManager;
    config: IConfigRequirements;
    logChannels: Collection<LogChannels, TextChannel>;
    developers: DeveloperCollection;
    savedServers: Collection<SavedServerNames, Guild>;
    badges: Collection<IAmBadge, PinguBadge>;
    pGuilds: PinguCollection<Guild, PinguGuild>;
    pGuildMembers: Collection<Guild, PinguGuildMemberCollection>;
    pUsers: PinguCollection<User, PinguUser>;
    emotes: EmojiCollection;
    setActivity(options?: ActivityOptions): import("discord.js").Presence;
    log<Type extends LogChannels, LogMethod extends (channel: TextChannel, ...args: LogTypes[Type]) => Promise<Message>>(type: Type, ...args: LogTypes[Type]): Promise<Message>;
    DBExecute<T>(callback: (mongoose: typeof import('mongoose')) => Promise<T>): Promise<T>;
    DanhoDM(message: string): Promise<Message>;
    get member(): import("discord.js").GuildMember;
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
export default BasePinguClient;
