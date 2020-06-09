module.exports = {
    name: 'boomer',
    cooldown: 5,
    description: 'OK Boomer',
    usage: '[person]',
    id: 2,
    execute(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.memberPermissions(message.guild.client.user).has('SEND_MESSAGES'))
                return message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!`)
            else if (!message.channel.memberPermissions(message.guild.client.user).has('MANAGE_MESSAGES'))
                return message.author.send(`Hey! I don't have permission to **manage messages**!`);
        }
        else
            message.author.send(`I can't execute that command in DMs!`);

        let LastMessage = message.channel.messages.size - 2,
            Mention = (args.length >= 1) ? args.join(" ") : message.channel.messages.array()[LastMessage].author;

        if (!message.channel.memberPermissions(message.guild.client.user).has('READ_MESSAGE_HISTORY'))
            return message.author.send(`Hey! I couldn't boomer that person, because I can't **read the message history**!`);
        else if (LastMessage === -1 && !args[0])
            return message.channel.send(`Sorry, ${message.author}, but you're too late to boomer that person!`);
        else if (args.length >= 1) {
            message.delete();
            return message.channel.send(`OK ${Mention}, you boomer`);
        }

        message.delete();
        message.channel.send(`OK Boomer ${Mention}`);
    },
};
