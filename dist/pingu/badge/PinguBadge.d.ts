declare type DeveloperBadge = 'Pingu Developer' | 'Discord Bot Developer';
declare type StaffBadge = 'Pingu Staff Member' | 'Pingu Support Team' | 'Pingu Moderator Team' | 'Pingu Administrators';
declare type PinguSupporter = 'Early Supporter' | 'Patreon Supporter';
declare type PinguPartners = 'Partnered Developer' | 'Partnered Server Owner';
export declare type IAmBadge = DeveloperBadge | StaffBadge | PinguSupporter | PinguPartners;
import { GuildEmoji, Collection, User, UserFlagsString } from "discord.js";
import PinguClientBase, { SavedServerNames } from "../client/PinguClientBase";
export declare class PinguBadge {
    constructor(name: IAmBadge, emoji: GuildEmoji, weight: number);
    name: IAmBadge;
    emoji: GuildEmoji;
    weight: number;
}
declare class TempBadge {
    constructor(name: IAmBadge, emojiName: string, guild: SavedServerNames, weight: number);
    name: IAmBadge;
    emojiName: string;
    guild: SavedServerNames;
    weight: number;
}
export declare const TempBadges: Collection<IAmBadge, TempBadge>;
export declare function getBadges(user: User): Promise<Collection<IAmBadge, PinguBadge>>;
export declare function UserFlagBadges(client: PinguClientBase, ...flags: UserFlagsString[]): (GuildEmoji | "😵")[];
export default PinguBadge;
