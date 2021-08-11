"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildMemberAchievementConfig = void 0;
const discord_js_1 = require("discord.js");
const AchievementConfigBase_1 = require("./AchievementConfigBase");
class GuildMemberAchievementConfig extends AchievementConfigBase_1.AchievementConfigBase {
    constructor(notificationType) {
        super();
        this.notificationType = notificationType;
    }
    static notify(client, achiever, achievement, config) {
        const _super = Object.create(null, {
            _notify: { get: () => super._notify }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super._notify.call(this, client, achievement, percentage => new discord_js_1.MessageEmbed({
                title: `🏆 Achievement Unlocked! 🏆\n${achievement.name}`,
                description: achievement.description,
                footer: { text: `${percentage.value}% of all members have achieved this!` },
                timestamp: Date.now(),
                thumbnail: { url: achiever.user.avatarURL() },
                color: client.DefaultEmbedColor
            }), config.channel || { _id: (yield achiever.user.createDM()).id }, config.notificationType, achiever.guild);
        });
    }
}
exports.GuildMemberAchievementConfig = GuildMemberAchievementConfig;
exports.default = GuildMemberAchievementConfig;