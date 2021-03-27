import { UserAchievement, UserAchievementType } from "../items/UserAchievement";
import { Client, MessageEmbed, User } from "discord.js";
import { AchievementConfigBase } from "../config/AchievementConfigBase";

export type UserAchievementNotificationType = 'DM'
export class UserAchievementConfig extends AchievementConfigBase {
    constructor(notificationType: UserAchievementNotificationType) {
        super();
        this.notificationType = notificationType;
    }

    public notificationType: UserAchievementNotificationType;

    public async notify<Key extends keyof UserAchievementType>(client: Client, achiever: User, achievement: UserAchievement<Key, UserAchievementType[Key]>) {
        return super._notify(client, achievement, (percentage => new MessageEmbed()
            .setTitle(`🏆 Achievement Unlocked! 🏆\n${achievement.name}`)
            .setDescription(achievement.description)
            .setFooter(`${percentage.value}% of all Pingu users have achieved this!`)
            .setTimestamp(Date.now())
            .setThumbnail(achiever.avatarURL())
        ), await achiever.createDM());
    }
}