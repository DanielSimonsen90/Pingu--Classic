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
exports.UserAchievementConfig = void 0;
const discord_js_1 = require("discord.js");
const AchievementConfigBase_1 = require("../config/AchievementConfigBase");
const PinguClient_1 = require("../../client/PinguClient");
class UserAchievementConfig extends AchievementConfigBase_1.AchievementConfigBase {
    constructor(notificationType) {
        super();
        this.notificationType = notificationType;
    }
    static notify(client, achiever, achievement, config) {
        const _super = Object.create(null, {
            _notify: { get: () => super._notify }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super._notify.call(this, client, achievement, percentage => new discord_js_1.MessageEmbed()
                .setTitle(`🏆 Achievement Unlocked! 🏆\n${achievement.name}`)
                .setDescription(achievement.description)
                .setFooter(`${percentage.value}% of all Pingu users have achieved this!`)
                .setTimestamp(Date.now())
                .setThumbnail(achiever.avatarURL())
                .setColor(PinguClient_1.ToPinguClient(client).DefaultEmbedColor), { _id: (yield achiever.createDM()).id }, config.notificationType);
        });
    }
}
exports.UserAchievementConfig = UserAchievementConfig;
exports.default = UserAchievementConfig;
