"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecidablesConfig = void 0;
const PItem_1 = require("./PItem");
const DecidablesItem_1 = require("./DecidablesItem");
const DecidableConfig = {
    firstTimeExecuted: Boolean,
    channel: PItem_1.PItem
};
const GiveawayConfig = Object.assign(Object.assign({}, DecidableConfig), { allowSameWinner: Boolean, hostRole: PItem_1.PItem, winnerRole: PItem_1.PItem, giveaways: [Object.assign(Object.assign({}, DecidablesItem_1.DecidableItem), { winners: [PItem_1.PItem] })] });
const PollConfig = Object.assign(Object.assign({}, DecidableConfig), { pollsRole: PItem_1.PItem, polls: [Object.assign(Object.assign({}, DecidablesItem_1.DecidableItem), { YesVotes: Number, NoVotes: Number, approved: String })] });
const SuggestionConfig = Object.assign(Object.assign({}, DecidableConfig), { verifyRole: PItem_1.PItem, suggestions: [Object.assign(Object.assign({}, DecidablesItem_1.DecidableItem), { approved: String, decidedBy: PItem_1.PItem })] });
const ThemeConfig = Object.assign(Object.assign({}, DecidableConfig), { allowSameWinner: Boolean, ignoreLastWins: Number, hostRole: PItem_1.PItem, winnerRole: PItem_1.PItem, themes: [Object.assign(Object.assign({}, DecidablesItem_1.DecidableItem), { winners: [PItem_1.PItem] })] });
exports.DecidablesConfig = {
    giveawayConfig: GiveawayConfig,
    pollConfig: PollConfig,
    suggestionConfig: SuggestionConfig,
    themeConfig: ThemeConfig
};
