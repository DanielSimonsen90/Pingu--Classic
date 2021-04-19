//const { _ } = require('discord.js');
const { PinguCommand } = require('PinguPackage');
    
module.exports = new PinguCommand('test', 'DevOnly', `Test command for Danho`, {
    mustBeBeta: true
}, async ({ client, message, args, pAuthor, pGuildMember, pGuild, pGuildClient }) => {

    return message;
});