"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguGuildSchema = void 0;
const mongoose = require("mongoose");
const parts_1 = require("./parts");
const PinguGuildSchema = mongoose.model('PinguGuild', new mongoose.Schema({
    _id: String,
    name: String,
    guildOwner: parts_1.PItem,
    clients: [parts_1.PClient],
    members: {
        type: Map,
        of: parts_1.PinguGuildMember
    },
    settings: parts_1.PinguGuildSettings,
}));
exports.PinguGuildSchema = PinguGuildSchema;
