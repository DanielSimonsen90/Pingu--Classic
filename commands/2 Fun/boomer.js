const { Message } = require('discord.js');
const { DiscordPermissions } = require('../../PinguPackage');

module.exports = {
    name: 'boomer',
    cooldown: 5,
    description: 'OK Boomer',
    usage: '[person]',
    guildOnly: true,
    id: 2,
    example: ["", "@Danho#1205"],
    permissions: [DiscordPermissions.READ_MESSAGE_HISTORY, DiscordPermissions.SEND_MESSAGES, DiscordPermissions.MANAGE_MESSAGES],
    /**@param {{message: Message, args: string[]}}*/
    async execute({ message, args }) {
        let messages = await message.channel.messages.fetch({ limit: 5 });
        let LastMessage = messages.size - 2,
            Mention = args.length >= 1 ? args.join(" ") : messages.array()[LastMessage].author;

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
