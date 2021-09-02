import { GuildMember, MessageEmbed } from "discord.js";
import { AchievementConfigBase, AchievementBaseNotificationType } from "./AchievementConfigBase";
import { UserAchievementNotificationType } from "./UserAchievementConfig";
import { GuildMemberAchievement, GuildMemberAchievementType } from "../items/GuildMemberAchievement";
import PinguClientBase from "../../client/PinguClientBase";

export type GuildMemberAchievementNotificationType = UserAchievementNotificationType | 'GUILD'
export class GuildMemberAchievementConfig extends AchievementConfigBase {
    constructor(notificationType: GuildMemberAchievementNotificationType) {
        super();
        this.notificationType = notificationType;
    }

    public notificationType: GuildMemberAchievementNotificationType;

    public static async notify<Key extends keyof GuildMemberAchievementType>(client: PinguClientBase, achiever: GuildMember, achievement: GuildMemberAchievement<Key, GuildMemberAchievementType[Key]>, config: GuildMemberAchievementConfig) {
        return super._notify(client, achievement, percentage => new MessageEmbed({
            title: `🏆 Achievement Unlocked! 🏆\n${achievement.name}`,
            description: achievement.description,
            footer: { text: `${percentage.value}% of all members have achieved this!` },
            timestamp: Date.now(),
            thumbnail: { url: achiever.user.avatarURL() },
            color: client.DefaultEmbedColor
        }), config.channel || {_id: (await achiever.user.createDM()).id }, 
            config.notificationType as AchievementBaseNotificationType, 
            achiever.guild
        )
    }
}

export default GuildMemberAchievementConfig;