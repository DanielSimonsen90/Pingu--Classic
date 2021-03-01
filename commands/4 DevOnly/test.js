const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('test', 'DevOnly', `Test command for Danho`, {

}, async ({ client, message, args, pAuthor, pGuild, pGuildClient }) => {
    PinguLibrary.errorLog(client, `#error-log test`, message.content, { message: "Error testing!" }, {
        params: { pGuildClient }
    })
});