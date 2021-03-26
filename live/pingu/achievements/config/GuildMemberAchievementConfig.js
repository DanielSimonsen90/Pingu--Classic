"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildMemberAchievementConfig = void 0;
const AchievementConfigBase_1 = require("./AchievementConfigBase");
const discord_js_1 = require("discord.js");
class GuildMemberAchievementConfig extends AchievementConfigBase_1.AchievementConfigBase {
    constructor(notificationType) {
        super();
        this.notificationType = notificationType;
    }
    notify(client, achiever, achievement) {
        return super._notify(client, achievement, (percentage => new discord_js_1.MessageEmbed()
            .setTitle(`🏆 Achievement Unlocked! 🏆\n${achievement.name}`)
            .setDescription(achievement.description)
            .setFooter(`${percentage.value}% of all members have achieved this!`)
            .setTimestamp(Date.now())
            .setThumbnail(achiever.user.avatarURL())));
    }
}
exports.GuildMemberAchievementConfig = GuildMemberAchievementConfig;
