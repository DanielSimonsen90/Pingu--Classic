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
exports.PinguGuildMember = exports.GetPGuildMembers = exports.DeletePGuildMember = exports.UpdatePGuildMember = exports.GetPGuildMember = exports.WritePGuildMember = void 0;
const json_1 = require("../../database/json");
const PinguGuild_1 = require("../guild/PinguGuild");
const PinguUser_1 = require("../user/PinguUser");
const PinguLibrary_1 = require("../library/PinguLibrary");
const GuildMemberAchievementConfig_1 = require("../achievements/config/GuildMemberAchievementConfig");
function WritePGuildMember(member, log) {
    return __awaiter(this, void 0, void 0, function* () {
        let pGuild = yield PinguGuild_1.GetPGuild(member.guild);
        let pGuildMember = new PinguGuildMember(member, pGuild.settings.config.achievements.notificationTypes.members);
        pGuild.members.set(member.id, pGuildMember);
        if (log)
            PinguLibrary_1.pGuildLog(member.client, "guildMemberAdd", `**${member.displayName}** was successfully added to **${pGuild.name}**'s PinguGuild's members.`);
        return pGuildMember;
    });
}
exports.WritePGuildMember = WritePGuildMember;
function GetPGuildMember(member) {
    return __awaiter(this, void 0, void 0, function* () {
        let pGuild = yield PinguGuild_1.GetPGuild(member.guild);
        let pgm = pGuild.members.get(member.id);
        if (pgm)
            return pgm;
        pgm = new PinguGuildMember(member, pGuild.settings.config.achievements.notificationTypes.members);
        pGuild.members.set(pgm._id, pgm);
        yield PinguGuild_1.UpdatePGuild(member.client, { members: pGuild.members }, pGuild, 'GetPGuildMember()', `Added **${pgm.name}** as a member of **${pGuild.name}**.`, `Failed to add **${pgm.name}** as a member of **${pGuild.name}**.`);
        return pgm;
    });
}
exports.GetPGuildMember = GetPGuildMember;
function UpdatePGuildMember(member, pGuildMember, scriptName, succMsg, errMsg) {
    return __awaiter(this, void 0, void 0, function* () {
        let pGuild = yield PinguGuild_1.GetPGuild(member.guild);
        pGuild.members.set(pGuildMember._id, pGuildMember);
        return PinguGuild_1.UpdatePGuild(member.client, { members: pGuild.members }, pGuild, scriptName, succMsg, errMsg);
    });
}
exports.UpdatePGuildMember = UpdatePGuildMember;
function DeletePGuildMember(member) {
    return __awaiter(this, void 0, void 0, function* () {
        let pGuild = yield PinguGuild_1.GetPGuild(member.guild);
        pGuild.members.delete(member.id);
        return PinguGuild_1.UpdatePGuild(member.client, { members: pGuild.members }, pGuild, 'guildMemberRemove', `Successfully updated **${pGuild.name}**'s members, after **${member.user.tag}** left the guild.`, `Failed to remove **${member.user.tag}** from **${pGuild.name}**'s PinguGuild's members!`);
    });
}
exports.DeletePGuildMember = DeletePGuildMember;
function GetPGuildMembers(guild) {
    return __awaiter(this, void 0, void 0, function* () {
        let pGuild = yield PinguGuild_1.GetPGuild(guild);
        return pGuild.members.array();
    });
}
exports.GetPGuildMembers = GetPGuildMembers;
class PinguGuildMember extends json_1.PGuildMember {
    //#endregion
    constructor(member, achievementNotificationType) {
        super(member);
        this.guild = new json_1.PGuild(member.guild);
        this.achievementsConfig = new GuildMemberAchievementConfig_1.GuildMemberAchievementConfig(achievementNotificationType);
    }
    //#region Statics
    static WritePGuildMember(member, log) {
        return __awaiter(this, void 0, void 0, function* () { return WritePGuildMember(member, log); });
    }
    static GetPGuildMember(member) {
        return __awaiter(this, void 0, void 0, function* () { return GetPGuildMember(member); });
    }
    static UpdatePGuildMember(guild, pGuildMember, scriptName, succmsg, errMsg) {
        return __awaiter(this, void 0, void 0, function* () { return UpdatePGuildMember(guild, pGuildMember, scriptName, succmsg, errMsg); });
    }
    static DeletePGuildMember(member) {
        return __awaiter(this, void 0, void 0, function* () { return DeletePGuildMember(member); });
    }
    static GetPGuildMembers(guild) {
        return __awaiter(this, void 0, void 0, function* () { return GetPGuildMembers(guild); });
    }
    //public warnings: ??
    pGuild() {
        return PinguGuild_1.cache.get(this.guild._id);
    }
    pUser() {
        return PinguUser_1.cache.get(this._id);
    }
}
exports.PinguGuildMember = PinguGuildMember;
