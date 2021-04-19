const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('meme', 'Fun', 'Searches google for Club Penguin/Pingu memes', {
    permissions: ['EMBED_LINKS']
}, async ({ message, pGuildClient }) => PinguLibrary.RequestImage(message, pGuildClient, module.exports.name, ["Pingu", "Club Penguin"]));