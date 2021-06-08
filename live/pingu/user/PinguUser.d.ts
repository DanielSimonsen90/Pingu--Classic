import { Client, User, Collection } from "discord.js";
import { PUser, PQueue, PGuild } from "../../database";
import { Marry, Daily } from "./items";
import UserAchievementConfig from "../achievements/config/UserAchievementConfig";
export declare function WritePUser(client: Client, user: User, scriptName: string, reason: string): Promise<PinguUser>;
export declare function GetPUser(user: User): Promise<PinguUser>;
declare type PinguUserUpdate = 'tag' | 'sharedServers' | 'marry' | 'replyPerson' | 'daily' | 'avatar' | 'playlists' | 'achievementConfig';
export declare function UpdatePUser(client: Client, updatedProperties: PinguUserUpdate[], pUser: PinguUser, scriptName: string, reason: string): Promise<PinguUser>;
export declare function DeletePUser(client: Client, user: User, scriptName: string, reason: string): Promise<void>;
export declare function GetPinguUsers(): Promise<PinguUser[]>;
export declare function GetUpdatedProperty(preUser: User, user: User): Promise<PinguUserUpdate[]>;
export declare const cache: Collection<string, PinguUser>;
export declare class PinguUser {
    /**Creates and adds a new PinguUser from provided User and returns the new PinguUser object
     * @param client Client that is creating a new PinguUser
     * @param user User that is being saved to the database
     * @param scriptName Script that the method is being called from
     * @param reason Reason to add PinguUser to database
     * @returns The PinguUser that was just created*/
    static Write(client: Client, user: User, scriptName: string, reason: string): Promise<PinguUser>;
    /**"Convert" from discord.js.User to PinguPackage.PinguUser
     * @param user The user to look for in the database
     * @returns PinguUser entry matching specified User*/
    static Get(user: User): Promise<PinguUser>;
    /**Updates specified Pingu User to MongoDB
     * @param client Client that called the method
     * @param updatedProperties List of property strings that should update in database, when method has ran
     * @param pUser User that is being updated
     * @param scriptName Name of the script that called this method
     * @param reason Reason for updating
     * @returns Updated Pingu User*/
    static Update(client: Client, updatedProperties: PinguUserUpdate[], pUser: PinguUser, scriptName: string, reason: string): Promise<PinguUser>;
    /**Deletes specified user from Pingu's database.
     * @param client Client that is running the function
     * @param user User that is being deleted
     * @param scriptName Name of the script that called the function
     * @param reason Successfully deleted PinguUser: reason
     * @returns what is there to return?*/
    static Delete(client: Client, user: User, scriptName: string, reason: string): Promise<void>;
    /**Gets all PinguUsers from databse
     * @returns All PinguUsers from database*/
    static GetUsers(): Promise<PinguUser[]>;
    /**Get an object with properties, that matters to the PinguUser table
     * @param preUser Previous user before userUpdate event
     * @param user Current user after userUpdate event
     * @returns Object with properties that matters to the PinguUser table*/
    static GetUpdatedProperty(preUser: User, user: User): Promise<PinguUserUpdate[]>;
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
    joinedAt: Date;
}
export default PinguUser;
