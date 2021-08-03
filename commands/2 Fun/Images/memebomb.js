const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('memebomb', 'Fun', 'Searches google for Club Penguin/Pingu memes 3 times', {
    permissions: ['EMBED_LINKS']
}, async ({ client, message, pGuildClient }) => {
        const { execute } = client.commands.get('meme');
        const result = await Promise.all([
            execute({ client, message, pGuildClient }),
            execute({ client, message, pGuildClient }),
            execute({ client, message, pGuildClient })
        ]);
        return result[0];
})