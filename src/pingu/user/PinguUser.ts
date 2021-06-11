import { Client, User, Collection } from "discord.js";
import { PUser, PQueue, PGuild } from "../../database";
import { Marry, Daily } from "./items";
import UserAchievementConfig from "../achievements/config/UserAchievementConfig";

import PinguUserSchema from '../../MongoSchemas/PinguUser';
import { DBExecute, pUserLog, AchievementCheckType } from '../library/PinguLibrary'

import { Error, Reason } from "../../helpers";

//#region CRUD
export async function WritePUser(client: Client, user: User, scriptName: string, reason: string) {
    return DBExecute(client, async mongoose => {
        let pUser = new PinguUser(user);
        let created = await new PinguUserSchema(pUser).save()

        const log = new Reason('create', 'PinguUser', pUser.tag, reason);
        pUserLog(client, scriptName, (created ? log.succMsg : log.errMsg));
        cache.set(user.id, pUser);

        let ownedPinguGuilds = client.guilds.cache.filter(g => g.ownerID == user.id).array();
        if (ownedPinguGuilds.length)
            await AchievementCheckType(client, 'USER', user, 'EVENT', 'guildCreate', pUser.achievementConfig, 'EVENT', [ownedPinguGuilds[0]]);

        return pUser;
    });
}
export async function GetPUser(user: User): Promise<PinguUser> {
    let pUser = cache.get(user.id);
    if (pUser) return pUser;

    let pUserDoc = await PinguUserSchema.findOne({ _id: user.id as unknown }).exec();
    if (!pUserDoc) return null;

    pUser = pUserDoc.toObject() as unknown as PinguUser;
    cache.set(user.id, pUser);
    return pUser;
}

type PinguUserUpdate = 'tag' | 'sharedServers' | 'marry' | 'replyPerson' | 'daily' | 'avatar' | 'playlists' | 'achievementConfig';
export async function UpdatePUser(client: Client, updatedProperties: PinguUserUpdate[], pUser: PinguUser, scriptName: string, reason: string): Promise<PinguUser> {
    await PinguUserSchema.updateOne({ _id: pUser._id as unknown }, getUpdatedProperty(), null, async err => {
        const log = new Reason('update', 'PinguUser', pUser.tag, reason);
        
        if (err) return pUserLog(client, scriptName, log.errMsg, err);
        pUserLog(client, scriptName, log.succMsg);

        cache.set(pUser._id, pUser); 
    })
    return pUser;

    function getUpdatedProperty() {
        interface IPinguUserUpdate {
            tag?: string,
            sharedServers?: PGuild[],
            marry?: Marry,
            replyPerson?: PUser,
            daily?: Daily,
            avatar?: string,
            playlists?: PQueue[],
            achievementConfig?: UserAchievementConfig
        }
        const result = {} as IPinguUserUpdate;
        for (const prop of updatedProperties) {
            switch (prop) {
                case 'tag': result.tag = pUser.tag;  break;
                case 'sharedServers': result.sharedServers = pUser.sharedServers;  break;
                case 'marry': result.marry = pUser.marry;  break;
                case 'replyPerson': result.replyPerson = pUser.replyPerson;  break;
                case 'daily': result.daily = pUser.daily;  break;
                case 'playlists': result.playlists = pUser.playlists;  break;
                case 'achievementConfig': result.achievementConfig = pUser.achievementConfig;  break;
                default: throw new Error(`${prop} is not a recognized property!`); 
            }
        }
        return result;
    }
}
export async function DeletePUser(client: Client, user: User, scriptName: string, reason: string): Promise<void> {
    await PinguUserSchema.deleteOne({ _id: user.id as unknown }, null, err => {
        const log = new Reason('delete', 'PinguUser', user.tag, reason);

        if (err) return pUserLog(client, scriptName, log.errMsg, new Error(err));
        else pUserLog(client, scriptName, log.succMsg);
        cache.delete(user.id);
    });
    return;
}
export async function GetPinguUsers(): Promise<PinguUser[]> {
    return (await PinguUserSchema.find({}).exec()).map(collDoc => collDoc.toObject()) as unknown as PinguUser[];
}
//#endregion
export async function GetUpdatedProperty(preUser: User, user: User) {
    if (user.bot) return;

    const updated: PinguUserUpdate[] = [];

    if (user.avatarURL() != preUser.avatarURL()) updated.push('avatar');
    if (user.tag != preUser.tag) updated.push('tag');

    return updated;
}

export const cache = new Collection<string, PinguUser>(); 

export class PinguUser {
    //#region Statics
    /**Creates and adds a new PinguUser from provided User and returns the new PinguUser object
     * @param client Client that is creating a new PinguUser
     * @param user User that is being saved to the database
     * @param scriptName Script that the method is being called from
     * @param reason Reason to add PinguUser to database
     * @returns The PinguUser that was just created*/
    public static async Write(client: Client, user: User, scriptName: string, reason: string) { return WritePUser(client, user, scriptName, reason) }
    /**"Convert" from discord.js.User to PinguPackage.PinguUser
     * @param user The user to look for in the database
     * @returns PinguUser entry matching specified User*/
    public static async Get(user: User): Promise<PinguUser> { return GetPUser(user); }
    /**Updates specified Pingu User to MongoDB
     * @param client Client that called the method
     * @param updatedProperties List of property strings that should update in database, when method has ran
     * @param pUser User that is being updated
     * @param scriptName Name of the script that called this method
     * @param reason Reason for updating
     * @returns Updated Pingu User*/
    public static async Update(client: Client, updatedProperties: PinguUserUpdate[], pUser: PinguUser, scriptName: string, reason: string): Promise<PinguUser> { return UpdatePUser(client, updatedProperties, pUser, scriptName, reason); }
    /**Deletes specified user from Pingu's database.
     * @param client Client that is running the function
     * @param user User that is being deleted
     * @param scriptName Name of the script that called the function
     * @param reason Successfully deleted PinguUser: reason
     * @returns what is there to return?*/
    public static async Delete(client: Client, user: User, scriptName: string, reason: string): Promise<void> { return DeletePUser(client, user, scriptName, reason); }
    /**Gets all PinguUsers from databse
     * @returns All PinguUsers from database*/
    public static async GetUsers(): Promise<PinguUser[]> { return GetPinguUsers(); }
    /**Get an object with properties, that matters to the PinguUser table
     * @param preUser Previous user before userUpdate event
     * @param user Current user after userUpdate event
     * @returns Object with properties that matters to the PinguUser table*/
    public static async GetUpdatedProperty(preUser: User, user: User) { return GetUpdatedProperty(preUser, user); }
    //#endregion

    constructor(user: User) {
        let pUser = new PUser(user);
        this._id = pUser._id;
        this.tag = pUser.name;
        this.sharedServers = user.client.guilds.cache.filter(g => g.members.cache.has(user.id)).map(g => new PGuild(g));
        this.marry = new Marry();
        this.replyPerson = null;
        this.daily = new Daily();
        this.avatar = user.avatarURL();
        this.playlists = new Array<PQueue>();
        this.achievementConfig = new UserAchievementConfig('NONE');
        this.joinedAt = new Date(Date.now());
    }
    public _id: string
    public tag: string
    public sharedServers: PGuild[]
    public marry: Marry
    public replyPerson: PUser
    public daily: Daily
    public avatar: string
    public playlists: PQueue[]
    public achievementConfig: UserAchievementConfig
    public joinedAt: Date
}

export default PinguUser;