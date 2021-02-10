const { Message } = require('discord.js');
const { DiscordPermissions, config } = require('PinguPackage');

module.exports = {
    name: 'version',
    description: 'Sends version of Pingu',
    usage: '',
    guildOnly: false,
    id: 4,
    examples: [""],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message}}*/
    execute({ message }) {
        message.channel.send(`Currently running version **${config.version}**`)
    }
}