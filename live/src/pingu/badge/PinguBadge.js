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
exports.getBadges = exports.SetBadges = exports.Badges = exports.PinguBadge = void 0;
const discord_js_1 = require("discord.js");
class PinguBadge {
    constructor(name, emoji, weight) {
        this.name = name;
        this.emoji = emoji;
        this.weight = weight;
    }
}
exports.PinguBadge = PinguBadge;
const PinguLibrary_1 = require("../library/PinguLibrary");
class TempBadge {
    constructor(name, emojiName, guild, weight) {
        this.name = name;
        this.emojiName = emojiName;
        this.guild = guild;
        this.weight = weight;
    }
}
const TempBadges = new discord_js_1.Collection()
    .set('Pingu Developer', new TempBadge('Pingu Developer', 'PinguDeveloper', 'Pingu Support', 1))
    .set('Pingu Administrators', new TempBadge('Pingu Administrators', 'BadgeAdministratorTeam', 'Pingu Support', 2))
    .set('Pingu Moderator Team', new TempBadge('Pingu Moderator Team', 'BadgeModeratorTeam', 'Pingu Support', 3))
    .set('Pingu Support Team', new TempBadge('Pingu Support Team', 'BadgeSupportTeam', 'Pingu Support', 4))
    .set('Pingu Staff Member', new TempBadge('Pingu Staff Member', 'BadgeStaffTeam', 'Pingu Support', 5))
    .set('Partnered Developer', new TempBadge('Partnered Developer', 'PinguPartnerDev', 'Pingu Emotes', 6))
    .set('Partnered Server Owner', new TempBadge('Partnered Server Owner', 'PinguPartnerServer', 'Pingu Emotes', 7))
    //.set('Patreon Supporter', new TempBadge('Patreon Supporter', null, 'Pingu Support', 8))
    .set('Early Supporter', new TempBadge('Early Supporter', 'BadgeEarlySupporter', 'Danho Misc', 9))
    .set('Discord Bot Developer', new TempBadge('Discord Bot Developer', 'BotDeveloper', 'Pingu Support', 10));
exports.Badges = new discord_js_1.Collection();
function SetBadges() {
    for (const [name, tempBadge] of TempBadges) {
        let guild = PinguLibrary_1.SavedServers.get(tempBadge.guild);
        let emoji = guild.emojis.cache.find(e => e.name == tempBadge.emojiName);
        exports.Badges.set(name, new PinguBadge(name, emoji, tempBadge.weight));
    }
    return exports.Badges;
}
exports.SetBadges = SetBadges;
const PinguUser_1 = require("../user/PinguUser");
function getBadges(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const PinguSupportMembers = PinguLibrary_1.SavedServers.get('Pingu Support').members;
        let badgeNames = new Array();
        function toReturnValue() {
            return badgeNames
                .reduce((result, name) => result.set(name, exports.Badges.get(name)), new discord_js_1.Collection())
                .sort((a, b) => a.weight - b.weight);
        }
        const releaseDate = Date.now(); //TODO: Change when Pingu is finally released
        let pUser = yield PinguUser_1.GetPUser(user);
        if (pUser && pUser.joinedAt && new Date(pUser.joinedAt).getTime() < releaseDate)
            badgeNames.push('Early Supporter');
        let isPinguSupportMember = PinguSupportMembers.cache.has(user.id);
        if (!isPinguSupportMember) {
            return toReturnValue();
        }
        let rolesToGiveBadge = (function setRolesToGive() {
            return new discord_js_1.Collection()
                .set('Discord Bot Developer', 'Discord Bot Developer')
                .set('Partnered Server Owner', 'Partnered Server Owner')
                .set('Partnered Bot Developer', 'Partnered Developer')
                .set('Pingu Staff', 'Pingu Staff Member')
                .set('Support Team', 'Pingu Support Team')
                .set('Moderators', 'Pingu Moderator Team')
                .set('Administrators', 'Pingu Administrators')
                .set('Pingu Developers', 'Pingu Developer');
        })();
        let member = yield PinguSupportMembers.fetch(user);
        badgeNames.push(...member.roles.cache
            .map(role => rolesToGiveBadge.get(role.name)) //For each role member has, get a "IAmBadge" type if applicable
            .filter(v => v)); //Filter away those that are null/undefined
        //Add Patreon badge
        return toReturnValue();
    });
}
exports.getBadges = getBadges;
