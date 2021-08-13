"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildAchievementsConfig = exports.AchievementConfig = void 0;
const Achievement_1 = require("./Achievement");
const PItem_1 = require("./PItem");
exports.AchievementConfig = {
    notificationType: String,
    achievements: [Achievement_1.default],
    enabled: Boolean,
    channel: PItem_1.default
};
exports.GuildAchievementsConfig = { ...exports.AchievementConfig,
    guildID: String,
    notificationTypes: {
        guild: String,
        members: String
    }
};
exports.default = exports.AchievementConfig;
