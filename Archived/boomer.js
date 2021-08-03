const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('boomer', 'Fun', 'OK Boomer', {
    usage: '[person]',
    guildOnly: true,
    example: ["", "@Danho#1205"],
    permissions: ['READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES']
}, async ({ message, args }) => {
    let messages = await message.channel.messages.fetch({ limit: 5 });
    let lastMessage = messages.size - 2,
        mention = args.length >= 1 ? args.join(" ") : messages.array()[lastMessage].author;

    if (lastMessage == -1 && !args[0])
        return message.channel.send(`Sorry, ${message.author}, but you're too late to boomer that person!`);
    else if (args.length >= 1) {
        message.delete();
        return message.channel.send(`OK ${mention}, you boomer`);
    }

    message.delete();
    return message.channel.send(`OK Boomer ${mention}`);
});