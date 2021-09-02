import { Client, Guild, MessageEmbed, Snowflake } from "discord.js";
import { AchievementConfigBase, AchievementBaseNotificationType } from "./AchievementConfigBase";
import { GuildAchievement, GuildAchievementType, GuildAchievementTypeKey } from "../items/GuildAchievement";
import { GuildMemberAchievementNotificationType } from "../config/GuildMemberAchievementConfig";
import BasePinguClient from "../../client/BasePinguClient";

export type GuildAchievementNotificationType = AchievementBaseNotificationType | 'OWNER' | 'CHANNEL'

interface Notifications {
    guild: GuildAchievementNotificationType,
    members: GuildMemberAchievementNotificationType
}
export class GuildAchievementConfig extends AchievementConfigBase {
    constructor(notificationTypes: Notifications, guildID: Snowflake) {
        super();
        this.notificationTypes = notificationTypes;
        this.guildID = guildID;
    }

    public guildID: Snowflake
    public notificationTypes: Notifications;

    public static async notify(client: BasePinguClient, achiever: Guild, achievement: GuildAchievement<GuildAchievementTypeKey, GuildAchievementType[GuildAchievementTypeKey]>, config: GuildAchievementConfig) {
        const color = client.DefaultEmbedColor;
        switch (config.notificationTypes.guild) {
            case 'CHANNEL': return super._notify(client, achievement, percentage => new MessageEmbed()
                .setTitle(`🏆 Achievement Unlocked! 🏆\n${achievement.name}`)
                .setDescription(achievement.description)
                .setFooter(`${achiever.name} is one of the ${percentage.value}% of servers, that have achieved this!`)
                .setTimestamp(Date.now())
                .setThumbnail(achiever.iconURL())
                .setColor(color)
            , config.channel, config.notificationTypes.guild as AchievementBaseNotificationType);
            case 'OWNER':
                const owner = achiever.owner()
                return super._notify(client, achievement, (percentage) => new MessageEmbed()
                    .setTitle(`🏆 Achievement Unlocked! 🏆\n${achievement.name}`)
                    .setDescription(achievement.description)
                    .setFooter(`${achiever.name} is one of the ${percentage.value}% of servers, that have achieved this!`)
                    .setTimestamp(Date.now())
                    .setThumbnail(achiever.iconURL())
                    .setColor(color)
            , {_id: (await owner.createDM()).id }, config.notificationTypes.members as AchievementBaseNotificationType);
            default: throw { message: `GuildNotificationType **${config.notificationTypes.guild}** was not recognized!`};
        }
    }
}

export default GuildAchievementConfig;