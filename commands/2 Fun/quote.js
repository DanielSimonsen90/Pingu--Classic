const { PinguCommand } = require("PinguPackage");

module.exports = new PinguCommand('quote', 'Fun', 'Quotes your message', {
    usage: '<message> [@Quotee]',
    guildOnly: true,
    example: ["This is a quote by me!", "Idk why he wanna quote me?? @Danho#2105"],
    permissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
}, async ({ client, message, args }) => {
    let quote = args.join(" "),
        quotee = message.mentions.users.size != 0 ?
            message.mentions.users.first()?.username :
            message.author.username;

    if (message.mentions.users.size)
        quote = quote.substring(0, quote.length - args[args.length - 1].length - 1);

    if (!quote.endsWith('.') && !quote.endsWith('!') && !quote.endsWith('?') && !quote.endsWith(':') && !quote.endsWith('"'))
        quote += '.';

    message.delete();

    let messageContent = `\`"${quote}"\`\n- ${quotee}`;

    if (client.permissions.checkFor(message, 'SEND_TTS_MESSAGES') == client.permissions.PermissionGranted)
        return message.channel.send(`\`"${quote}"\`\Said by ${quotee}`, { tts: true }).then(sent => sent.edit(messageContent));
    return message.channel.send(messageContent)
});