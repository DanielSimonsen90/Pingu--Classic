const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('devops', 'DevOnly', 'Sends link to DevOps page', null, async ({ message }) => {
    return message.channel.send("https://dev.azure.com/SimonsenTechs/Pingu/_backlogs/backlog/Pingu%20Team/Epics/?showParents=true")
});