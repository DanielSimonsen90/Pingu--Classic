import { Client, DMChannel, Guild, MessageEmbed, TextChannel } from "discord.js";
import { PChannel, PAchievement } from "../../../database/json";
import { Percentage } from "../../../helpers/Percentage";
import { AchievementBase } from "../items/AchievementBase";
export declare abstract class AchievementConfigBase {
    enabled: boolean;
    channel: PChannel;
    achievements: PAchievement[];
    protected _notify(client: Client, achievement: AchievementBase, embed: (percentage: Percentage) => MessageEmbed, channel?: DMChannel | TextChannel, guild?: Guild): Promise<import("discord.js").Message>;
}
