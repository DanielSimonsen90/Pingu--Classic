const { PinguCommand, PinguUser, PinguUserSchema } = require('PinguPackage');

module.exports = new PinguCommand('updatepusers', 'DevOnly', `Updates all PinguUsers`, {

}, async ({ client, message, args, pAuthor, pGuild, pGuildClient }) => {
    const PinguUsers = await PinguUser.GetUsers();

    //Promise.all(PinguGuilds.map(pGuild => {
    await PinguUserSchema.updateMany({}, { $set: { joinedAt: new Date(Date.now()) } }).exec();
    //}))

    if (message.content.includes(module.exports.name))
        message.react('👌');
})