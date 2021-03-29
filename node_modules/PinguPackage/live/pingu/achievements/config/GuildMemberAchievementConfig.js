"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildMemberAchievementConfig = void 0;
const AchievementConfigBase_1 = require("./AchievementConfigBase");
const discord_js_1 = require("discord.js");
const PinguClient_1 = require("../../client/PinguClient");
class GuildMemberAchievementConfig extends AchievementConfigBase_1.AchievementConfigBase {
    constructor(notificationType) {
        super();
        this.notificationType = notificationType;
    }
    static notify(client, achiever, achievement, config) {
        return super._notify(client, achievement, (percentage => new discord_js_1.MessageEmbed()
            .setTitle(`🏆 Achievement Unlocked! 🏆\n${achievement.name}`)
            .setDescription(achievement.description)
            .setFooter(`${percentage.value}% of all members have achieved this!`)
            .setTimestamp(Date.now())
            .setThumbnail(achiever.user.avatarURL())
            .setColor(PinguClient_1.ToPinguClient(client).DefaultEmbedColor)), config.channel);
    }
}
exports.GuildMemberAchievementConfig = GuildMemberAchievementConfig;
