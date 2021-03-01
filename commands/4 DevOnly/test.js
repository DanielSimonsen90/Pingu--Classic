const { Webhook } = require('discord.js')
const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('test', 'DevOnly', `Test command for Danho`, {

}, async ({ client, message, args, pAuthor, pGuild, pGuildClient }) => {

});