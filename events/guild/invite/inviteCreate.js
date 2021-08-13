const { PinguEvent, EmbedField } = require('PinguPackage');

module.exports = new PinguEvent('inviteCreate',
    async function setContent(client, embed, { code, expiresAt, channel, maxUses, temporary, inviter, url }) {
        return module.exports.content = embed.addFields([
            new EmbedField(`Code`, code, true),
            new EmbedField(`Expiration`, expiresAt, true),
            new EmbedField(`Invite Channel`, channel, true),
            new EmbedField(`Max Uses`, maxUses, true),
            new EmbedField(`Temporary?`, temporary, true),
            new EmbedField(`Inviter`, inviter, true)
        ]).setURL(url)
    }
);