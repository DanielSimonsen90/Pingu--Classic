"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecidablesConfig = void 0;
const index_1 = require("./index");
const BasePinguClient_1 = require("../../pingu/client/BasePinguClient");
class DecidablesConfig {
    constructor(guild) {
        const client = BasePinguClient_1.ToBasePinguClient(guild.client);
        this.giveawayConfig = new index_1.GiveawayConfig();
        this.pollConfig = new index_1.PollConfig();
        this.suggestionConfig = new index_1.SuggestionConfig();
        this.themeConfig = guild.id == client.savedServers.get('Deadly Ninja').id ? new index_1.ThemeConfig() : undefined;
    }
}
exports.DecidablesConfig = DecidablesConfig;
exports.default = DecidablesConfig;
