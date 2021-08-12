"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Daily = void 0;
class Daily {
    constructor() {
        this.lastClaim = null;
        this.nextClaim = null;
        this.streak = 0;
    }
    lastClaim;
    nextClaim;
    streak;
}
exports.Daily = Daily;
exports.default = Daily;
