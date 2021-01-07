const { Message } = require('discord.js'),
    { PinguGuild, DiscordPermissions } = require('../../PinguPackage');

module.exports = {
    name: 'prefix',
    description: 'set the prefix of server',
    usage: '<new prefix>',
    guildOnly: true,
    id: 1,
    example: ['!'],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message, args: string[], pGuild: PinguGuild}}*/
    execute({ message, args, pGuild }) {
        if (!args || !args[0])
            return message.channel.send(`My prefix is \`${PinguGuild.GetPGuild(message.guild).botPrefix}\``);

        var prePrefix = pGuild.botPrefix;

        //Set new prefix
        pGuild.botPrefix = args[0];

        //Update guilds.json
        PinguGuild.UpdatePGuildJSON(message.client, message.guild, this.name,
            `Prefix has been changed to \`${args[0]}\`!`,
            `I encountered and error while changing my prefix in ${message.guild.name}:\n\n`
        )

        return message.channel.send(`Changed my prefix from **${prePrefix}** to **${args[0]}**`);
    },
};