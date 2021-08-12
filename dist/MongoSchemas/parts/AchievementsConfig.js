"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildAchievementsConfig = exports.AchievementsConfig = void 0;
const Achievement_1 = require("./Achievement");
const PItem_1 = require("./PItem");
exports.AchievementsConfig = {
    notificationType: String,
    achievements: [Achievement_1.Achievement],
    enabled: Boolean,
    channel: PItem_1.PItem
};
exports.GuildAchievementsConfig = { ...exports.AchievementsConfig,
    guildID: String,
    notificationTypes: {
        guild: String,
        members: String
    }
};
