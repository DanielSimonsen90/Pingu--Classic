const mongoose = require('mongoose');

const PItem = {
    _id: String,
    name: String
};
const Song = {
    _id: Number,
    title: String,
    link: String,
    author: String,
    thumbnail: String,
    length: String,
    lengthMS: Number,
    volume: Number,
    playing: Boolean,
    loop: Boolean,
    endsAt: Date,
    requestedBy: PItem
};

module.exports = mongoose.model('PinguUser', mongoose.Schema({
    _id: String,
    tag: String,
    sharedServers: [PItem],
    marry: {
        partner: PItem,
        internalDate: Date
    },
    replyPerson: PItem,
    daily: {
        lastClaim: Date,
        nextClaim: {
            endsAt: Date,
            seconds: Number,
            minutes: Number,
            hours: Number,
            days: Number
        },
        streak: Number
    },
    avatar: String,
    playlists: [{
        name: String,
        songs: [Song]
    }]
}));