import { GuildChannel } from 'discord.js';
import { PGuildMember } from '../../database';
import { Decidable } from './Decidable';
export declare class Theme extends Decidable {
    constructor(value: string, id: string, author: PGuildMember, channel: GuildChannel, endsAt: Date);
    winners: Array<PGuildMember>;
}
