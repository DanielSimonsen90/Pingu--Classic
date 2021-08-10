"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguGuildMember = void 0;
const json_1 = require("../../database/json");
const GuildMemberAchievementConfig_1 = require("../achievements/config/GuildMemberAchievementConfig");
class PinguGuildMember extends json_1.PGuildMember {
    constructor(member, achievementNotificationType) {
        super(member);
        this.guild = new json_1.PGuild(member.guild);
        this.achievementConfig = new GuildMemberAchievementConfig_1.GuildMemberAchievementConfig(achievementNotificationType);
    }
}
exports.PinguGuildMember = PinguGuildMember;
exports.default = PinguGuildMember;
