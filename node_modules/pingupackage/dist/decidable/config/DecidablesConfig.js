"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecidablesConfig = void 0;
const index_1 = require("./index");
class DecidablesConfig {
    constructor(guild) {
        const { client } = guild;
        this.giveawayConfig = new index_1.GiveawayConfig();
        this.pollConfig = new index_1.PollConfig();
        this.suggestionConfig = new index_1.SuggestionConfig();
        this.themeConfig = guild.id == client.savedServers.get('Deadly Ninja').id ? new index_1.ThemeConfig() : undefined;
    }
    giveawayConfig;
    pollConfig;
    suggestionConfig;
    themeConfig;
}
exports.DecidablesConfig = DecidablesConfig;
exports.default = DecidablesConfig;
