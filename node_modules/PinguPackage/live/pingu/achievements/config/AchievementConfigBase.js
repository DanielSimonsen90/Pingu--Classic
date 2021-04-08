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
const PinguLibrary_1 = require("../../library/PinguLibrary");
class AchievementConfigBase {
    constructor() {
        this.enabled = true;
    }
    static _notify(client, achievement, embed, channel, guild) {
        return __awaiter(this, void 0, void 0, function* () {
            const [announceChannel, percentage] = yield Promise.all([client.channels.fetch(channel._id), achievement.getPercentage(guild)]);
            let message = yield announceChannel.send(embed(percentage));
            yield message.react(PinguLibrary_1.SavedServers.PinguSupport(client).emojis.cache.find(e => e.name == 'hypers'));
            return message;
        });
    }
}
exports.AchievementConfigBase = AchievementConfigBase;
