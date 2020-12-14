const { Message, Permissions } = require('discord.js');
const { PinguLibrary } = require('../../PinguPackage');

module.exports = {
    name: 'setpfp',
    cooldown: 5,
    description: 'Changes my profile picture',
    usage: ' [preview] <1k | AFools | Cool | Green | Hollywood | Blogger | Sithlord | Wiking>',
    id: 4,
    example: ["AFools", "preview Green"],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        if (!args[0]) args[0] = "preview";
        let PFP = args[0].toLowerCase() == "preview" ? args[1] : args[0];

        switch (PFP.toLowerCase()) {
            case 'preview': break;
            case '1k': PFP = '1k days celebration hype.png'; break;
            case 'afools': PFP = 'April Fools.png'; break;
            case 'cool': PFP = 'FeelsCoolMan.png'; break;
            case 'christmas': PFP = 'Christmas.png'; break;
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

        var newPFP = `./commands/4 DevOnly/pfps/${PFP}`;

        message.client.user.setAvatar(newPFP).then(() => {
            PinguLibrary.SavedServers.PinguSupport(message.client).setIcon(newPFP, `${message.author.username} called *setpfp in "${message.guild.name}", #${message.channel.name}.`);
            console.log(`${message.author.username} set profile picture to "${PFP}".`);

            if (message.channel.type != 'dm') {
                var permCheck = PinguLibrary.PermissionCheck(message, [Permissions.FLAGS.SEND_MESSAGES]);
                if (permCheck != PinguLibrary.PermissionGranted) return message.author.send(`${permCheck}\nBut I have updated my profile picture!`);
            }
            return message.channel.send(`Successfully changed my profile picture!`);
        }).catch(err => message.channel.send(`Error while changing picture\n${err}`));

    },
};

/**@param {Message} message @param {string} imageToPreview
 */
function HandlePreview(message, imageToPreview) {
    if (!imageToPreview) return message.channel.send(`Preview image not specified!`);
    try {
        message.channel.send(`Preview image for: **${imageToPreview}**`, {
            files: [{
                attachment: `./pfps/${imageToPreview}`,
                name: `${imageToPreview}.png`
            }]
        }).catch(err => message.channel.send(`Error while sending preview!\n${err}`));
    }
    catch (e) { message.channel.send(`Unable to find ${imageToPreview} in my available PFPs!\n` + e.message); }
}