const { MessageEmbed } = require("discord.js");
const { PinguEvent, EmbedField } = require('PinguPackage');

module.exports = new PinguEvent('inviteCreate',
    async function setContent(invite) {
        return module.exports.content = new MessageEmbed()
            .addFields([
                new EmbedField(`Code`, invite.code, true),
                new EmbedField(`Expiration`, invite.expiresAt, true),
                new EmbedField(`Invite Channel`, invite.channel, true),
                new EmbedField(`Max Uses`, invite.maxUses, true),
                new EmbedField(`Temporary?`, invite.temporary, true),
                new EmbedField(`Inviter`, invite.inviter, true)
            ])
            .setURL(invite.url);
    }
);