const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('updatepguildmembers', 'DevOnly', 'Updates .pGuildMember cache', {
    guildOnly: true
}, async ({ client, message, args, pAuthor, pGuildMember, pGuild, pGuildClient }) => {
    await client.pGuildMembers.get(message.guild).refresh(client);

    if (message.content.includes(module.exports.name))
        message.react('👌');
})