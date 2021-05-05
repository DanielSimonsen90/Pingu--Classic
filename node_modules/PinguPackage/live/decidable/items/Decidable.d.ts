import { GuildChannel } from 'discord.js';
import { PGuildMember, PChannel } from '../../database/json';
export declare class Decidable {
    constructor(value: string, id: string, author: PGuildMember, channel: GuildChannel, endsAt: Date);
    value: string;
    _id: string;
    author: PGuildMember;
    channel: PChannel;
    endsAt: Date;
}
export default Decidable;
