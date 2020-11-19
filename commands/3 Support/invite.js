const { Message } = require('discord.js');

module.exports = {
    name: 'invite',
    cooldown: 5,
    description: 'Sends link to invite bot to your server',
    usage: '',
    id: 3,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        const Permissions = 271711312;
        message.channel.send(`https://discord.com/api/oauth2/authorize?client_id=562176550674366464&permissions=${Permissions}&scope=bot`);
    }
}