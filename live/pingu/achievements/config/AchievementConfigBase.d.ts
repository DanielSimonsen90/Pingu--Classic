import { Client, DMChannel, Guild, MessageEmbed, TextChannel } from "discord.js";
import { PChannel, PAchievement } from "../../../database/json";
import { Percentage } from "../../../helpers/Percentage";
import { GuildAchievement, GuildAchievementTypeKey as GuildKey, GuildMemberAchievement, GuildMemberAchievementTypeKey as MemberKey, UserAchievement, UserAchievementTypeKey as UserKey } from "../items";
interface AchievementClasses {
    GUILD: GuildAchievement<GuildKey>;
    GUILDMEMBER: GuildMemberAchievement<MemberKey>;
    USER: UserAchievement<UserKey>;
}
export declare abstract class AchievementConfigBase {
    enabled: boolean;
    channel: PChannel;
    achievements: PAchievement[];
    protected _notify<AchieverType extends keyof AchievementClasses>(client: Client, achievement: AchievementClasses[AchieverType], embed: (percentage: Percentage) => MessageEmbed, channel?: DMChannel | TextChannel, guild?: Guild): Promise<import("discord.js").Message>;
}
export {};
