const { PinguEvent, EmbedField } = require('PinguPackage');

module.exports = new PinguEvent('emojiCreate',
    async function setContent(client, embed, emote) {
        return module.exports.content = embed.addFields([
            new EmbedField(`Name`, emote.name, true),
            new EmbedField(`Id`, emote.id, true),
            new EmbedField(`Author`, emote.author, true),
            new EmbedField(`Animated?`, emote.animated, true),
            new EmbedField(`Identifier`, emote.identifier, true)
        ])
    }
);