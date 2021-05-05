"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poll = void 0;
const Decidable_1 = require("./Decidable");
class Poll extends Decidable_1.default {
    static Decide(poll, yesVotes, noVotes) {
        poll.YesVotes = yesVotes;
        poll.NoVotes = noVotes;
        poll.approved =
            poll.YesVotes > poll.NoVotes ? 'Yes' :
                poll.NoVotes > poll.YesVotes ? 'No' : 'Undecided';
        return poll;
    }
}
exports.Poll = Poll;
exports.default = Poll;
