const mongoose = require('mongoose');

const PItem = {
    _id: String,
    name: String
};
const DecidableConfig = {
    firstTimeExecuted: Boolean,
    channel: PItem
};
const DecidableItem = {
    value: String,
    _id: String,
    author: PItem,
    channel: PItem,
    endsAt: Date
};

module.exports = mongoose.model('PinguGuild', mongoose.Schema({
    _id: String,
    name: String,
    guildOwner: PItem,
    clients: [{
        _id: String,
        embedColor: Number,
        prefix: String,
        displayName: String
    }],
    welcomeChannel: PItem,
    reactionRoles: [{
        channel: PItem,
        messageID: String,
        emoteName: String,
        pRole: PItem
    }],
    giveawayConfig: { ...DecidableConfig,
        allowSameWinner: Boolean,
        hostRole: PItem,
        winnerRole: PItem,
        giveaways: [{ ...DecidableItem,
            winners: [PItem]
        }],
    },
    pollConfig: { ...DecidableConfig,
        pollsRole: PItem,
        polls: [{ ...DecidableItem, 
            YesVotes: Number,
            NoVotes: Number,
            approved: String
        }]
    },
    suggestionsConfig: { ...DecidableConfig, 
        verifyRole: PItem,
        suggestion: [{ ...DecidableItem,
            approved: Boolean,
            decidedBy: PItem
        }]
        
    },
    themeWinners: [PItem]
}));