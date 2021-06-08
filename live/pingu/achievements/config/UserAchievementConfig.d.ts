import { UserAchievement, UserAchievementType } from "../items/UserAchievement";
import { Client, User } from "discord.js";
import { AchievementConfigBase, AchievementBaseNotificationType } from "../config/AchievementConfigBase";
export declare type UserAchievementNotificationType = AchievementBaseNotificationType | 'DM';
export declare class UserAchievementConfig extends AchievementConfigBase {
    constructor(notificationType: UserAchievementNotificationType);
    notificationType: UserAchievementNotificationType;
    static notify<Key extends keyof UserAchievementType>(client: Client, achiever: User, achievement: UserAchievement<Key, UserAchievementType[Key]>, config: UserAchievementConfig): Promise<import("discord.js").Message>;
}
export default UserAchievementConfig;
