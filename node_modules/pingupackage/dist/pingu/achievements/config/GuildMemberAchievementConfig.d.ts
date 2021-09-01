import { GuildMember } from "discord.js";
import { AchievementConfigBase } from "./AchievementConfigBase";
import { UserAchievementNotificationType } from "./UserAchievementConfig";
import { GuildMemberAchievement, GuildMemberAchievementType } from "../items/GuildMemberAchievement";
import PinguClientShell from "../../client/PinguClientShell";
export declare type GuildMemberAchievementNotificationType = UserAchievementNotificationType | 'GUILD';
export declare class GuildMemberAchievementConfig extends AchievementConfigBase {
    constructor(notificationType: GuildMemberAchievementNotificationType);
    notificationType: GuildMemberAchievementNotificationType;
    static notify<Key extends keyof GuildMemberAchievementType>(client: PinguClientShell, achiever: GuildMember, achievement: GuildMemberAchievement<Key, GuildMemberAchievementType[Key]>, config: GuildMemberAchievementConfig): Promise<import("discord.js").Message>;
}
export default GuildMemberAchievementConfig;
