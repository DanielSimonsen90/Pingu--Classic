"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecidablesConfig = void 0;
const PItem_1 = require("./PItem");
const DecidableItem_1 = require("./DecidableItem");
const DecidableConfig = {
    firstTimeExecuted: Boolean,
    channel: PItem_1.default
};
const GiveawayConfig = { ...DecidableConfig,
    allowSameWinner: Boolean,
    hostRole: PItem_1.default,
    winnerRole: PItem_1.default,
    giveaways: [{ ...DecidableItem_1.default,
            winners: [PItem_1.default]
        }],
};
const PollConfig = { ...DecidableConfig,
    pollsRole: PItem_1.default,
    polls: [{ ...DecidableItem_1.default,
            YesVotes: Number,
            NoVotes: Number,
            approved: String
        }]
};
const SuggestionConfig = { ...DecidableConfig,
    verifyRole: PItem_1.default,
    suggestions: [{ ...DecidableItem_1.default,
            approved: String,
            decidedBy: PItem_1.default
        }]
};
const ThemeConfig = { ...DecidableConfig,
    allowSameWinner: Boolean,
    ignoreLastWins: Number,
    hostRole: PItem_1.default,
    winnerRole: PItem_1.default,
    themes: [{ ...DecidableItem_1.default,
            winners: [PItem_1.default]
        }],
};
exports.DecidablesConfig = {
    giveawayConfig: GiveawayConfig,
    pollConfig: PollConfig,
    suggestionConfig: SuggestionConfig,
    themeConfig: ThemeConfig
};
exports.default = exports.DecidablesConfig;
