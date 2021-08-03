const { PinguCommand, PinguGuildSchema } = require('PinguPackage');

module.exports = new PinguCommand('updatepguilds', 'DevOnly', `Updates all PinguGuilds`, {
    mustBeBeta: true
}, async ({ client, message, args, pAuthor, pGuild, pGuildClient }) => {
    await client.pGuilds.refresh(client);

    // Promise.all(client.pGuilds.array().map(async pGuild => 
    //     PinguGuildSchema.updateMany({}, { $set: { joinedAt: new Date() } }).exec()
    // ))

    if (message.content.includes(module.exports.name))
        message.react('👌');
})