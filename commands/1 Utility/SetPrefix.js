const { Message } = require('discord.js'),
    { PinguGuild } = require('../../PinguPackage');

module.exports = {
    name: 'setprefix',
    description: 'set the prefix of server',
    usage: '<new prefix>',
    guildOnly: true,
    id: 1,
    example: ['!'],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        //Set new prefix
        PinguGuild.GetPGuild(message).botPrefix = args[0];

        //Update guilds.json
        PinguGuild.UpdatePGuildsJSON(message,
            `Prefix has been changed to \`${args[0]}\`!`,
            `I encountered and error while changing my prefix in ${message.guild.name}:\n\n`
        )
    },
};