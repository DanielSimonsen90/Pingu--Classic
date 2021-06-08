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
const PinguLibrary_1 = require("../library/PinguLibrary");
const GuildMemberAchievementConfig_1 = require("../achievements/config/GuildMemberAchievementConfig");
function WritePGuildMember(member, scriptName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (member.user.bot)
            return null;
        const { client, guild, id } = member;
        let pGuild = yield PinguGuild_1.GetPGuild(guild);
        let pGuildMember = new PinguGuildMember(member, pGuild.settings.config.achievements.notificationTypes.members);
        pGuild.members.set(id, pGuildMember);
        yield PinguGuild_1.UpdatePGuild(client, ['members'], pGuild, scriptName, `${member.user.tag} was added to ${pGuild.name}'s PinguGuild.members.`);
        //Add join achievement
        yield PinguLibrary_1.AchievementCheckType(client, 'GUILDMEMBER', member, 'EVENT', 'guildMemberAdd', pGuildMember.achievementConfig, 'EVENT', [member]);
        return pGuildMember;
    });
}
exports.WritePGuildMember = WritePGuildMember;
function GetPGuildMember(member, scriptName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!member)
            return null;
        let pGuild = yield PinguGuild_1.GetPGuild(member.guild);
        let pgm = pGuild.members.get(member.id); //Can returns Mongoose.Document<PinguGuildMember>(?)
        return pgm ? pgm.toObject ? pgm.toObject() : pgm : WritePGuildMember(member, scriptName);
    });
}
exports.GetPGuildMember = GetPGuildMember;
function UpdatePGuildMember(member, pGuildMember, scriptName, reason) {
    return __awaiter(this, void 0, void 0, function* () {
        let pGuild = yield PinguGuild_1.GetPGuild(member.guild);
        pGuild.members.set(pGuildMember._id, pGuildMember);
        PinguGuild_1.UpdatePGuild(member.client, ['members'], pGuild, scriptName, reason);
        return pGuildMember;
    });
}
exports.UpdatePGuildMember = UpdatePGuildMember;
function DeletePGuildMember(member) {
    return __awaiter(this, void 0, void 0, function* () {
        let pGuild = yield PinguGuild_1.GetPGuild(member.guild);
        pGuild.members.delete(member.id);
        PinguGuild_1.UpdatePGuild(member.client, ['members'], pGuild, 'guildMemberRemove', `**${pGuild.name}**'s members, after **${member.user.tag}** left the guild.`);
        return;
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
        this.achievementConfig = new GuildMemberAchievementConfig_1.GuildMemberAchievementConfig(achievementNotificationType);
    }
    //#region Statics
    /**Writes and adds Member as PinguGuildMember to database and returns the new object
     * @param member Member to add as PinguGuildMember
     * @param log Whether to log it in #pGuildLog or not
     * @returns The new PinguGuildMember*/
    static Write(member, scriptName) {
        return __awaiter(this, void 0, void 0, function* () { return WritePGuildMember(member, scriptName); });
    }
    /**Get the PinguGuildMember from provided member
     * @param member Member to get as PinguGuildMember
     * @param scriptName Script that called the method
     * @returns The provided member as PinguGuildMember*/
    static Get(member, scriptName) {
        return __awaiter(this, void 0, void 0, function* () { return GetPGuildMember(member, scriptName); });
    }
    /**Updates provided PinguGuildMember to the database
     * @param member Member to update
     * @param pGuildMember PinguGuildMember update
     * @param scriptName Script that called the method
     * @param reason Reason for updating the PinguGuildMember
     * @returns The updated PinguGuildMember*/
    static Update(member, pGuildMember, scriptName, reason) {
        return __awaiter(this, void 0, void 0, function* () { return UpdatePGuildMember(member, pGuildMember, scriptName, reason); });
    }
    /**Deletes provided member from their guild's PinguGuild's members map
     * @param member Member to delete
     * @returns what should it return?*/
    static Delete(member) {
        return __awaiter(this, void 0, void 0, function* () { return DeletePGuildMember(member); });
    }
    /**Get all PinguGuildMembers from specified guild
     * @param guild Guild to get all PinguGuildMembers from
     * @returns All PinguGuildMembers from specified guild*/
    static GetGuildMembers(guild) {
        return __awaiter(this, void 0, void 0, function* () { return GetPGuildMembers(guild); });
    }
}
exports.PinguGuildMember = PinguGuildMember;
exports.default = PinguGuildMember;
