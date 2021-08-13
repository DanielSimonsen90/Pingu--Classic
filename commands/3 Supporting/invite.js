const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('invite', 'Supporting', 'Sends link to invite bot to your server', null, async ({ client, message }) => {
    //const permissions = client.permissions.granted.reduce((result, perm) => result += perm.bit, 0)
    //return message.channel.send(`https://discord.com/api/oauth2/authorize?client_id=${client.id}&permissions=${permissions}&scope=applications.commands%20bot`);

    return client.generateInvite({
        scopes: ['bot', 'applications.commands'],
        permissions: client.permissions.granted.map(perm => perm.permString);
    })
});