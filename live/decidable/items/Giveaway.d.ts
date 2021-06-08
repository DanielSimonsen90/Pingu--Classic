import { GuildChannel } from 'discord.js';
import PGuildMember from '../../database/json/PGuildMember';
import Decidable from './Decidable';
export declare class Giveaway extends Decidable {
    constructor(value: string, id: string, author: PGuildMember, channel: GuildChannel, endsAt: Date);
    winners: PGuildMember[];
}
export default Giveaway;
