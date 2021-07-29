const { PinguCommand, PinguUser } = require('PinguPackage');
const { Collection } = require('discord.js');

module.exports = new PinguCommand('test', 'DevOnly', `Test command for Danho`, {
    mustBeBeta: true
}, async ({ client, message, args, pAuthor, pGuildMember, pGuild, pGuildClient }) => {
    const date = new Date(args[0]);
    const unix = date.getTime() / 1000;

    const map = new Collection([
        ['Short Time', 't'],
        ['Long Time', 'T'],
        ['Short Date', 'd'],
        ['Long Date', 'D'],
        ['Short DateTime', 'f'],
        ['Long DateTime', 'F'],
        ['Relative Time', 'R']
    ]);

    let response = map.reduce((res, v, k) => res += `<t:${unix}:${v}> **${k}**\n`, ``);
    return message.channel.send(response);
});