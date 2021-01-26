const { Client, GuildEmoji, MessageEmbed } = require("discord.js");
const { PinguEvents } = require("../../../PinguPackage");

module.exports = {
    name: 'events: emojiUpdate',
    /**@param {{preEmote: GuildEmoji, emote: GuildEmoji}}*/
    setContent({ preEmote, emote }) {
        if (preEmote.name != emote.name)
            return module.exports.content = new MessageEmbed()
                .setDescription(PinguEvents.SetDescriptionValues('Name', preEmote.name, emote.name));
        else return null;
    },
    /**@param {Client} client
     @param {{preEmote: GuildEmoji, emote: GuildEmoji}}*/
    execute(client, { preEmote, emote }) {

    }
}