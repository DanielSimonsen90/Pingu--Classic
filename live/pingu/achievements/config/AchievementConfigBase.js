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
exports.AchievementConfigBase = void 0;
class AchievementConfigBase {
    constructor() {
        this.enabled = true;
        this.achievements = new Array();
    }
    static _notify(client, achievement, embedCB, channel, notificationType, guild) {
        return __awaiter(this, void 0, void 0, function* () {
            const [announceChannel, percentage] = yield Promise.all([client.channels.fetch(channel._id), achievement.getPercentage(client, guild)]);
            const embed = embedCB(percentage);
            client.log('achievement', embed);
            if (notificationType == 'NONE')
                return null;
            client.DanhoDM(`Messaging ${(guild || announceChannel.guild ? guild.owner : announceChannel.recipient)} as their notificationtype = ${notificationType}`);
            try {
                let message = yield announceChannel.send(embed);
                yield message.react(client.emotes.guild(client.savedServers.get('Pingu Support')).get('hypers'));
                return message;
            }
            catch (_a) {
                return null;
            }
        });
    }
}
exports.AchievementConfigBase = AchievementConfigBase;
exports.default = AchievementConfigBase;
