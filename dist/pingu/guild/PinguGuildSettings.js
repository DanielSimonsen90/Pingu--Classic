"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguGuildSettings = void 0;
const PChannel_1 = require("../../database/json/PChannel");
const PinguGuildConfig_1 = require("./PinguGuildConfig");
class PinguGuildSettings {
    constructor(guild) {
        let welcomeChannel = (guild.channels.cache.find(c => !c.isThread() && c.isText() && c.name.includes('welcome')) ||
            guild.channels.cache.find(c => !c.isThread() && c.isText() && c.name == 'general'));
        if (welcomeChannel)
            this.welcomeChannel = new PChannel_1.default(welcomeChannel);
        this.config = new PinguGuildConfig_1.default(guild);
        this.reactionRoles = new Array();
    }
    welcomeChannel;
    config;
    reactionRoles;
}
exports.PinguGuildSettings = PinguGuildSettings;
exports.default = PinguGuildSettings;
