//const { _ } = require('discord.js');
const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('test', 'DevOnly', `Test command for Danho`, {

}, async ({ client, message, args, pAuthor, pGuildMember, pGuild, pGuildClient }) => {
        const channel = message.guild.channels.cache.get('830040677701386280');
        console.log(channel);
});
