const { Message } = require('discord.js');
const { PinguLibrary, DiscordPermissions } = require("../../PinguPackage");

module.exports = {
    name: 'spinthewheel',
    description: 'set the prefix of server',
    usage: '<option1>, <option2>, <option3>....',
    id: 1,
    example: ['Yes, No', 'Pizza, McDonalds, Sandwich, Noodles'],
    /**@param {{message: Message, args: string[]}}*/
    execute({ message, args }) {
        var stringArgs = args.join(' ') || "Yes, No";
        const options = stringArgs.split(', ');
        const ranItem = Math.round(Math.random() * Math.floor(options.length - 1));

        var result = options[ranItem];
        PinguLibrary.ConsoleLog(`Result: ${result}`);

        let permCheck = PinguLibrary.PermissionCheck(message, [DiscordPermissions.SEND_MESSAGES]);
        if (permCheck != PinguLibrary.PermissionGranted)
            return message.author.send(`I don't have permission to send messages in ${message.channel}, but I've selected ${result}.`);
        message.channel.send(result);
    }
}