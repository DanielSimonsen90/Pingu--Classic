module.exports = {
    name: 'eat',
    description: 'Is this you, Slothman?',
    usage: '<food>',
    id: 2,
    execute(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.memberPermissions(message.guild.client.user).has('SEND_MESSAGES'))
                return message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!`);

        switch (args[0]) {
            case 'shit':
                message.channel.send(`no u eat the ${args[0]}. :KChamp:`);
                break;
            case 'fish':
                message.channel.send(`MMmmmMm! Yes please! Gimme!!`);
                break;
            case 'leaf':
                message.channel.send(`What am I a fucking sloth?`);
                break;
            case 'monster':
                message.channel.send(`What am I a fucking Billet?`);
                break;
            default:
                message.channel.send(`Uhm.. I don't think I should eat that..`);
                break;
        }
    },
};