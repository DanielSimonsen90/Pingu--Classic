"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marry = void 0;
const PUser_1 = require("../../../database/json/PUser");
class Marry {
    constructor(partner, internalDate) {
        this.partner = partner;
        this.internalDate = internalDate ? new Date(internalDate) : null;
    }
    marriedMessage() {
        return `You have been ${(this.partner ? `married to <@${this.partner._id}> since` : `single since`)} **${this.internalDate.toLocaleTimeString()}, ${this.internalDate.toLocaleDateString().split('.').join('/')}**`;
    }
    marry(partner) {
        this.internalDate = new Date(Date.now());
        this.partner = new PUser_1.default(partner);
    }
    divorce() {
        this.internalDate = new Date(Date.now());
        this.partner = null;
    }
}
exports.Marry = Marry;
exports.default = Marry;
