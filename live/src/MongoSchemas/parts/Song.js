"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Song = void 0;
const PItem_1 = require("./PItem");
exports.Song = {
    _id: Number,
    title: String,
    link: String,
    author: String,
    thumbnail: String,
    length: String,
    lengthMS: Number,
    volume: Number,
    playing: Boolean,
    loop: Boolean,
    endsAt: Date,
    requestedBy: PItem_1.PItem
};
