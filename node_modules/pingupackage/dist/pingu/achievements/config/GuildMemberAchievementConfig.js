"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildMemberAchievementConfig = void 0;
const discord_js_1 = require("discord.js");
const AchievementConfigBase_1 = require("./AchievementConfigBase");
class GuildMemberAchievementConfig extends AchievementConfigBase_1.AchievementConfigBase {
    constructor(notificationType) {
        super();
        this.notificationType = notificationType;
    }
    notificationType;
    static async notify(client, achiever, achievement, config) {
        return super._notify(client, achievement, percentage => new discord_js_1.MessageEmbed({
            title: `🏆 Achievement Unlocked! 🏆\n${achievement.name}`,
            description: achievement.description,
            footer: { text: `${percentage.value}% of all members have achieved this!` },
            timestamp: Date.now(),
            thumbnail: { url: achiever.user.avatarURL() },
            color: client.DefaultEmbedColor
        }), config.channel || { _id: (await achiever.user.createDM()).id }, config.notificationType, achiever.guild);
    }
}
exports.GuildMemberAchievementConfig = GuildMemberAchievementConfig;
exports.default = GuildMemberAchievementConfig;
