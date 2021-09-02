"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildAchievementConfig = void 0;
const discord_js_1 = require("discord.js");
const AchievementConfigBase_1 = require("./AchievementConfigBase");
class GuildAchievementConfig extends AchievementConfigBase_1.AchievementConfigBase {
    constructor(notificationTypes, guildID) {
        super();
        this.notificationTypes = notificationTypes;
        this.guildID = guildID;
    }
    guildID;
    notificationTypes;
    static async notify(client, achiever, achievement, config) {
        const color = client.DefaultEmbedColor;
        switch (config.notificationTypes.guild) {
            case 'CHANNEL': return super._notify(client, achievement, percentage => new discord_js_1.MessageEmbed({
                title: `🏆 Achievement Unlocked! 🏆\n${achievement.name}`,
                description: achievement.description,
                footer: { text: `${achiever.name} is one of the ${percentage.value}% of servers, that have achieved this!` },
                color, thumbnail: { url: achiever.iconURL() },
                timestamp: Date.now()
            }), config.channel, config.notificationTypes.guild);
            case 'OWNER':
                const owner = achiever.owner();
                return super._notify(client, achievement, (percentage) => new discord_js_1.MessageEmbed({
                    title: `🏆 Achievement Unlocked! 🏆\n${achievement.name}`,
                    description: achievement.description,
                    footer: { text: `${achiever.name} is one of the ${percentage.value}% of servers, that have achieved this!` },
                    color, thumbnail: { url: achiever.iconURL() },
                    timestamp: Date.now()
                }), { _id: (await owner.createDM()).id }, config.notificationTypes.members);
            default: throw { message: `GuildNotificationType **${config.notificationTypes.guild}** was not recognized!` };
        }
    }
}
exports.GuildAchievementConfig = GuildAchievementConfig;
exports.default = GuildAchievementConfig;
