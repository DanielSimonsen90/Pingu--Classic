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
        const link = `https://discord.com/api/oauth2/authorize?client_id=562176550674366464&permissions=${Permissions}&scope=bot`;
        message.channel.send(link)
            .catch(error => message.author.send(link + `\n` + error))
    }
}