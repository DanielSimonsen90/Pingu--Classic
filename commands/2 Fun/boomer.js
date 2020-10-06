const { Message } = require('discord.js');

module.exports = {
    name: 'boomer',
    cooldown: 5,
    description: 'OK Boomer',
    usage: '[person]',
    id: 2,
    example: ["", "@Danho#1205"],
    /**@param { Message } message @param {string[]} args*/
    execute(message, args) {
        const PermCheck = PermissionCheck(message);
        if (PermCheck != `Permission Granted`) return message.channel.send(PermCheck);

        let LastMessage = message.channel.messages.cache.size - 2,
            Mention = (args.length >= 1) ? args.join(" ") : message.channel.messages.cache.array()[LastMessage].author;

        if (!message.channel.permissionsFor(message.client.user).has('READ_MESSAGE_HISTORY'))
            return message.author.send(`Hey! I couldn't boomer that person, because I can't **read the message history**!`);
        else if (LastMessage == -1 && !args[0])
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
    if (message.channel.type === 'dm')
        return `I can't execute that command in DMs!`;

    const PermArr = ["SEND_MESSAGES", "MANAGE_MESSAGES"],
        PermArrMsg = ["send messages", "maange messages"];

    for (var x = 0; x < PermArr.length; x++)
        if (!message.channel.permissionsFor(message.client.user).has(PermArr))
            return `Hey! I don't have permission to **${PermArrMsg}** in #${message.channel.name}!`;

    return `Permission Granted`;
}
