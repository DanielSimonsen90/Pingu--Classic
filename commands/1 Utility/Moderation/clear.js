const { Message, User, GuildChannel } = require('discord.js');
const { PinguCommand, PinguClient } = require('PinguPackage');

module.exports = new PinguCommand('clear', 'Utility', 'Clears specified messages', {
    usage: '<messages [from @User] | all [channelId]> ',
    examples: ["5", "10 @Danho#2105", "all"],
    guildOnly: true,
    permissions: ['MANAGE_MESSAGES']
}, async ({ client, message, args }) => {
    const firstArg = args.first.toLowerCase();

    if (firstArg == "all")
        return message.author.send(await ClearAll(message, args[1]));
    else if (firstArg == "log" && client.developers.isPinguDev(message.author)) {
        console.clear();
        return message.channel.send('I have cleared the log!');
    }
    else if (message.mentions.users.first())
        return SpecificClear(message, args, message.mentions.users.first());

    await Promise.all([
        message.delete(),
        ClearMessages(message, parseInt(firstArg))
    ])

    const result = await message.reply({ content: `I've deleted ${firstArg} ${(firstArg != '1' ? "messages" : "message")} for you!` });
    result.doIn(() => result.delete(), 1500);
    return result;
});

/**@param {Message} message 
 * @param {number} amount
 * @returns {Promise<Message>}*/
async function ClearMessages(message, amount) {
    const { client } = message;
    return message.channel.bulkDelete(amount).catch(err =>
        client.log('error', `Failed to remove message`, message.content, err)
            .then(() => message.channel.send(`I had an error trying to delete the messages! I've already notified my developers.`)));
}
/**@param {Message} message
 @param {GuildChannel} channel*/
async function ClearAll(message, channel) {
    const { client } = message;

    var permCheck = client.permissions.checkFor(message, 'MANAGE_CHANNELS');
    if (permCheck != client.permissions.PermissionGranted) return permCheck;

    if (!channel) channel = message.channel;
    else channel = message.guild.channels.cache.find(c => [c.id, c.name, c, `<#${c.id}>`].includes(channel));

    if (message.guild.rulesChannelId == channel.id || !['text', 'voice', 'news'].includes(channel.type))
        return `I cannot replace that channel!`;

    channel.delete(`Requested by ${message.author.username}`);
    const pos = channel.position;
    const clone = await channel.clone();
    await clone.setPosition(pos);
    return `I've deleted the previous #${channel.name}, and replaced it with ${(`${clone}` || `a new one!`)}!`;
}
/**@param {Message} message 
 * @param {string[]} args 
 * @param {User} SpecificUser*/
async function SpecificClear(message, args, SpecificUser) {
    let messagesRemoved = 0,
        messagesToRemove = parseInt(args[0]);
    let messageCache = (await message.channel.messages.fetch({ limit: messagesToRemove + 1 })).array();
    let cacheSize = messageCache.length - 1;
    const { client } = message;

    return message.delete().then(async () => {
        while (messagesRemoved != messagesToRemove) {
            if (messageCache[cacheSize].author.id == SpecificUser.id) {
                await messageCache[cacheSize].delete();
                messagesRemoved++;
            }
            cacheSize--;
        }
        return message.channel.send(`Removed ${args[0]} messages from ${SpecificUser.username}`)
            .then(sent => send.doIn(() => sent.delete(), 1500));
    }).catch(err => {
        client.log('error', `Tried to clear ${args[0]} messages from ${SpecificUser.username}`, message.content, err, {
            params: { message, args, SpecificUser },
            additional: { messagesRemoved, messageCache, messagesToRemove, cacheSize }
        });
        return message.channel.send(`I attempted to delete the messages, but couldn't finish!`);
    })
}