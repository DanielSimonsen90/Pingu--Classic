const { Message, Permissions } = require('discord.js');
const { PinguLibrary } = require('../../PinguPackage');

module.exports = {
    name: 'fly',
    cooldown: 5,
    description: 'The ability to fly',
    usage: '',
    id: 2,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        if (message.channel.type !== 'dm') {
            var permCheck = PinguLibrary.PermissionCheck(message, [Permissions.FLAGS.SEND_MESSAGES]);
            if (permCheck != PinguLibrary.PermissionGranted) return permCheck;
        }
        message.channel.send(`Are you aware of the fact I'm a literal penguin?...`);
    },
};