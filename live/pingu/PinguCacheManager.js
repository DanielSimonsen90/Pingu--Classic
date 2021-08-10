"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguCacheManager = void 0;
const discord_js_1 = require("discord.js");
const PinguEvent_1 = require("./handlers/PinguEvent");
class PinguCacheManager {
    constructor() {
        this.errors = new discord_js_1.Collection();
        this.events = new Array();
        this.events = PinguEvent_1.LoggedCache;
    }
    clear() {
        this.errors.clear();
        this.events = new Array();
        return this;
    }
}
exports.PinguCacheManager = PinguCacheManager;
exports.default = PinguCacheManager;
