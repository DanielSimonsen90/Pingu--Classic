const { Message } = require("discord.js");

module.exports = {
    name: 'setactivity',
    cooldown: 5,
    description: 'Sets the status of the bot',
    usage: '<status type> <status message>',
    id: 4,
    example: ["listening my jam"],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        if (!args[0] || !args[1])
            return message.reply(`You didn't provide me with enough arguments!`);
        else if (!args[0] == 'PLAYING' || !args[0] == 'WATCHING' || !args[0] == 'LISTENING')
            return message.channel.send(`What am I supposed to do? Play? Listen? Watch?`); 

        let Activity = args.shift(),
            ActivityMessage = args.join(" ");
        message.client.user.setActivity(`${ActivityMessage} *help`, { type: Activity });

        if (message.channel.type != 'dm')
            if (!message.channel.permissionsFor(message.guild.client.user).has('SEND_MESSAGES'))
                return message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!\nBut I have updated my activity!`);

        message.channel.send(`Updated activity!`);  
    },
};