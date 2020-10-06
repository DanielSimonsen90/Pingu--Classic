const { Message } = require('discord.js');

module.exports = {
    name: 'noot',
    cooldown: 5,
    description: 'Speak through my beak',
    usage: '<message>',
    id: 2,
    example: ["Pingu said this message!"],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        if (message.channel.type == 'dm')
            return message.author.send(args.join(" "));

        const PermissionCheck = message.channel.permissionsFor(message.guild.client.user),
            PermArr = ["SEND_MESSAGES", "MANAGE_MESSAGES"];;
        for (var Perm = 0; Perm < PermArr.length; Perm++)
            if (!PermissionCheck.has(PermArr[Perm]))
                return `Sorry, ${message.author}. It seems like I don't have the **${PermArr[Perm]}** permission.`

        message.delete();
        message.channel.send(args.join(" "));
    },
};