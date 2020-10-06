const { Message } = require('discord.js');

module.exports = {
    name: 'eat',
    description: 'Is this you, Slothman?',
    usage: '<food>',
    id: 2,
    example: ["fish"],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(message.guild.client.user).has('SEND_MESSAGES'))
                return message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!`);
        let Reply;
        switch (args[0]) {
            case 'shit': Reply = `no u eat the ${args[0]}. :KChamp:`; break;
            case 'fish': Reply = `MMmmmMm! Yes please! Gimme!!`; break;
            case 'leaf': Reply = `What am I a fucking sloth?`; break;
            case 'monster': Reply = `What am I a fucking Billet?`; break;
            case 'sand': Reply = `Am I *that* black??`; break;
            default: Reply = `Uhm.. I don't think I should eat that..`; break;
        }
        message.channel.send(Reply);
    },
};