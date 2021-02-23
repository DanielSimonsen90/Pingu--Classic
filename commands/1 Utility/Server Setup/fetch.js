const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('fetch', 'Utility', 'Fetches provided message id, and saves the message in cache', {
    usage: '<message id>',
    guildOnly: true
}, async ({ message, args }) => {
    if (!args[0]) return message.channel.send(`Message ID not provided!`);
    else if (isNaN(parseInt(args[0]))) {
        let id = args[0].split('/')[6];
        if (!id) return message.channel.send(`Please provide a proper message id!`);
        args[0] = id;
    }

    if (PinguLibrary.PermissionCheck(message, ['READ_MESSAGE_HISTORY']) != PinguLibrary.PermissionGranted)
        return message.channel.send(`I don't have permission to **read message history** here!`);

    let fetched = await message.channel.messages.fetch(args[0]).catch(_ => null);
    if (!fetched) return message.channel.send(`I couldn't fetch that message!`);

    return message.channel.send(`Message fetched!\n${fetched.url}`);
});