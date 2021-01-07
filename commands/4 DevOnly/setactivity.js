const { Message } = require("discord.js");
const { PinguLibrary, DiscordPermissions } = require("../../PinguPackage");

module.exports = {
    name: 'setactivity',
    description: 'Sets the status of the bot',
    usage: '<status type> <status message>',
    id: 4,
    example: ["listening my jam"],
    /**@param {{message: Message, args: string[]}}*/
    execute({ message, args }) {
        if (!args[0] || !args[1])
            return message.channel.send(`You didn't provide me with enough arguments!`);
        else if (!['PLAYING', 'WATCHING', 'LISTENING'].includes(args[0]))
            return message.channel.send(`What am I supposed to do? Play? Listen? Watch?`); 

        let Activity = args.shift(),
            ActivityMessage = args.join(" ");
        message.client.user.setActivity(`${ActivityMessage} *help`, { type: Activity });

        if (message.channel.type != 'dm') {
            var permCheck = PinguLibrary.PermissionCheck(message, [DiscordPermissions.SEND_MESSAGES]);
            if (permCheck != PinguLibrary.PermissionGranted) return message.author.send(`${permCheck}\nBut I have updated my activity!`);
        }
        message.channel.send(`Updated activity!`);  
    },
};