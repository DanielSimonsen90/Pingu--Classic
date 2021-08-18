const { PinguEvent, EmbedField } = require('PinguPackage');

module.exports = new PinguEvent('emojiCreate',
    async function setContent(client, embed, { name, id, author, animated, identifier }) {
        return module.exports.content = embed.addFields([
            new EmbedField(`Name`, name, true),
            new EmbedField(`Id`, id, true),
            new EmbedField(`Author`, author.toString(), true),
            new EmbedField(`Animated?`, animated, true),
            new EmbedField(`Identifier`, identifier, true)
        ])
    }
);