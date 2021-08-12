"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAchievementConfig = void 0;
const discord_js_1 = require("discord.js");
const AchievementConfigBase_1 = require("../config/AchievementConfigBase");
class UserAchievementConfig extends AchievementConfigBase_1.AchievementConfigBase {
    constructor(notificationType) {
        super();
        this.notificationType = notificationType;
    }
    notificationType;
    static async notify(client, achiever, achievement, config) {
        return super._notify(client, achievement, percentage => new discord_js_1.MessageEmbed({
            title: `🏆 Achievement Unlocked! 🏆\n${achievement.name}`,
            description: achievement.description,
            footer: { text: `${percentage.value}% of all Pingu users have achieved this!` },
            timestamp: Date.now(),
            thumbnail: { url: achiever.avatarURL() },
            color: client.DefaultEmbedColor
        }), { _id: (await achiever.createDM()).id }, config.notificationType);
    }
}
exports.UserAchievementConfig = UserAchievementConfig;
exports.default = UserAchievementConfig;
