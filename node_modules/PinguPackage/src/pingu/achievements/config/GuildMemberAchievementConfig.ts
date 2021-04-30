import { Client, GuildMember, MessageEmbed } from "discord.js";
import { AchievementConfigBase, AchievementBaseNotificationType } from "./AchievementConfigBase";
import { UserAchievementNotificationType } from "./UserAchievementConfig";
import { GuildMemberAchievement, GuildMemberAchievementType } from "../items/GuildMemberAchievement";
import { ToPinguClient } from "../../client/PinguClient";

export type GuildMemberAchievementNotificationType = UserAchievementNotificationType | 'GUILD'
export class GuildMemberAchievementConfig extends AchievementConfigBase {
    constructor(notificationType: GuildMemberAchievementNotificationType) {
        super();
        this.notificationType = notificationType;
    }

    public notificationType: GuildMemberAchievementNotificationType;

    public static async notify<Key extends keyof GuildMemberAchievementType>(client: Client, achiever: GuildMember, achievement: GuildMemberAchievement<Key, GuildMemberAchievementType[Key]>, config: GuildMemberAchievementConfig) {
        return super._notify(client, achievement, percentage => new MessageEmbed()
            .setTitle(`🏆 Achievement Unlocked! 🏆\n${achievement.name}`)
            .setDescription(achievement.description)
            .setFooter(`${percentage.value}% of all members have achieved this!`)
            .setTimestamp(Date.now())
            .setThumbnail(achiever.user.avatarURL())
            .setColor(ToPinguClient(client).DefaultEmbedColor)
            , config.channel || {_id: (await achiever.user.createDM()).id }, 
            config.notificationType as AchievementBaseNotificationType, 
            achiever.guild
        )
    }
}

export default GuildMemberAchievementConfig;