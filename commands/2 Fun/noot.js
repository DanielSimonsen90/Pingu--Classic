const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('noot', 'Fun', 'Speak through my beak', {
    usage: '<message>',
    examples: ["Pingu said this message!"]
}, async ({ client, message, args }) => {
    if (message.channel.type != 'dm') {
        let hasManageMessages = client.permissions.checkFor(message, 'MANAGE_MESSAGES') == client.permissions.PermissionGranted;
        if (hasManageMessages) message.delete();
    }
    return message.channel.send(args.join(' '));
});