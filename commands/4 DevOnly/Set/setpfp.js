const { Message } = require('discord.js');
const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('setpfp', 'DevOnly', 'Changes my profile picutre', {
    usage: ' [preview] <1k | AFools | Cool | Christmas | Green | Hollywood | Blogger | Sithlord | Wiking>',
    example: ["AFools", "preview Green"]
}, async ({ client, message, args, pGuildClient }) => {
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

        client.user.setAvatar(newPFP).then(() => {
            PinguLibrary.SavedServers.PinguSupport(client).setIcon(newPFP, `${message.author.username} called ${pGuildClient.prefix}setpfp in "${message.guild.name}", #${message.channel.name}.`);
        PinguLibrary.consoleLog(client, `${message.author.username} set profile picture to "${PFP}".`);

        return message.channel.send(`Successfully changed my profile picture!`);
    }).catch(err => message.channel.send(`Error while changing picture\n${err}`));
});

/**@param {Message} message 
 * @param {string} imageToPreview*/
function HandlePreview(message, imageToPreview) {
    let permCheck = PinguLibrary.PermissionCheck(message, 'ATTACH_FILES');
    if (permCheck != PinguLibrary.PermissionGranted) return message.channel.send(permCheck);

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