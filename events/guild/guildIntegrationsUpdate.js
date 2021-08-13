const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('guildIntegrationsUpdate',
    async function setContent(client, embed, guild) {
        return module.exports.content = embed.setDescription(`Integration Updated`)
    }
);