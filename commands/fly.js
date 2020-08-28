const { Message } = require('discord.js');

module.exports = {
    name: 'fly',
    cooldown: 5,
    description: 'The ability to fly',
    usage: '',
    id: 2,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(message.guild.client.user).has('SEND_MESSAGES'))
                return message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!`);

        message.channel.send(`Are you aware of the fact I'm a literal penguin?...`);
    },
};