export declare type AchievementBaseNotificationType = 'NONE';
import { Guild, MessageEmbed } from "discord.js";
import { PChannel, PAchievement } from "../../../database/json";
import Percentage from "../../../helpers/Percentage";
import AchievementBase from "../items/AchievementBase";
import PinguClientShell from "../../client/PinguClientShell";
export declare abstract class AchievementConfigBase {
    enabled: boolean;
    channel: PChannel;
    achievements: PAchievement[];
    protected static _notify(client: PinguClientShell, achievement: AchievementBase, embedCB: (percentage: Percentage) => MessageEmbed, channel: {
        _id: string;
    }, notificationType: AchievementBaseNotificationType, guild?: Guild): Promise<import("discord.js").Message>;
}
export default AchievementConfigBase;
