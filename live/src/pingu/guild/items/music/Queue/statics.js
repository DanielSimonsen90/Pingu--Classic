"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = exports.get = void 0;
const discord_js_1 = require("discord.js");
const GuildQueue = new discord_js_1.Collection();
function get(guildID) {
    return GuildQueue.get(guildID);
}
exports.get = get;
function set(guildID, queue) {
    GuildQueue.set(guildID, queue);
}
exports.set = set;
