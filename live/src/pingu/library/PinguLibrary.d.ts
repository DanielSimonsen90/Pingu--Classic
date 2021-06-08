import { Client, Collection, Guild, GuildChannel, Message, MessageEmbed, User, PermissionString, TextChannel, GuildMember } from 'discord.js';
import { PClient } from "../../database";
import { Error, BitPermission } from '../../helpers';
interface Check {
    author: User;
    channel: GuildChannel;
    client: Client;
    content?: string;
}
export declare const PermissionGranted = "Permission Granted";
export declare function PermissionCheck(check: Check, ...permissions: PermissionString[]): string;
export declare function Permissions(): {
    given: BitPermission[];
    missing: BitPermission[];
    all: BitPermission[];
};
export declare const PinguSupportInvite = "https://discord.gg/gbxRV4Ekvh";
export declare type SavedServerNames = 'Danho Misc' | 'Pingu Support' | 'Pingu Emotes' | 'Deadly Ninja';
export declare const SavedServers: Collection<SavedServerNames, Guild>;
export declare function CacheSavedServers(client: Client): Collection<SavedServerNames, Guild>;
export declare function getServer(client: Client, id: string): Guild;
export declare function getSharedServers(client: Client, user: User): Promise<Guild[]>;
declare type DeveloperNames = 'Danho' | 'SynthySytro' | 'Slothman' | 'DefilerOfCats';
export declare const Developers: Collection<DeveloperNames, User>;
export declare function CacheDevelopers(client: Client): Promise<Collection<DeveloperNames, User>>;
export declare function isPinguDev(user: User): boolean;
export declare function getTextChannel(client: Client, guildID: string, channelName: string): TextChannel;
export declare function outages(client: Client, message: string): Promise<Message>;
export declare function DanhoDM(message: string): Promise<Message>;
export declare const errorCache: Collection<number, Message[]>;
import { PinguCommandParams } from "../handlers/PinguCommand";
interface ErrorLogParams {
    params?: PinguCommandParams | {};
    trycatch?: {};
    additional?: {};
}
declare type errorLogParams = ErrorLogParams;
export declare function errorLog(client: Client, message: string, messageContent?: string, err?: Error, params?: errorLogParams): Promise<Message>;
export declare function pGuildLog(client: Client, script: string, message: string, err?: Error): Promise<Message>;
export declare function pUserLog(client: Client, script: string, message: string, err?: Error): Promise<Message>;
export declare function consoleLog(client: Client, message: string): Promise<Message>;
export declare function eventLog(client: Client, content: MessageEmbed): Promise<Message>;
export declare function achievementLog(client: Client, achievementEmbed: MessageEmbed): Promise<Message>;
export declare function tellLog(client: Client, sender: User, reciever: User, message: Message | MessageEmbed): Promise<Message>;
export declare function latencyCheck(client: Client, timestamp: number): Promise<Message>;
export declare function raspberryLog(client: Client): Promise<Message>;
import { AchieverTypes, AchievementBaseType } from "../achievements/items/AchievementBase";
import { UserAchievement, UserAchievementType, UserAchievementTypeKey, UserAchievementCallbackParams } from "../achievements/items/UserAchievement";
import { GuildMemberAchievement, GuildMemberAchievementType, GuildMemberAchievementTypeKey, GuildMemberAchievementCallbackParams } from "../achievements/items/GuildMemberAchievement";
import { GuildAchievement, GuildAchievementType, GuildAchievementTypeKey, GuildAchievementCallbackParams } from "../achievements/items/GuildAchievement";
import { UserAchievementConfig } from "../achievements/config/UserAchievementConfig";
import { GuildMemberAchievementConfig } from "../achievements/config/GuildMemberAchievementConfig";
import { GuildAchievementConfig } from "../achievements/config/GuildAchievementConfig";
interface Achievements {
    USER: UserAchievement<UserAchievementTypeKey, UserAchievementType[UserAchievementTypeKey]>;
    GUILDMEMBER: GuildMemberAchievement<GuildMemberAchievementTypeKey, GuildMemberAchievementType[GuildMemberAchievementTypeKey]>;
    GUILD: GuildAchievement<GuildAchievementTypeKey, GuildMemberAchievementType[GuildMemberAchievementTypeKey]>;
}
interface AchievementTypes {
    USER: UserAchievementType;
    GUILDMEMBER: GuildMemberAchievementType;
    GUILD: GuildAchievementType;
}
interface AchieverConfigs {
    USER: UserAchievementConfig;
    GUILDMEMBER: GuildMemberAchievementConfig;
    GUILD: GuildAchievementConfig;
}
interface Achievers {
    USER: User;
    GUILDMEMBER: GuildMember;
    GUILD: Guild;
}
interface AchievementCallbackParams {
    USER: UserAchievementCallbackParams;
    GUILDMEMBER: GuildMemberAchievementCallbackParams;
    GUILD: GuildAchievementCallbackParams;
}
export declare function AchievementCheckType<AchieverType extends AchieverTypes, AchievementType extends Achievements[AchieverType], Key extends keyof AchievementTypes[AchieverType], Type extends AchievementTypes[AchieverType][Key], CallbackKey extends keyof AchievementCallbackParams[AchieverType]>(client: Client, achieverType: AchieverType, achiever: Achievers[AchieverType], key: Key, keyType: Type, config: AchieverConfigs[AchieverType], callbackKey: CallbackKey, callback: AchievementCallbackParams[AchieverType][CallbackKey][keyof AchievementCallbackParams[AchieverType][CallbackKey]]): Promise<Message>;
interface AchievementCheckData {
    user: User;
    guildMember?: GuildMember;
    guild?: Guild;
}
export declare function AchievementCheck<AchievementType extends GuildMemberAchievementType | GuildAchievementType | AchievementBaseType, Key extends keyof AchievementType, Type extends AchievementType[Key]>(client: Client, data: AchievementCheckData, key: Key, type: Type, callback: any[]): Promise<boolean>;
import { DBExecute } from "../../database";
export { DBExecute };
export declare function getImage(script: string, imageName: string): string;
export declare function getEmote(client: Client, name: string, emoteGuild: Guild): import("discord.js").GuildEmoji | "😵";
export declare function RequestImage(message: Message, pGuildClient: PClient, caller: 'gif' | 'meme', types: string[], searchTerm?: (type: string) => string): Promise<Message>;
export declare class PinguLibrary {
    static PermissionCheck(check: Check, ...permissions: PermissionString[]): string;
    static readonly PermissionGranted = "Permission Granted";
    static Permissions(): {
        given: BitPermission[];
        missing: BitPermission[];
        all: BitPermission[];
    };
    static PinguSupportInvite: string;
    static readonly SavedServers: Collection<SavedServerNames, Guild>;
    static CacheSavedServers(client: Client): Collection<SavedServerNames, Guild>;
    static getSharedServers(client: Client, user: User): Promise<Guild[]>;
    static readonly Developers: Collection<DeveloperNames, User>;
    static CacheDevelopers(client: Client): Promise<Collection<DeveloperNames, User>>;
    static isPinguDev(user: User): boolean;
    static getTextChannel(client: Client, guildID: string, channelName: string): TextChannel;
    static outages(client: Client, message: string): Promise<Message>;
    static DanhoDM(message: string): Promise<Message>;
    static errorCache: Collection<number, Message[]>;
    static errorLog(client: Client, message: string, messageContent?: string, err?: Error, params?: errorLogParams): Promise<Message>;
    static pGuildLog(client: Client, script: string, message: string, err?: Error): Promise<Message>;
    static pUserLog(client: Client, script: string, message: string, err?: Error): Promise<Message>;
    static consoleLog(client: Client, message: string): Promise<Message>;
    static eventLog(client: Client, content: MessageEmbed): Promise<Message>;
    static tellLog(client: Client, sender: User, reciever: User, message: Message | MessageEmbed): Promise<Message>;
    static latencyCheck(client: Client, timestamp: number): Promise<Message>;
    static raspberryLog(client: Client): Promise<Message>;
    static AchievementCheck<AchievementType extends GuildMemberAchievementType | GuildAchievementType | AchievementBaseType, Key extends keyof AchievementType, Type extends AchievementType[Key]>(client: Client, data: AchievementCheckData, key: Key, type: Type, callbackParams: any[]): Promise<boolean>;
    static Badges: Collection<("Pingu Developer" | "Discord Bot Developer") | ("Pingu Staff Member" | "Pingu Support Team" | "Pingu Moderator Team" | "Pingu Administrators") | ("Early Supporter" | "Patreon Supporter") | ("Partnered Developer" | "Partnered Server Owner"), import("../badge/PinguBadge").PinguBadge>;
    static SetBadges(): Collection<("Pingu Developer" | "Discord Bot Developer") | ("Pingu Staff Member" | "Pingu Support Team" | "Pingu Moderator Team" | "Pingu Administrators") | ("Early Supporter" | "Patreon Supporter") | ("Partnered Developer" | "Partnered Server Owner"), import("../badge/PinguBadge").PinguBadge>;
    static getBadges(user: User): Promise<Collection<("Pingu Developer" | "Discord Bot Developer") | ("Pingu Staff Member" | "Pingu Support Team" | "Pingu Moderator Team" | "Pingu Administrators") | ("Early Supporter" | "Patreon Supporter") | ("Partnered Developer" | "Partnered Server Owner"), import("../badge/PinguBadge").PinguBadge>>;
    static getEmote(client: Client, name: string, emoteGuild: Guild): import("discord.js").GuildEmoji | "😵";
    static getImage(script: string, imageName: string): string;
    static DBExecute<T>(client: Client, callback: (mongoose: typeof import('mongoose')) => Promise<T>): Promise<T>;
    static RequestImage(message: Message, pGuildClient: PClient, caller: 'gif' | 'meme', types: string[], searchTerm?: (type: string) => string): Promise<Message>;
}
