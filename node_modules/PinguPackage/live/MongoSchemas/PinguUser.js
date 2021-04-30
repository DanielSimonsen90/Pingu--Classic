"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguUserSchema = void 0;
const mongoose = require("mongoose");
const parts_1 = require("./parts");
exports.PinguUserSchema = mongoose.model('PinguUser', new mongoose.Schema({
    _id: String,
    tag: String,
    sharedServers: [parts_1.PItem],
    marry: parts_1.Marry,
    replyPerson: parts_1.PItem,
    daily: parts_1.Daily,
    avatar: String,
    playlists: [parts_1.Playlist],
    achievementConfig: parts_1.AchievementsConfig,
    joinedAt: Date
}));
exports.default = exports.PinguUserSchema;
