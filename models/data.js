const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    name: String,
    guildID: String,
    prefix: "*",
    suggestions: [],
    giveawayWinners: []
})

module.exports = mongoose.model("GuildData", dataSchema);