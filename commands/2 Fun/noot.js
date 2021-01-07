const { Message } = require('discord.js');
const { PinguLibrary, DiscordPermissions } = require('../../PinguPackage');

module.exports = {
    name: 'noot',
    cooldown: 5,
    description: 'Speak through my beak',
    usage: '<message>',
    id: 2,
    example: ["Pingu said this message!"],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message, args: string[]}}*/
    async execute({ message, args }) {
        if (message.channel.type != 'dm') {
            let hasManageMessages = PinguLibrary.PermissionCheck(message, [DiscordPermissions.MANAGE_MESSAGES]) == PinguLibrary.PermissionGranted;
            if (hasManageMessages) message.delete();
        }
        message.channel.send(args.join(' '));
    },
};