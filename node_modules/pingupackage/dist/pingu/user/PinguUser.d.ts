import { User } from "discord.js";
import { PUser, PQueue, PGuild } from "../../database";
import { Marry, Daily } from "./items";
import UserAchievementConfig from "../achievements/config/UserAchievementConfig";
export declare class PinguUser {
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
