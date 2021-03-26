import { Client, User, Collection } from "discord.js";
import { PUser, PQueue, PGuild } from "../../database";
import { Marry, Daily } from "./items";
import { UserAchievementConfig } from "../achievements/config/UserAchievementConfig";
export declare function WritePUser(client: Client, user: User, scriptName: string, succMsg: string, errMsg: string): Promise<void>;
export declare function GetPUser(user: User): Promise<PinguUser>;
export declare function UpdatePUser(client: Client, updatedProperty: object, pUser: PinguUser, scriptName: string, succMsg: string, errMsg: string): Promise<PinguUser>;
export declare function DeletePUser(client: Client, user: User, scriptName: string, succMsg: string, errMsg: string): Promise<PinguUser>;
export declare function GetPUsers(): Promise<PinguUser[]>;
export declare const cache: Collection<string, PinguUser>;
export declare class PinguUser {
    static WritePUser(client: Client, user: User, scriptName: string, succMsg: string, errMsg: string): Promise<void>;
    static GetPUser(user: User): Promise<PinguUser>;
    static UpdatePUser(client: Client, updatedProperty: object, pUser: PinguUser, scriptName: string, succMsg: string, errMsg: string): Promise<PinguUser>;
    static DeletePUser(client: Client, user: User, scriptName: string, succMsg: string, errMsg: string): Promise<PinguUser>;
    static GetPUsers(): Promise<PinguUser[]>;
    constructor(user: User);
    _id: string;
    tag: string;
    sharedServers: PGuild[];
    marry: Marry;
    replyPerson: PUser;
    daily: Daily;
    avatar: string;
    playlists: PQueue[];
    achievementConfig: UserAchievementConfig;
}
