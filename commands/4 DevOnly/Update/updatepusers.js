const { PinguCommand, PinguUserSchema } = require('PinguPackage');

module.exports = new PinguCommand('updatepusers', 'DevOnly', `Updates all PinguUsers`, {
    mustBeBeta: true
}, async ({ client, message, args, pAuthor, pGuild, pGuildClient }) => {
    await client.pUsers.refresh(client);

    // await Promise.all(client.pUsers.array().map(async pUser => 
    //     PinguUserSchema.updateMany({}, { $set: { joinedAt: new Date(Date.now()) } }).exec()
    // ));

    if (message.content.includes(module.exports.name))
        message.react('👌');
})