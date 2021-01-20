const { Client, GuildEmoji } = require("discord.js");

module.exports = {
    name: 'events: emojiUpdate',
    /**@param {Client} client
     @param {{preEmote: GuildEmoji, emote: GuildEmoji}}*/
    execute(client, { preEmote, emote }) {

    }
}