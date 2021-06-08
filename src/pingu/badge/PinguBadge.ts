type DeveloperBadge = 'Pingu Developer' | 'Discord Bot Developer';
type StaffBadge = 'Pingu Staff Member' | 'Pingu Support Team' | 'Pingu Moderator Team' | 'Pingu Administrators';
type PinguSupporter = 'Early Supporter' | 'Patreon Supporter';
type PinguPartners = 'Partnered Developer' | 'Partnered Server Owner';

type IAmBadge = DeveloperBadge | StaffBadge | PinguSupporter | PinguPartners;

import { GuildEmoji, Collection, User } from "discord.js";
export class PinguBadge {
    constructor(name: IAmBadge, emoji: GuildEmoji, weight: number) {
        this.name = name;
        this.emoji = emoji;
        this.weight = weight;
    }

    public name: IAmBadge;
    public emoji: GuildEmoji;
    public weight: number;
}

import { SavedServers, SavedServerNames, Developers } from "../library/PinguLibrary";
class TempBadge {
    constructor(name: IAmBadge, emojiName: string, guild: SavedServerNames, weight: number) {
        this.name = name;
        this.emojiName = emojiName;   
        this.guild = guild;
        this.weight = weight;
    }
    
    public name: IAmBadge;
    public emojiName: string;
    public guild: SavedServerNames;
    public weight: number;
}
const TempBadges = new Collection<IAmBadge, TempBadge>([
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
])

export const Badges = new Collection<IAmBadge, PinguBadge>();
export function SetBadges() {
    for (const [name, tempBadge] of TempBadges) {
        let guild = SavedServers.get(tempBadge.guild);
        let emoji = guild.emojis.cache.find(e => e.name == tempBadge.emojiName);
        Badges.set(name, new PinguBadge(name, emoji, tempBadge.weight));
    }
    return Badges;
}

import { GetPUser } from "../user/PinguUser";
export async function getBadges(user: User) {
    const PinguSupportMembers = SavedServers.get('Pingu Support').members;
    let badgeNames = new Array<IAmBadge>();

    function toReturnValue() {
        return badgeNames
        .reduce((result, name) => 
            result.set(name, Badges.get(name)), 
            new Collection<IAmBadge, PinguBadge>())
        .sort((a, b) => a.weight - b.weight);
    }

    const releaseDate = Date.now(); //TODO: Change when Pingu is finally released
    let pUser = await GetPUser(user);
    if (pUser && pUser.joinedAt && new Date(pUser.joinedAt).getTime() < releaseDate)
        badgeNames.push('Early Supporter');

    let isPinguSupportMember = PinguSupportMembers.cache.has(user.id);
    if (!isPinguSupportMember) {
        if (Developers.has(user.tag as any))
            badgeNames.push('Pingu Developer');
        return toReturnValue();
    }

    let rolesToGiveBadge = new Collection<string, IAmBadge>([
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
        .map(role => rolesToGiveBadge.get(role.name))   //For each role member has, get a "IAmBadge" type if applicable
        .filter(v => v));                                 //Filter away those that are null/undefined

    //Add Patreon badge

    return toReturnValue();
}

export default PinguBadge;