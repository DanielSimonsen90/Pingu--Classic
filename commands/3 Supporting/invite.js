const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('invite', 'Supporting', 'Sends link to invite bot to your server', null, async ({ message }) => {
    let pinguPermissions = PinguLibrary.Permissions().given.reduce((pinguPermissions, perm) => pinguPermissions += perm.bit, 0);

    return message.channel.send(`https://discord.com/api/oauth2/authorize?client_id=${message.client.user.id}&permissions=${pinguPermissions}&scope=applications.commands%20bot`);
});