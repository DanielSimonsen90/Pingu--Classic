const { Message, Permissions } = require('discord.js');
const { PinguLibrary } = require('../../PinguPackage');

module.exports = {
    name: 'boomer',
    cooldown: 5,
    description: 'OK Boomer',
    usage: '[person]',
    guildOnly: true,
    id: 2,
    example: ["", "@Danho#1205"],
    /**@param { Message } message @param {string[]} args*/
    execute(message, args) {
        const PermCheck = PermissionCheck(message);
        if (PermCheck != PinguLibrary.PermissionGranted) return message.channel.send(PermCheck);

        let LastMessage = message.channel.messages.cache.size - 2,
            Mention = args.length >= 1 ? args.join(" ") : message.channel.messages.cache.array()[LastMessage].author;

        if (LastMessage == -1 && !args[0])
            return message.channel.send(`Sorry, ${message.author}, but you're too late to boomer that person!`);
        else if (args.length >= 1) {
            message.delete();
            return message.channel.send(`OK ${Mention}, you boomer`);
        }

        message.delete();
        message.channel.send(`OK Boomer ${Mention}`);
    },
};
/**@param {Message} message*/
function PermissionCheck(message) {
    return PinguLibrary.PermissionCheck(message, [
        Permissions.FLAGS.READ_MESSAGE_HISTORY,
        Permissions.FLAGS.SEND_MESSAGES,
        Permissions.FLAGS.MANAGE_MESSAGES
    ]);
}
