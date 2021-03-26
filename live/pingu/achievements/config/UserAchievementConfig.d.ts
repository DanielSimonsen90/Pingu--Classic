import { UserAchievement, UserAchievementTypeKey } from "../items/UserAchievement";
import { Client, User } from "discord.js";
import { AchievementConfigBase } from "../config/AchievementConfigBase";
export declare type UserAchievementNotificationType = 'DM';
export declare class UserAchievementConfig extends AchievementConfigBase {
    constructor(notificationType: UserAchievementNotificationType);
    notificationType: UserAchievementNotificationType;
    notify<Type extends UserAchievementTypeKey>(client: Client, achiever: User, achievement: UserAchievement<Type>): Promise<import("discord.js").Message>;
}
