"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguCacheManager = void 0;
const discord_js_1 = require("discord.js");
const PinguEvent_1 = require("./handlers/PinguEvent");
class PinguCacheManager {
    constructor() {
        this.events = PinguEvent_1.LoggedCache;
    }
    errors = new discord_js_1.Collection();
    events = new Array();
    clear() {
        this.errors.clear();
        this.events = new Array();
        return this;
    }
}
exports.PinguCacheManager = PinguCacheManager;
exports.default = PinguCacheManager;
