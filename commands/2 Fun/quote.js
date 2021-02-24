const { PinguCommand, PinguLibrary } = require("PinguPackage");

module.exports = new PinguCommand('quote', 'Fun', 'Quotes your message', {
    usage: '<message> [@Quotee]',
    guildOnly: true,
    example: ["This is a quote by me!", "Idk why he wanna quote me?? @Danho#2105"],
    permissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
}, async ({ message, args }) => {
    let Quote = args.join(" "),
        quotee = message.mentions.users.size != 0 ?
            message.mentions.users.first().username :
            message.author.username;

    if (message.mentions.users.size)
        Quote = Quote.substring(0, Quote.length - args[args.length - 1].length - 1);

    if (!Quote.endsWith('.') && !Quote.endsWith('!') && !Quote.endsWith('?') && !Quote.endsWith(':') && !Quote.endsWith('"'))
        Quote += '.';

    message.delete();

    let messageContent = `\`"${Quote}"\`\n- ${quotee}`;

    if (PinguLibrary.PermissionCheck(message, 'SEND_TTS_MESSAGES') == PinguLibrary.PermissionGranted)
        return message.channel.send(`\`"${Quote}"\`\Said by ${quotee}`, { tts: true })
            .then(QuotedMessage => QuotedMessage.edit(messageContent));
    return message.channel.send(messageContent)
});