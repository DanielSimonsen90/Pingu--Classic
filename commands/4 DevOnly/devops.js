const { Message } = require('discord.js');

module.exports = {
    name: 'devops',
    cooldown: 5,
    description: 'Sends link to DevOps page',
    usage: '',
    id: 4,
    example: [""],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        message.channel.send("https://dev.azure.com/SimonsenTechs/Pingu/_backlogs/backlog/Pingu%20Team/Epics/?showParents=true")
    }
}