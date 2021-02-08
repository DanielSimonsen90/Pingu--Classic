const mongoose = require('mongoose');

const PItem = {
    _id: String,
    name: String
};
const Decidable = {
    value: String,
    _id: String,
    author: PItem,
    channel: PItem
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
    giveawayConfig: {
        firstTimeExecuted: Boolean,
        allowSameWinner: Boolean,
        hostRole: PItem,
        winnerRole: PItem,
        giveaways: [Object.assign({
            winners: [PItem]
        }, Decidable)],
        channel: PItem
    },
    pollConfig: {
        firstTimeExecuted: Boolean,
        pollsRole: PItem,
        polls: [Object.assign({
            YesVotes: Number,
            NoVotes: Number,
            approved: String
        }, Decidable)],
        channel: PItem
    },
    suggestions: [Object.assign({
        decidedBy: PItem,
        approved: Boolean
    }, Decidable)],
    themeWinners: [PItem]
}));