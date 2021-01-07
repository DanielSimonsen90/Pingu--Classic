const { Message } = require('discord.js');
const { DiscordPermissions, PinguLibrary } = require('../../PinguPackage');

module.exports = {
    name: 'invite',
    description: 'Sends link to invite bot to your server',
    usage: '',
    id: 3,
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message}}*/
    async execute({ message }) {
        let pinguPermissions = 0;
        PinguLibrary.Permissions.given.forEach(perm => pinguPermissions += perm.bit);

        message.channel.send(`https://discord.com/api/oauth2/authorize?client_id=${message.client.user.id}&permissions=${pinguPermissions}&scope=bot`);
    }
}