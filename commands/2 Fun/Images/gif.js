const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('gif', 'Fun', 'Searches google for Pingu/Club Penguin gifs', {
    permissions: ['EMBED_LINKS']
}, async ({ client, message, pGuildClient }) => client.requestImage(message, pGuildClient, module.exports.name, ['Club Penguin', 'Pingu']));