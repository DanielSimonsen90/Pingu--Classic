import Decidable, { ApproveTypes } from './Decidable';

export class Poll extends Decidable {
    public yesVotes: number
    public noVotes: number
    public approved: ApproveTypes

    public static Decide(poll: Poll, yesVotes: number, noVotes: number) {
        poll.yesVotes = yesVotes;
        poll.noVotes = noVotes;
        poll.approved =
            poll.yesVotes > poll.noVotes ? 'Approved' :
                poll.noVotes > poll.yesVotes ? 'Denied' : 'Undecided';
        return poll;
    }
}

export default Poll;