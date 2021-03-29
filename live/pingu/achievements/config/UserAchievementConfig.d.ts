import { UserAchievement, UserAchievementType } from "../items/UserAchievement";
import { Client, User } from "discord.js";
import { AchievementConfigBase } from "../config/AchievementConfigBase";
export declare type UserAchievementNotificationType = 'DM';
export declare class UserAchievementConfig extends AchievementConfigBase {
    constructor(notificationType: UserAchievementNotificationType);
    notificationType: UserAchievementNotificationType;
    static notify<Key extends keyof UserAchievementType>(client: Client, achiever: User, achievement: UserAchievement<Key, UserAchievementType[Key]>): Promise<import("discord.js").Message>;
}
