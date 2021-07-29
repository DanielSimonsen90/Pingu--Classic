import { Guild, Snowflake } from "discord.js";
import { AchievementConfigBase, AchievementBaseNotificationType } from "./AchievementConfigBase";
import { GuildAchievement, GuildAchievementType, GuildAchievementTypeKey } from "../items/GuildAchievement";
import { GuildMemberAchievementNotificationType } from "../config/GuildMemberAchievementConfig";
import BasePinguClient from "../../client/BasePinguClient";
export declare type GuildAchievementNotificationType = AchievementBaseNotificationType | 'OWNER' | 'CHANNEL';
interface Notifications {
    guild: GuildAchievementNotificationType;
    members: GuildMemberAchievementNotificationType;
}
export declare class GuildAchievementConfig extends AchievementConfigBase {
    constructor(notificationTypes: Notifications, guildID: Snowflake);
    guildID: Snowflake;
    notificationTypes: Notifications;
    static notify(client: BasePinguClient, achiever: Guild, achievement: GuildAchievement<GuildAchievementTypeKey, GuildAchievementType[GuildAchievementTypeKey]>, config: GuildAchievementConfig): Promise<import("discord.js").Message>;
}
export default GuildAchievementConfig;
