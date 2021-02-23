const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('noot', 'Fun', 'Speak through my beak', {
    usage: '<message>',
    examples: ["Pingu said this message!"]
}, async ({ message, args }) => {
    if (message.channel.type != 'dm') {
        let hasManageMessages = PinguLibrary.PermissionCheck(message, ['MANAGE_MESSAGES']) == PinguLibrary.PermissionGranted;
        if (hasManageMessages) message.delete();
    }
    message.channel.send(args.join(' '));
});