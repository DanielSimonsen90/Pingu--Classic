import { UserAchievement, UserAchievementType } from "../items/UserAchievement";
import { User } from "discord.js";
import { AchievementConfigBase, AchievementBaseNotificationType } from "../config/AchievementConfigBase";
import BasePinguClient from "../../client/BasePinguClient";
export declare type UserAchievementNotificationType = AchievementBaseNotificationType | 'DM';
export declare class UserAchievementConfig extends AchievementConfigBase {
    constructor(notificationType: UserAchievementNotificationType);
    notificationType: UserAchievementNotificationType;
    static notify<Key extends keyof UserAchievementType>(client: BasePinguClient, achiever: User, achievement: UserAchievement<Key, UserAchievementType[Key]>, config: UserAchievementConfig): Promise<import("discord.js").Message>;
}
export default UserAchievementConfig;
