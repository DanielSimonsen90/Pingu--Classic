const { Message, Permissions } = require('discord.js');
const { PinguLibrary, DiscordPermissions } = require('../../PinguPackage');

module.exports = {
    name: 'noot',
    cooldown: 5,
    description: 'Speak through my beak',
    usage: '<message>',
    id: 2,
    example: ["Pingu said this message!"],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        if (message.channel.type != 'dm') {
            let hasManageMessages = PinguLibrary.PermissionCheck(message, [Permissions.FLAGS.MANAGE_MESSAGES]) == PinguLibrary.PermissionGranted;
            if (hasManageMessages) message.delete();
        }
        message.channel.send(args.join(" "));
    },
};