const { Message } = require('discord.js');
const { DiscordPermissions, PinguLibrary } = require('PinguPackage');

module.exports = {
    name: 'sort',
    description: 'Alphabetically sorts given values',
    usage: ' Option1, Option number 2, option3, and so on idk man',
    id: 1,
    permissions: [DiscordPermissions.SEND_MESSAGES],
    example: [""],
    /**@param {{message: Message, args: string[]}}*/
    execute({ message, args }) {
        if (!args || args.length == 1) return message.channel.send(`Give me something to sort!`);

        let arguments = args.join(' ').split(',').sort((a, b) => a > b ? 1 : -1);
        let result = arguments.join(', ');

        message.channel.send(result);
        PinguLibrary.consoleLog(message.client, `Arguments:\n${arguments}\n\nResult:\n${result}`);
    }
}