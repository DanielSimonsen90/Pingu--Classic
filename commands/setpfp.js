module.exports = {
    name: 'setpfp',
    cooldown: 5,
    description: 'Changes my profile picture',
    usage: '<1k | AFools | Cool | Green | Hollywood | Blogger | Sithlord | Wiking>',
    id: 4,
    execute(message, args) {
        let PFP;
        switch (args[0]) {
            case '1k': PFP = '1k days celebration hype.png'; break;
            case 'AFools': PFP = 'April Fools.png'; break;
            case 'Cool': PFP = 'FeelsCoolMan.png'; break;
            case 'Green': PFP = 'Greeny_Boi.png'; break;
            case 'Hollywood': PFP = 'Hollywood Party.png'; break;
            case 'Blogger': PFP = 'The Blogger.png'; break;
            case 'Sithlord': PFP = 'The Sithlord.png'; break;
            case 'Wiking': PFP = 'Wiking.png'; break;
            case 'Winter': PFP = 'Winter.png'; break;
            default: return message.channel.send(`I couldn't find that PFP in my folder!`);
        }

        message.client.user.setAvatar(`./pfps/${PFP}`);

        if (message.channel.type !== 'dm' && !message.channel.memberPermissions(message.guild.client.user).has('SEND_MESSAGES'))
            return message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!\nBut I have updated my PFP!`);

        return message.channel.send(`Successfully changed my profile picture!`);
    },
};