const { Client, GuildEmoji, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'events: emojiCreate',
    /**@param {{emote: GuildEmoji}}*/
    setContent({ emote }) {
        return module.exports.content = new MessageEmbed()
            .addField(`Name`, emote.name, true)
            .addField(`ID`, emote.id, true)
            .addField(`Author`, emote.author, true)
            .addField(`Animated?`, emote.animated, true)
            .addField(`Identifier`, emote.identifier, true);
    },
    /**@param {Client} client
     @param {{emote: GuildEmoji}}*/
    execute(client, { emote }) {

    }
}