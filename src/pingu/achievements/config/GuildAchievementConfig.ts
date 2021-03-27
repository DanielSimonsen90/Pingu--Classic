import { Client, Guild, MessageEmbed, Snowflake } from "discord.js";
import { AchievementConfigBase } from "./AchievementConfigBase";
import { GuildAchievement, GuildAchievementType, GuildAchievementTypeKey } from "../items/GuildAchievement";
import { GuildMemberAchievementNotificationType } from "../config/GuildMemberAchievementConfig";

export type GuildAchievementNotificationType = 'OWNER' | 'CHANNEL'

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

    public async notify(client: Client, achiever: Guild, achievement: GuildAchievement<GuildAchievementTypeKey, GuildAchievementType[GuildAchievementTypeKey]>) {
        switch (this.notificationTypes.guild) {
            case 'CHANNEL': return super._notify(client, achievement, (percentage => new MessageEmbed()
                .setTitle(`🏆 Achievement Unlocked! 🏆\n${achievement.name}`)
                .setDescription(achievement.description)
                .setFooter(`${achiever.name} is one of the ${percentage.value}% of servers, that have achieved this!`)
                .setTimestamp(Date.now())
                .setThumbnail(achiever.iconURL())
            ));
            case 'OWNER':
                let { owner } = achiever;
                return super._notify(client, achievement, (percentage) => new MessageEmbed()
                    .setTitle(`🏆 Achievement Unlocked! 🏆\n${achievement.name}`)
                    .setDescription(achievement.description)
                    .setFooter(`${achiever.name} is one of the ${percentage.value}% of servers, that have achieved this!`)
                    .setTimestamp(Date.now())
                    .setThumbnail(achiever.iconURL()
                ), await owner.createDM());
            default: throw { message: `GuildNotificationType **${this.notificationTypes.guild}** was not recognized!`};
        }
    }
}