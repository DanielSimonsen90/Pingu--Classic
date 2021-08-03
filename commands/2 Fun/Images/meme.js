const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('meme', 'Fun', 'Searches google for Club Penguin/Pingu memes', {
    permissions: ['EMBED_LINKS']
}, async ({ client, message, pGuildClient }) => client.requestImage(message, pGuildClient, module.exports.name, ["Pingu", "Club Penguin"]));