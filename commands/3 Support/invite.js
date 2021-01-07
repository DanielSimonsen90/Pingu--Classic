const { Message } = require('discord.js');
const { DiscordPermissions, PinguLibrary } = require('../../PinguPackage');

module.exports = {
    name: 'invite',
    description: 'Sends link to invite bot to your server',
    usage: '',
    id: 3,
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {

        let pinguPermissions = 0;
        PinguLibrary.Permissions.given.forEach(perm => {
            console.log(`Adding ${perm.bit} to ${pinguPermissions}`);
            pinguPermissions += perm.bit
        });

        message.channel.send(`https://discord.com/api/oauth2/authorize?client_id=562176550674366464&permissions=${pinguPermissions}&scope=bot`);
    }
}