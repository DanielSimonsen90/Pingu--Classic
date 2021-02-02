const { Message } = require('discord.js'),
    { PinguGuild, DiscordPermissions, PClient, PinguLibrary } = require('../../PinguPackage');

module.exports = {
    name: 'prefix',
    description: 'set the prefix of server',
    usage: '<new prefix>',
    guildOnly: true,
    id: 1,
    example: ['!'],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message, args: string[], pGuild: PinguGuild, pGuildClient: PClient}}*/
    async execute({ message, args, pGuild, pGuildClient }) {
        if (!args || !args[0])
            return message.channel.send(`My prefix is \`${pGuildClient.prefix}\``);

        pGuildClient = PinguGuild.GetPClient(message.client, pGuild);
        let prePrefix = pGuildClient.prefix;

        //Set new prefix
        pGuildClient.prefix = args[0];

        //Update db
        PinguGuild.UpdatePGuild(message.client, {clients: pGuild.clients}, pGuild, this.name,
            `Prefix has been changed to \`${args[0]}\`!`,
            `I encountered and error while changing my prefix in ${message.guild.name}:\n\n`
        )

        return message.channel.send(`Changed my prefix from \`${prePrefix}\` to \`${args[0]}\``);
    },
};