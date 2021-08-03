const { MessageEmbed } = require("discord.js");
const { PinguEvent, EmbedField } = require('PinguPackage');

module.exports = new PinguEvent('emojiCreate',
    async function setContent(client, emote) {
        return module.exports.content = new MessageEmbed({
            fields: [
                new EmbedField(`Name`, emote.name, true),
                new EmbedField(`ID`, emote.id, true),
                new EmbedField(`Author`, emote.author, true),
                new EmbedField(`Animated?`, emote.animated, true),
                new EmbedField(`Identifier`, emote.identifier, true)
            ]
        })
    }
);