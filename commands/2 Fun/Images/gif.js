const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('gif', 'Fun', 'Searches google for Pingu/Club Penguin gifs', {
    permissions: ['EMBED_LINKS']
}, async ({ message, pGuildClient }) => PinguLibrary.RequestImage(message, pGuildClient, module.exports.name, ['Club Penguin', 'Pingu']));