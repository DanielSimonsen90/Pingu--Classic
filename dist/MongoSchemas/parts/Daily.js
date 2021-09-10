"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Daily = void 0;
const TimeSpan_1 = require("./TimeSpan");
exports.Daily = {
    lastClaim: Date,
    nextClaim: TimeSpan_1.default,
    streak: Number
};
exports.default = exports.Daily;
