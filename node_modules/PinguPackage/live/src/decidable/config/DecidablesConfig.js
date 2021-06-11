"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecidablesConfig = void 0;
const _1 = require(".");
const PinguLibrary_1 = require("../../pingu/library/PinguLibrary");
class DecidablesConfig {
    constructor(guild) {
        this.giveawayConfig = new _1.GiveawayConfig();
        this.pollConfig = new _1.PollConfig();
        this.suggestionConfig = new _1.SuggestionConfig();
        this.themeConfig = guild.id == PinguLibrary_1.SavedServers.get('Deadly Ninja').id ? new _1.ThemeConfig() : undefined;
    }
}
exports.DecidablesConfig = DecidablesConfig;
