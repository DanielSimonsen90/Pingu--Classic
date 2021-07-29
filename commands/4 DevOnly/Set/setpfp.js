const { Message, Collection } = require('discord.js');
const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('setpfp', 'DevOnly', 'Changes my profile picutre', {
    usage: ' [preview] <1k | AFools | Cool | Christmas | Green | Hollywood | Blogger | Sithlord | Wiking>',
    example: ["AFools", "preview Green"]
}, async ({ client, message, args, pGuildClient }) => {
    if (!args[0]) args[0] = "preview";
    
    const keyword = args[0].toLowerCase() == "preview" ? args[1] : args[0];
    const PFP = new Collection([
        ['preview', keyword],
        ['1k', '1k days celebration hype'],
        ['afools', 'April Fools'],
        ['cool', 'FeelsCoolMan'],
        ['christmas', 'Christmas'],
        ['green', 'Greeny_Boi'],
        ['hollywood', 'Hollywood Party'],
        ['blogger', 'The Blogger'],
        ['sithlord', 'The Sithlord'],
        ['wiking', 'Wiking'],
        ['winter', 'Winter']
    ]).get(keyword.toLowerCase())

    if (!PFP) return message.channel.send(`I couldn't find that PFP in my folder!`);

    if (args[0].toLowerCase() == "preview")
        return HandlePreview(message, PFP);

    var newPFP = `./commands/4 DevOnly/pfps/${PFP}.png`;

    await client.user.setAvatar(newPFP).catch(err => message.channel.send(`Error while changing picture\n${err}`));

    PinguLibrary.SavedServers.get('Pingu Support').setIcon(newPFP, `${message.author.username} called ${pGuildClient.prefix}setpfp in "${message.guild.name}", #${message.channel.name}.`);
    PinguLibrary.consoleLog(client, `${message.author.username} set profile picture to "${PFP}".`);

    return message.channel.send(`Successfully changed my profile picture!`);
});

/**@param {Message} message 
 * @param {string} imageToPreview*/
function HandlePreview(message, imageToPreview) {
    let permCheck = PinguLibrary.PermissionCheck(message, 'ATTACH_FILES');
    if (permCheck != PinguLibrary.PermissionGranted) return message.channel.send(permCheck);

    if (!imageToPreview) return message.channel.send(`Preview image not specified!`);
    try {
        message.channel.send(`Preview image for: **${imageToPreview}**`, {
            files: [{ attachment: `./pfps/${imageToPreview}.png`, name: `${imageToPreview}.png` }]
        }).catch(err => message.channel.send(`Error while sending preview!\n${err}`));
    }
    catch (e) { message.channel.send(`Unable to find ${imageToPreview} in my available PFPs!\n` + e.message); }
}