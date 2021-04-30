import PItem from "./PItem";
import DecidableItem from "./DecidableItem";

const DecidableConfig = {
    firstTimeExecuted: Boolean,
    channel: PItem
};
const GiveawayConfig = { ...DecidableConfig,
    allowSameWinner: Boolean,
    hostRole: PItem,
    winnerRole: PItem,
    giveaways: [{ ...DecidableItem,
        winners: [PItem]
    }],
};
const PollConfig = { ...DecidableConfig,
    pollsRole: PItem,
    polls: [{ ...DecidableItem, 
        YesVotes: Number,
        NoVotes: Number,
        approved: String
    }]
};
const SuggestionConfig = { ...DecidableConfig,
    verifyRole: PItem,
    suggestions: [{ ...DecidableItem,
        approved: String,
        decidedBy: PItem
    }]   
};
const ThemeConfig = { ...DecidableConfig,
    allowSameWinner: Boolean,
    ignoreLastWins: Number,
    hostRole: PItem,
    winnerRole: PItem,
    themes: [{ ...DecidableItem,
        winners: [PItem]
    }],
};

export const DecidablesConfig = {
    giveawayConfig: GiveawayConfig,
    pollConfig: PollConfig,
    suggestionConfig: SuggestionConfig,
    themeConfig: ThemeConfig
};

export default DecidablesConfig;