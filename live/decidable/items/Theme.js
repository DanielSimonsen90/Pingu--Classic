"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme = void 0;
const Decidable_1 = require("./Decidable");
class Theme extends Decidable_1.default {
    constructor(value, id, author, channel, endsAt) {
        super(value, id, author, channel, endsAt);
        this.winners = null;
    }
}
exports.Theme = Theme;
exports.default = Theme;
