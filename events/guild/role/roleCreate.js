const { PinguEvent, EmbedField } = require('PinguPackage');

module.exports = new PinguEvent('roleCreate',
    async function setContent(client, embed, { name, hexColor, hoist, permissions, mentionable }) {
        return module.exports.content = embed.setFields([
            new EmbedField(`Name`, name, true),
            new EmbedField(`Color`, hexColor, true),
            new EmbedField(`Hoisted`, hoist, true),
            new EmbedField(`Permissions`, permissions.toArray().map(p => `• ${p}`).join(`\n`)),
            new EmbedField(`Mentionable?`, mentionable)
        ])
    }
);