const { PinguCommand } = require('PinguPackage')

module.exports = new PinguCommand('test', 'DevOnly', `Test command for Danho`, {

}, async ({ client, message, args, pAuthor, pGuild, pGuildClient }) => {
        let msg = await message.channel.messages.fetch('821748634429030421');
        msg.edit(args.join(' '));
});