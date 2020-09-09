const { Message } = require('discord.js');

module.exports = {
    name: 'setprefix',
    description: 'set the prefix of server',
    usage: '<new prefix>',
    id: 4,
    guildOnly: true,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {


        message.channel.send(`Prefix has been changed to **${args[0]}**!`)
    },
};