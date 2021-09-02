import { GuildChannel } from 'discord.js';
import PGuildMember from '../../database/json/PGuildMember';
import Decidable from './Decidable';

export class Theme extends Decidable {
    constructor(value: string, id: string, author: PGuildMember, channel: GuildChannel, endsAt: Date) {
        super(value, id, author, channel, endsAt);
        this.winners = null;
    }
    public winners: Array<PGuildMember>
}

export default Theme;