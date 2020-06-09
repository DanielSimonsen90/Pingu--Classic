module.exports = {
    name: 'quote',
    cooldown: 5,
    description: 'Quotes your message',
    usage: '<message> [@Quotee]',
    guildOnly: true,
    id: 2,
    execute(message, args) {
        CheckPermissions(message);

        let Quote = args.join(" "),
            quotee = message.mentions.users.size != 0 ?
                     message.mentions.users.first().username :
                     message.author.username;

        if (message.mentions.users.size != 0)
            Quote = Quote.substring(0, Quote.length - args[args.length - 1].length - 1);

        if (!Quote.endsWith('.') || !Quote.endsWith('!') || !Quote.endsWith('?') || !Quote.endsWith(':') || !Quote.endsWith('"'))
            Quote += '.';

        message.delete();

        message.channel.send(`\`"${Quote}"\`\Said by ${quotee}`, { tts: true })
            .then(QuotedMessage => { QuotedMessage.edit(`\`"${Quote}"\`\n- ${quotee}`) });
    },
};

function CheckPermissions(message) {
    if (message.channel.type === 'dm')
        return message.author.send(`I execute this command in DMs.`);
    else {
        const PermissionCheck = message.channel.memberPermissions(message.guild.client.user),
            PermArr = ["SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS"];
        for (var Perm = 0; Perm < PermArr.length; Perm++)
            if (!PermissionCheck.has(PermArr[Perm]))
                return `Sorry, ${message.author}. It seems like I don't have the **${PermArr[Perm]}** permission.`;
    }
}