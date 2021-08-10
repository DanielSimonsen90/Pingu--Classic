import Decidable, { ApproveTypes } from './Decidable';
export declare class Poll extends Decidable {
    yesVotes: number;
    noVotes: number;
    approved: ApproveTypes;
    static Decide(poll: Poll, yesVotes: number, noVotes: number): Poll;
}
export default Poll;
