import { Client, Guild, Snowflake } from "discord.js";
import { AchievementConfigBase } from "./AchievementConfigBase";
import { GuildAchievement, GuildAchievementType, GuildAchievementTypeKey } from "../items/GuildAchievement";
import { GuildMemberAchievementNotificationType } from "../config/GuildMemberAchievementConfig";
export declare type GuildAchievementNotificationType = 'OWNER' | 'CHANNEL';
interface Notifications {
    guild: GuildAchievementNotificationType;
    members: GuildMemberAchievementNotificationType;
}
export declare class GuildAchievementConfig extends AchievementConfigBase {
    constructor(notificationTypes: Notifications, guildID: Snowflake);
    guildID: Snowflake;
    notificationTypes: Notifications;
    notify(client: Client, achiever: Guild, achievement: GuildAchievement<GuildAchievementTypeKey, GuildAchievementType[GuildAchievementTypeKey]>): Promise<import("discord.js").Message>;
}
export {};
