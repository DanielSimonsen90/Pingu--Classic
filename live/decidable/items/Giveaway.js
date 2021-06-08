"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Giveaway = void 0;
const Decidable_1 = require("./Decidable");
class Giveaway extends Decidable_1.default {
    constructor(value, id, author, channel, endsAt) {
        super(value, id, author, channel, endsAt);
        this.winners = new Array();
    }
}
exports.Giveaway = Giveaway;
exports.default = Giveaway;
