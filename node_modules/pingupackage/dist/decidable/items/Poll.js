"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poll = void 0;
const Decidable_1 = require("./Decidable");
class Poll extends Decidable_1.default {
    yesVotes;
    noVotes;
    approved;
    static Decide(poll, yesVotes, noVotes) {
        poll.yesVotes = yesVotes;
        poll.noVotes = noVotes;
        poll.approved =
            poll.yesVotes > poll.noVotes ? 'Approved' :
                poll.noVotes > poll.yesVotes ? 'Denied' : 'Undecided';
        return poll;
    }
}
exports.Poll = Poll;
exports.default = Poll;
