"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetConfigObjects = void 0;
//#region Config & Items
const items_1 = require("./items");
function SetConfigObjects(config) {
    const { giveawayConfig, pollConfig, suggestionConfig, themeConfig } = config;
    const giveawayObj = {
        constructor: items_1.Giveaway,
        firstTimeExecuted: giveawayConfig.firstTimeExecuted,
        channel: giveawayConfig.channel,
        hostRole: giveawayConfig.hostRole,
        winnerRole: giveawayConfig.winnerRole,
        collection: giveawayConfig.giveaways,
        allowSameWinner: giveawayConfig.allowSameWinner,
        staffRoleType: 'Giveaway Host'
    };
    const pollObj = {
        constructor: items_1.Poll,
        firstTimeExecuted: pollConfig.firstTimeExecuted,
        channel: pollConfig.channel,
        hostRole: pollConfig.pollRole,
        collection: pollConfig.polls,
        staffRoleType: 'Poll Host'
    };
    const suggestionsObj = {
        constructor: items_1.Suggestion,
        firstTimeExecuted: suggestionConfig.firstTimeExecuted,
        channel: suggestionConfig.channel,
        hostRole: suggestionConfig.managerRole,
        collection: suggestionConfig.suggestions,
        staffRoleType: 'Suggestion Manager'
    };
    const themeObj = {
        constructor: items_1.Theme,
        firstTimeExecuted: themeConfig.firstTimeExecuted,
        channel: themeConfig.channel,
        winnerRole: themeConfig.winnerRole,
        hostRole: themeConfig.hostRole,
        collection: themeConfig.themes,
        allowSameWinner: themeConfig.allowSameWinner,
        ignoreLastWins: themeConfig.ignoreLastWins,
        staffRoleType: 'Theme Host'
    };
    return new Map([
        [giveawayConfig, giveawayObj],
        [pollConfig, pollObj],
        [suggestionConfig, suggestionsObj],
        [themeConfig, themeObj]
    ]);
}
exports.SetConfigObjects = SetConfigObjects;
