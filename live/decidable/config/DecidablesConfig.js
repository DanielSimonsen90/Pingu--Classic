"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecidablesConfig = void 0;
const index_1 = require("./index");
const PinguLibrary_1 = require("../../pingu/library/PinguLibrary");
class DecidablesConfig {
    constructor(guild) {
        this.giveawayConfig = new index_1.GiveawayConfig();
        this.pollConfig = new index_1.PollConfig();
        this.suggestionConfig = new index_1.SuggestionConfig();
        this.themeConfig = guild.id == PinguLibrary_1.SavedServers.get('Deadly Ninja').id ? new index_1.ThemeConfig() : undefined;
    }
}
exports.DecidablesConfig = DecidablesConfig;
exports.default = DecidablesConfig;
