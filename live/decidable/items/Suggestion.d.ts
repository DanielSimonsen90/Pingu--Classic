import { GuildChannel } from 'discord.js';
import PGuildMember from '../../database/json/PGuildMember';
import Decidable from './Decidable';
export declare class Suggestion extends Decidable {
    constructor(value: string, id: string, suggester: PGuildMember, channel: GuildChannel);
    static Decide(suggestion: Suggestion, approved: boolean, decidedBy: PGuildMember): Suggestion;
    decidedBy: PGuildMember;
    approved: string;
}
export default Suggestion;
