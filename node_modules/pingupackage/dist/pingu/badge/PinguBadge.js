"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBadges = exports.TempBadges = exports.PinguBadge = void 0;
const discord_js_1 = require("discord.js");
class PinguBadge {
    constructor(name, emoji, weight) {
        this.name = name;
        this.emoji = emoji;
        this.weight = weight;
    }
    name;
    emoji;
    weight;
}
exports.PinguBadge = PinguBadge;
class TempBadge {
    constructor(name, emojiName, guild, weight) {
        this.name = name;
        this.emojiName = emojiName;
        this.guild = guild;
        this.weight = weight;
    }
    name;
    emojiName;
    guild;
    weight;
}
exports.TempBadges = new discord_js_1.Collection([
    ['Pingu Developer', new TempBadge('Pingu Developer', 'PinguDeveloper', 'Pingu Support', 1)],
    ['Pingu Administrators', new TempBadge('Pingu Administrators', 'BadgeAdministratorTeam', 'Pingu Support', 2)],
    ['Pingu Moderator Team', new TempBadge('Pingu Moderator Team', 'BadgeModeratorTeam', 'Pingu Support', 3)],
    ['Pingu Support Team', new TempBadge('Pingu Support Team', 'BadgeSupportTeam', 'Pingu Support', 4)],
    ['Pingu Staff Member', new TempBadge('Pingu Staff Member', 'BadgeStaffTeam', 'Pingu Support', 5)],
    ['Partnered Developer', new TempBadge('Partnered Developer', 'PinguPartnerDev', 'Pingu Emotes', 6)],
    ['Partnered Server Owner', new TempBadge('Partnered Server Owner', 'PinguPartnerServer', 'Pingu Emotes', 7)],
    //  ['Patreon Supporter', new TempBadge('Patreon Supporter', null, 'Pingu Support', 8)],
    ['Early Supporter', new TempBadge('Early Supporter', 'BadgeEarlySupporter', 'Danho Misc', 9)],
    ['Discord Bot Developer', new TempBadge('Discord Bot Developer', 'BotDeveloper', 'Pingu Support', 10)],
]);
async function getBadges(user) {
    const client = user.client;
    const PinguSupportMembers = client.savedServers.get('Pingu Support').members;
    let badgeNames = new Array();
    function toReturnValue() {
        return badgeNames
            .reduce((result, name) => result.set(name, client.badges.get(name)), new discord_js_1.Collection())
            .sort((a, b) => a.weight - b.weight);
    }
    const releaseDate = Date.now(); //TODO: Change when Pingu is finally released
    let pUser = client.pUsers.get(user);
    if (pUser?.joinedAt && new Date(pUser.joinedAt).getTime() < releaseDate)
        badgeNames.push('Early Supporter');
    let isPinguSupportMember = PinguSupportMembers.cache.has(user.id);
    if (!isPinguSupportMember) {
        if (client.developers.isPinguDev(user))
            badgeNames.push('Pingu Developer');
        return toReturnValue();
    }
    let rolesToGiveBadge = new discord_js_1.Collection([
        ['Discord Bot Developer', 'Discord Bot Developer'],
        ['Discord Bot Developer', 'Discord Bot Developer'],
        ['Partnered Server Owner', 'Partnered Server Owner'],
        ['Partnered Bot Developer', 'Partnered Developer'],
        ['Pingu Staff', 'Pingu Staff Member'],
        ['Support Team', 'Pingu Support Team'],
        ['Moderators', 'Pingu Moderator Team'],
        ['Administrators', 'Pingu Administrators'],
        ['Pingu Developers', 'Pingu Developer']
    ]);
    let member = await PinguSupportMembers.fetch(user);
    badgeNames.push(...member.roles.cache
        .map(role => rolesToGiveBadge.get(role.name)) //For each role member has, get a "IAmBadge" type if applicable
        .filter(v => v)); //Filter away those that are null/undefined
    //Add Patreon badge
    return toReturnValue();
}
exports.getBadges = getBadges;
exports.default = PinguBadge;
