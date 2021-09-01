import { UserAchievement, UserAchievementType } from "../items/UserAchievement";
import { MessageEmbed, User } from "discord.js";
import { AchievementConfigBase, AchievementBaseNotificationType } from "../config/AchievementConfigBase";
import PinguClientShell from "../../client/PinguClientShell";

export type UserAchievementNotificationType = AchievementBaseNotificationType | 'DM'
export class UserAchievementConfig extends AchievementConfigBase {
    constructor(notificationType: UserAchievementNotificationType) {
        super();
        this.notificationType = notificationType;
    }

    public notificationType: UserAchievementNotificationType;

    public static async notify<Key extends keyof UserAchievementType>(
        client: PinguClientShell, 
        achiever: User, 
        achievement: UserAchievement<Key, UserAchievementType[Key]>, 
        config: UserAchievementConfig
    ) {
        return super._notify(client, achievement, percentage => new MessageEmbed({
            title: `🏆 Achievement Unlocked! 🏆\n${achievement.name}`,
            description: achievement.description,
            footer: { text: `${percentage.value}% of all Pingu users have achieved this!` },
            timestamp: Date.now(),
            thumbnail: { url: achiever.avatarURL() },
            color: client.DefaultEmbedColor
        }), {_id: (await achiever.createDM()).id}, config.notificationType as AchievementBaseNotificationType);
    }
}

export default UserAchievementConfig;