const { Message } = require('discord.js');

module.exports = {
    name: 'setpfp',
    cooldown: 5,
    description: 'Changes my profile picture',
    usage: ' [preview] <1k | AFools | Cool | Green | Hollywood | Blogger | Sithlord | Wiking>',
    id: 4,
    example: ["AFools", "preview Green"],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        if (!args[0]) return message.channel.send(`Tell me which picture to set!`);
        let PFP = args[0].toLowerCase() == "preview" ? args[1] : args[0];

        switch (PFP.toLowerCase()) {
            case 'preview': break;
            case '1k': PFP = '1k days celebration hype.png'; break;
            case 'afools': PFP = 'April Fools.png'; break;
            case 'cool': PFP = 'FeelsCoolMan.png'; break;
            case 'green': PFP = 'Greeny_Boi.png'; break;
            case 'hollywood': PFP = 'Hollywood Party.png'; break;
            case 'blogger': PFP = 'The Blogger.png'; break;
            case 'sithlord': PFP = 'The Sithlord.png'; break;
            case 'wiking': PFP = 'Wiking.png'; break;
            case 'winter': PFP = 'Winter.png'; break;
            default: return message.channel.send(`I couldn't find that PFP in my folder!`);
        }

        if (args[0].toLowerCase() == "preview")
            return HandlePreview(message, PFP);

        message.client.user.setAvatar(`./commands/4 DevOnly/pfps/${PFP}`).then(() => {
            if (message.channel.type != 'dm' && !message.channel.permissionsFor(message.client.user).has('SEND_MESSAGES'))
                return message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!\nBut I have updated my PFP!`);

            return message.channel.send(`Successfully changed my profile picture!`);
        }).catch(err => message.channel.send(`ERROR!\n\n${err}`));

    },
};

/**@param {Message} message @param {string} imageToPreview
 */
function HandlePreview(message, imageToPreview) {
    if (imageToPreview == null)
        return message.channel.send(`Preview image not specified.`);
    try {
        message.channel.send(`Preview image for: **${imageToPreview}**`);
        message.channel.send({
            files: [{
                attachment: `./pfps/${imageToPreview}`,
                name: `${imageToPreview}.png`
            }]
        }).catch(e => message.channel.send(e));
    }
    catch (e) { message.channel.send(`Unable to find ${imageToPreview} in my available PFPs!\n` + e.message); }
}