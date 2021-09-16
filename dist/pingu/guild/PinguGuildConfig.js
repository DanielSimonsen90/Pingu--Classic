"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguGuildConfig = void 0;
const DecidablesConfig_1 = require("../../decidable/config/DecidablesConfig");
const GuildAchievementConfig_1 = require("../achievements/config/GuildAchievementConfig");
class PinguGuildConfig {
    constructor(guild) {
        this.decidables = new DecidablesConfig_1.default(guild);
        this.achievements = new GuildAchievementConfig_1.default({
            guild: 'NONE',
            members: 'NONE'
        }, guild.id);
    }
    decidables;
    achievements;
}
exports.PinguGuildConfig = PinguGuildConfig;
exports.default = PinguGuildConfig;