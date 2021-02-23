const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('viberate', 'Fun', 'I be rating your vibe', {
    usage: '[user]',
    guildOnly: true
}, async ({ message }) => {
    let vibe = Math.floor(Math.random() * 10);
    if (message.mentions.users.first()) {
        var mention = message.mentions.users.first();
    }
    return message.channel.send(`I rate ${(mention ? `${mention.username}'s` : `your`)} vibe to be **${vibe}**! ${(vibe > 7 ? `${(mention ? `They` : `You`)} do be vibin doe!` : ``)}`);
});