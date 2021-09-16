import { GuildChannel } from 'discord.js';
import PGuildMember from '../../database/json/PGuildMember';
import Decidable, { ApproveTypes } from './Decidable';

export class Suggestion extends Decidable {
    constructor(value: string, id: string, suggester: PGuildMember, channel: GuildChannel) {
        super(value, id, suggester, channel, null);
        this.decidedBy = null;
    }

    public static Decide(suggestion: Suggestion, approved: boolean, decidedBy: PGuildMember) {
        suggestion.approved = approved ? 'Approved' : 'Denied';
        suggestion.decidedBy = decidedBy;
        return suggestion;
    }
    public decidedBy: PGuildMember
    public approved: ApproveTypes = "Undecided"
}

export default Suggestion;