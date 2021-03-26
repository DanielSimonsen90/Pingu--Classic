import { Client, User, Collection } from "discord.js";
import { PUser, PQueue, PGuild } from "../../database";
import { Marry, Daily } from "./items";
import { UserAchievementConfig } from "../achievements/config/UserAchievementConfig";

import { PinguUserSchema } from '../../MongoSchemas/PinguUser';
import { DBExecute, pUserLog } from '../library/PinguLibrary'

import { Error } from "../../helpers";

export async function WritePUser(client: Client, user: User, scriptName: string, succMsg: string, errMsg: string) {
    DBExecute(client, async mongoose => {
        let created = await new PinguUserSchema(new PinguUser(user)).save();
        if (!created) pUserLog(client, scriptName, errMsg);
        else pUserLog(client, scriptName, succMsg);
    });
}
export async function GetPUser(user: User): Promise<PinguUser> {
    let pUserDoc = await PinguUserSchema.findOne({ _id: user.id }).exec();
    if (!pUserDoc) return null;
    cache.set(user.id, pUserDoc.toObject());
    return pUserDoc.toObject();
}
export async function UpdatePUser(client: Client, updatedProperty: object, pUser: PinguUser, scriptName: string, succMsg: string, errMsg: string): Promise<PinguUser> {
    return await PinguUserSchema.updateOne({ _id: pUser._id }, updatedProperty, null, async err => {
        if (err) return pUserLog(client, scriptName, errMsg, err);
        pUserLog(client, scriptName, succMsg);

        cache.set(pUser._id, await GetPUser({ id: pUser._id })); 
    })
}
export async function DeletePUser(client: Client, user: User, scriptName: string, succMsg: string, errMsg: string): Promise<PinguUser> {
    return await PinguUserSchema.deleteOne({ _id: user.id }, null, err => {
        if (err) pUserLog(client, scriptName, errMsg, new Error(err));
        else pUserLog(client, scriptName, succMsg);
    });
}
export async function GetPUsers(): Promise<PinguUser[]> {
    return (await PinguUserSchema.find({}).exec()).map(collDoc => collDoc.toObject());
}

export const cache = new Collection<string, PinguUser>(); 

export class PinguUser {
    public static async WritePUser(client: Client, user: User, scriptName: string, succMsg: string, errMsg: string) {
        return WritePUser(client, user, scriptName, succMsg, errMsg)
    }
    public static async GetPUser(user: User): Promise<PinguUser> {
        return GetPUser(user);
    }
    public static async UpdatePUser(client: Client, updatedProperty: object, pUser: PinguUser, scriptName: string, succMsg: string, errMsg: string): Promise<PinguUser> {
        return UpdatePUser(client, updatedProperty, pUser, scriptName, succMsg, errMsg);
    }
    public static async DeletePUser(client: Client, user: User, scriptName: string, succMsg: string, errMsg: string): Promise<PinguUser> {
        return DeletePUser(client, user, scriptName, succMsg, errMsg);
    }
    public static async GetPUsers(): Promise<PinguUser[]> {
        return GetPUsers();
    }

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
        this.achievementConfig = new UserAchievementConfig('DM');
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
}