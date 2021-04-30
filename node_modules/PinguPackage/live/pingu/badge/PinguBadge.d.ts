declare type DeveloperBadge = 'Pingu Developer' | 'Discord Bot Developer';
declare type StaffBadge = 'Pingu Staff Member' | 'Pingu Support Team' | 'Pingu Moderator Team' | 'Pingu Administrators';
declare type PinguSupporter = 'Early Supporter' | 'Patreon Supporter';
declare type PinguPartners = 'Partnered Developer' | 'Partnered Server Owner';
declare type IAmBadge = DeveloperBadge | StaffBadge | PinguSupporter | PinguPartners;
import { GuildEmoji, Collection, User } from "discord.js";
export declare class PinguBadge {
    constructor(name: IAmBadge, emoji: GuildEmoji, weight: number);
    name: IAmBadge;
    emoji: GuildEmoji;
    weight: number;
}
export declare const Badges: Collection<IAmBadge, PinguBadge>;
export declare function SetBadges(): Collection<IAmBadge, PinguBadge>;
export declare function getBadges(user: User): Promise<Collection<IAmBadge, PinguBadge>>;
export default PinguBadge;
