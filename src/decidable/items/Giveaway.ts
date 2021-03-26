import { GuildChannel } from 'discord.js';
import { PGuildMember } from '../../database';
import { Decidable } from './Decidable';

export class Giveaway extends Decidable {
    constructor(value: string, id: string, author: PGuildMember, channel: GuildChannel, endsAt: Date) {
        super(value, id, author, channel, endsAt);
        this.winners = new Array<PGuildMember>();
    }
    public winners: PGuildMember[]
}