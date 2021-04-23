const { PinguCommand, PinguLibrary, PinguGuild, PinguGuildSchema } = require('PinguPackage');

module.exports = new PinguCommand('updatepguilds', 'DevOnly', `Updates all PinguGuilds`, {

}, async ({ client, message, args, pAuthor, pGuild, pGuildClient }) => {
    const PinguGuilds = await PinguGuild.GetGuilds();

    //Promise.all(PinguGuilds.map(pGuild => {
    await PinguGuildSchema.updateMany({}, { $set: { joinedAt: new Date(Date.now()) } }).exec();
    //}))

    if (message.content.includes(module.exports.name))
        message.react('👌');
})