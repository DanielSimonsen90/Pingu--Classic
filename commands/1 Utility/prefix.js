const { Message } = require('discord.js'),
    { PinguGuild } = require('../../PinguPackage');

module.exports = {
    name: 'prefix',
    description: 'set the prefix of server',
    usage: '<new prefix>',
    guildOnly: true,
    id: 1,
    example: ['!'],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        if (!args || !args[0])
            return message.channel.send(`My prefix is \`${PinguGuild.GetPGuild(message.guild).botPrefix}\``);

        //Set new prefix
        PinguGuild.GetPGuild(message.guild).botPrefix = args[0];

        //Update guilds.json
        PinguGuild.UpdatePGuildsJSON(message.client, module.exports.name,
            `Prefix has been changed to \`${args[0]}\`!`,
            `I encountered and error while changing my prefix in ${message.guild.name}:\n\n`
        )
    },
};