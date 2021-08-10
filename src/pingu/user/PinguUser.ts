import { User } from "discord.js";
import { PUser, PQueue, PGuild } from "../../database";
import { Marry, Daily } from "./items";

import UserAchievementConfig from "../achievements/config/UserAchievementConfig";

export class PinguUser {
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