import { AchievementConfigBase } from "./AchievementConfigBase";
import { UserAchievementNotificationType } from "./UserAchievementConfig";
import { GuildMemberAchievement, GuildMemberAchievementTypeKey } from "../items/GuildMemberAchievement";
import { Client, GuildMember } from "discord.js";
export declare type GuildMemberAchievementNotificationType = UserAchievementNotificationType | 'GUILD';
export declare class GuildMemberAchievementConfig extends AchievementConfigBase {
    constructor(notificationType: GuildMemberAchievementNotificationType);
    notificationType: GuildMemberAchievementNotificationType;
    notify<Type extends GuildMemberAchievementTypeKey>(client: Client, achiever: GuildMember, achievement: GuildMemberAchievement<Type>): Promise<import("discord.js").Message>;
}
