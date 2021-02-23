import { Decidable } from './Decidable';
export declare class Poll extends Decidable {
    YesVotes: number;
    NoVotes: number;
    approved: string;
    static Decide(poll: Poll, yesVotes: number, noVotes: number): Poll;
}
