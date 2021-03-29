import { AchievementConfigBase } from "./AchievementConfigBase";
import { UserAchievementNotificationType } from "./UserAchievementConfig";
import { GuildMemberAchievement, GuildMemberAchievementType } from "../items/GuildMemberAchievement";
import { Client, GuildMember } from "discord.js";
export declare type GuildMemberAchievementNotificationType = UserAchievementNotificationType | 'GUILD';
export declare class GuildMemberAchievementConfig extends AchievementConfigBase {
    constructor(notificationType: GuildMemberAchievementNotificationType);
    notificationType: GuildMemberAchievementNotificationType;
    static notify<Key extends keyof GuildMemberAchievementType>(client: Client, achiever: GuildMember, achievement: GuildMemberAchievement<Key, GuildMemberAchievementType[Key]>, config: GuildMemberAchievementConfig): Promise<import("discord.js").Message>;
}
