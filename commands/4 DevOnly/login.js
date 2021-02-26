const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('login', 'DevOnly', `Relogs me`, {
    
}, async ({ client, message, args, pAuthor, pGuild, pGuildClient }) => {
        const token = client.token;
        client.destroy();
        console.log('Disconnected!');
        await client.login(token);
        console.log("Reconnected!");
})