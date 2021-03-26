import { AchievementConfigBase } from "./AchievementConfigBase";
import { UserAchievementNotificationType } from "./UserAchievementConfig";
import { GuildMemberAchievement, GuildMemberAchievementTypeKey } from "../items/GuildMemberAchievement";
import { Client, GuildMember, MessageEmbed } from "discord.js";

export type GuildMemberAchievementNotificationType = UserAchievementNotificationType | 'GUILD'
export class GuildMemberAchievementConfig extends AchievementConfigBase {
    constructor(notificationType: GuildMemberAchievementNotificationType) {
        super();
        this.notificationType = notificationType;
    }

    public notificationType: GuildMemberAchievementNotificationType;

    public notify<Type extends GuildMemberAchievementTypeKey>(client: Client, achiever: GuildMember, achievement: GuildMemberAchievement<Type>) {
        return super._notify<'GUILDMEMBER'>(client, achievement, (percentage => new MessageEmbed()
            .setTitle(`🏆 Achievement Unlocked! 🏆\n${achievement.name}`)
            .setDescription(achievement.description)
            .setFooter(`${percentage.value}% of all members have achieved this!`)
            .setTimestamp(Date.now())
            .setThumbnail(achiever.user.avatarURL())
        ))
    }
}