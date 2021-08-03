const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('prefix', 'Utility', 'Set my prefix for the server', {
    usage: '<new prefix>',
    guildOnly: true,
    example: ["!"]
}, async ({ client, message, args, pGuild, pGuildClient }) => {
    if (!args || !args[0]) return message.channel.send(`My prefix is \`${pGuildClient.prefix}\``);
    const newPrefix = args.shift();

    const permCheck = client.permissions.checkFor(message, 'ADMINISTRATOR');
    if (permCheck != client.permissions.PermissionGranted) return message.channel.send(permCheck);

    let prePrefix = pGuildClient.prefix;

    //Set new prefix
    pGuildClient.prefix = newPrefix;

    //Update db
    await client.pGuilds.update(pGuild, module.exports.name, `Prefix for **${message.guild.name}** has been changed to \`${newPrefix}\`.`)
    return message.channel.send(`Changed my prefix from \`${prePrefix}\` to \`${newPrefix}\``);
});