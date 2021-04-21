const { PinguCommand, PinguGuild, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('prefix', 'Utility', 'Set my prefix for the server', {
    usage: '<new prefix>',
    guildOnly: true,
    example: ["!"]
}, async ({ message, args, pGuild, pGuildClient }) => {
    if (!args || !args[0]) return message.channel.send(`My prefix is \`${pGuildClient.prefix}\``);

    const permCheck = PinguLibrary.PermissionCheck(message, 'ADMINISTRATOR');
    if (permCheck != PinguLibrary.PermissionGranted) return message.channel.send(permCheck);

    let prePrefix = pGuildClient.prefix;

    //Set new prefix
    pGuildClient.prefix = args[0];

    //Update db
    await PinguGuild.Update(message.client, ['clients'], pGuild, module.exports.name, `Prefix for **${message.guild.name}** has been changed to \`${args[0]}\`!`)

    return message.channel.send(`Changed my prefix from \`${prePrefix}\` to \`${args[0]}\``);
});