"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Suggestion = void 0;
const Decidable_1 = require("./Decidable");
class Suggestion extends Decidable_1.default {
    constructor(value, id, suggester, channel) {
        super(value, id, suggester, channel, null);
        this.approved = "Undecided";
        this.decidedBy = null;
    }
    static Decide(suggestion, approved, decidedBy) {
        suggestion.approved = approved ? 'Approved' : 'Denied';
        suggestion.decidedBy = decidedBy;
        return suggestion;
    }
}
exports.Suggestion = Suggestion;
exports.default = Suggestion;
