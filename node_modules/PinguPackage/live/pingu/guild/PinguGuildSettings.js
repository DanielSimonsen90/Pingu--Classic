"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguGuildSettings = void 0;
const json_1 = require("../../database/json");
const PinguGuildConfig_1 = require("./PinguGuildConfig");
class PinguGuildSettings {
    constructor(guild) {
        let welcomeChannel = guild.channels.cache.find(c => c.isText() && c.name.includes('welcome')) ||
            guild.channels.cache.find(c => c.isText() && c.name == 'general');
        if (welcomeChannel)
            this.welcomeChannel = new json_1.PChannel(welcomeChannel);
        this.config = new PinguGuildConfig_1.PinguGuildConfig(guild);
        this.reactionRoles = new Array();
    }
}
exports.PinguGuildSettings = PinguGuildSettings;
