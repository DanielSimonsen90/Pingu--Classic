"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Daily = void 0;
const TimeLeftObject_1 = require("./TimeLeftObject");
exports.Daily = {
    lastClaim: Date,
    nextClaim: TimeLeftObject_1.default,
    streak: Number
};
exports.default = exports.Daily;
