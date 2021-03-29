"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecidableItem = void 0;
const PItem_1 = require("./PItem");
exports.DecidableItem = {
    value: String,
    _id: String,
    author: PItem_1.PItem,
    channel: PItem_1.PItem,
    endsAt: Date
};
