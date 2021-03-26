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
exports.GuildMemberAchievement = void 0;
const AchievementBase_1 = require("./AchievementBase");
const PinguGuild_1 = require("../../guild/PinguGuild");
const helpers_1 = require("../../../helpers");
class GuildMemberAchievement extends AchievementBase_1.AchievementBase {
    constructor(id, name, key, type, description) {
        super(id, name, description);
        this.key = key;
        this.type = type;
    }
    getPercentage(guild) {
        return __awaiter(this, void 0, void 0, function* () {
            let pGuildMembers = (yield PinguGuild_1.GetPGuild(guild)).members.array();
            let whole = pGuildMembers.length;
            let part = pGuildMembers.filter(pGuildMember => pGuildMember.achievementsConfig.achievements.find(a => a._id == this._id)).length;
            return new helpers_1.Percentage(whole, part);
        });
    }
}
exports.GuildMemberAchievement = GuildMemberAchievement;
GuildMemberAchievement.Achievements = [];
