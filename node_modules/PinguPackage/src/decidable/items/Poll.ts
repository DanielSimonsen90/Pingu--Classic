import { Decidable } from './Decidable';

export class Poll extends Decidable {
    public YesVotes: number
    public NoVotes: number
    public approved: string

    public static Decide(poll: Poll, yesVotes: number, noVotes: number) {
        poll.YesVotes = yesVotes;
        poll.NoVotes = noVotes;
        poll.approved =
            poll.YesVotes > poll.NoVotes ? 'Yes' :
                poll.NoVotes > poll.YesVotes ? 'No' : 'Undecided';
        return poll;
    }
}