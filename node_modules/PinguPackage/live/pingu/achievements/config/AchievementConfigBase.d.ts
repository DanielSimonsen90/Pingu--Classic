import { Client, Guild, MessageEmbed } from "discord.js";
import { PChannel, PAchievement } from "../../../database/json";
import { Percentage } from "../../../helpers/Percentage";
import { AchievementBase } from "../items/AchievementBase";
export declare abstract class AchievementConfigBase {
    enabled: boolean;
    channel: PChannel;
    achievements: PAchievement[];
    protected static _notify(client: Client, achievement: AchievementBase, embed: (percentage: Percentage) => MessageEmbed, channel: {
        _id: string;
    }, guild?: Guild): Promise<import("discord.js").Message>;
}
