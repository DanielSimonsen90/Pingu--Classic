const { Message } = require("discord.js");
const { DiscordPermissions } = require("../../PinguPackage");

module.exports = {
    name: 'quote',
    cooldown: 5,
    description: 'Quotes your message',
    usage: '<message> [@Quotee]',
    guildOnly: true,
    id: 2,
    example: ["This is a quote by me!", "Idk why he wanna quote me?? @Danho#2105"],
    permissions: [DiscordPermissions.SEND_MESSAGES, DiscordPermissions.MANAGE_MESSAGES, /*DiscordPermissions.EMBED_LINKS*/],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        let Quote = args.join(" "),
            quotee = message.mentions.users.size != 0 ?
                message.mentions.users.first().username :
                message.author.username;

        if (message.mentions.users.size != 0)
            Quote = Quote.substring(0, Quote.length - args[args.length - 1].length - 1);

        if (!Quote.endsWith('.') && !Quote.endsWith('!') && !Quote.endsWith('?') && !Quote.endsWith(':') && !Quote.endsWith('"'))
            Quote += '.';

        message.delete();

        message.channel.send(`\`"${Quote}"\`\Said by ${quotee}`, { tts: true })
            .then(QuotedMessage => QuotedMessage.edit(`\`"${Quote}"\`\n- ${quotee}`));
    },
};