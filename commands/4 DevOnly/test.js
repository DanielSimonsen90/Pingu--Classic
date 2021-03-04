const { Webhook } = require('discord.js')
const { PinguCommand, PinguLibrary, config } = require('PinguPackage');
const ms = require('ms');

module.exports = new PinguCommand('test', 'DevOnly', `Test command for Danho`, {

}, async ({ client, message, args, pAuthor, pGuild, pGuildClient }) => {
    
});