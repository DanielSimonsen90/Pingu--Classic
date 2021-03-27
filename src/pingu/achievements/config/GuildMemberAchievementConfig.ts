import { AchievementConfigBase } from "./AchievementConfigBase";
import { UserAchievementNotificationType } from "./UserAchievementConfig";
import { GuildMemberAchievement, GuildMemberAchievementType, GuildMemberAchievementTypeKey } from "../items/GuildMemberAchievement";
import { Client, GuildMember, MessageEmbed } from "discord.js";

export type GuildMemberAchievementNotificationType = UserAchievementNotificationType | 'GUILD'
export class GuildMemberAchievementConfig extends AchievementConfigBase {
    constructor(notificationType: GuildMemberAchievementNotificationType) {
        super();
        this.notificationType = notificationType;
    }

    public notificationType: GuildMemberAchievementNotificationType;

    public notify<Key extends keyof GuildMemberAchievementType>(client: Client, achiever: GuildMember, achievement: GuildMemberAchievement<Key, GuildMemberAchievementType[Key]>) {
        return super._notify(client, achievement, (percentage => new MessageEmbed()
            .setTitle(`🏆 Achievement Unlocked! 🏆\n${achievement.name}`)
            .setDescription(achievement.description)
            .setFooter(`${percentage.value}% of all members have achieved this!`)
            .setTimestamp(Date.now())
            .setThumbnail(achiever.user.avatarURL())
        ))
    }
}