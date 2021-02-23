const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('invite', 'Supporting', 'Sends link to invite bot to your server', null, async ({ message }) => {
    let pinguPermissions = 0;
    PinguLibrary.Permissions.given.forEach(perm => pinguPermissions += perm.bit);

    message.channel.send(`https://discord.com/api/oauth2/authorize?client_id=${message.client.user.id}&permissions=${pinguPermissions}&scope=bot`);
});