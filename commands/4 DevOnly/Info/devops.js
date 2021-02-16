const { Message } = require('discord.js');
const { DiscordPermissions } = require('PinguPackage');

module.exports = {
    name: 'devops',
    description: 'Sends link to DevOps page',
    usage: '',
    id: 4,
    example: [""],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message, args: string[]}}*/
    execute({ message, args }) {
        message.channel.send("https://dev.azure.com/SimonsenTechs/Pingu/_backlogs/backlog/Pingu%20Team/Epics/?showParents=true")
    }
}