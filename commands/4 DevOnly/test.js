const { PinguCommand } = require('PinguPackage');
const { MessageEmbed } = require('discord.js');

module.exports = new PinguCommand('test', 'DevOnly', `Test command for Danho`, {
    mustBeBeta: true
}, async ({ client, message, args, pAuthor, pGuildMember, pGuild, pGuildClient }) => {
    const embed = new MessageEmbed()
        .setTitle('test')
        .setDescription('I am test')
        .setTimestamp(Date.now())
        .setFooter('hello');
    return message.channel.send({ embed });
});