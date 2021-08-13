const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('guildUnavailable',
    async function setContent(client, embed, guild) {
        return module.exports.content = embed.setDescription(`**${guild}** is now unavailable.`);
    }
)
