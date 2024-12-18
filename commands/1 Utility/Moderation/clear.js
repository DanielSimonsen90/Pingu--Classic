const { Message, User, GuildChannel } = require('discord.js');
const { PinguLibrary, PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('clear', 'Utility', 'Clears specified messages', {
    usage: '<messages [from @User] | all [channelID]> ',
    examples: ["5", "10 @Danho#2105", "all"],
    guildOnly: true,
    permissions: ['MANAGE_MESSAGES']
}, async ({ message, args }) => {
    const PermCheck = PermissionCheck(message, args);
    if (PermCheck != PinguLibrary.PermissionGranted) return message.channel.send(PermCheck);

    if (args[0].toLowerCase() == "all")
        return message.author.send(await ClearAll(message, args[1]));
    else if (args[0].toLowerCase() == "log" && PinguLibrary.isPinguDev(message.author)) {
        console.clear();
        return message.channel.send('I have cleared the log!');
    }
    else if (message.mentions.users.first())
        return SpecificClear(message, args, message.mentions.users.first());

    await message.delete()
    ClearMessages(message, parseInt(args[0]));
    return (await message.reply(`I've deleted ${args[0]} ${(args[0] != '1' ? "messages" : "message")} for you!`)).delete({ timeout: 1500 });
});



/**@param {Message} message 
 * @param {string[]} args*/
function PermissionCheck(message, args) {
    return args[0].toLowerCase() != "log" && message.channel.type == 'dm' ? `I can't execute that command in DMs!` : PinguLibrary.PermissionGranted;
}
/**@param {Message} message 
 * @param {number} amount
 * @returns {Promise<Message>}*/
async function ClearMessages(message, amount) {
    return message.channel.bulkDelete(amount).catch(err =>
        PinguLibrary.errorLog(message.client, `Failed to remove message`, message.content, err)
            .then(() => message.channel.send(`I had an error trying to delete the messages! I've already notified my developers.`)));
}
/**@param {Message} message
 @param {GuildChannel} channel*/
async function ClearAll(message, channel) {
    var permCheck = PinguLibrary.PermissionCheck(message, 'MANAGE_CHANNELS');
    if (permCheck != PinguLibrary.PermissionGranted) return permCheck;

    if (!channel) channel = message.channel;
    else channel = message.guild.channels.cache.find(c => [c.id, c.name, c, `<#${c.id}>`].includes(channel));

    if (message.guild.rulesChannelID == channel.id || !['text', 'voice', 'news'].includes(channel.type))
        return `I cannot replace that channel!`;


    channel.delete(`Requested by ${message.author.username}`);
    let pos = channel.position;
    var newChannel = await channel.clone();
    await newChannel.setPosition(pos);
    return `I've deleted the previous #${channel.name}, and replaced it with ${(`${newChannel}` || `a new one!`)}!`;
}
/**@param {Message} message 
 * @param {string[]} args 
 * @param {User} SpecificUser*/
async function SpecificClear(message, args, SpecificUser) {
    let messagesRemoved = 0,
        messagesToRemove = parseInt(args[0]);
    let messageCache = (await message.channel.messages.fetch({ limit: messagesToRemove + 1 })).array();
    let cacheSize = messageCache.length - 1;


    return message.delete().then(async () => {
        while (messagesRemoved != messagesToRemove) {
            if (messageCache[cacheSize].author.id == SpecificUser.id) {
                await messageCache[cacheSize].delete();
                messagesRemoved++;
            }
            cacheSize--;
        }
        return message.channel.send(`Removed ${args[0]} messages from ${SpecificUser.username}`)
            .then(sent => sent.delete({ timeout: 1500 }));
    }).catch(err => {
        PinguLibrary.errorLog(message.client, `Tried to clear ${args[0]} messages from ${SpecificUser.username}`, message.content, err, {
            params: { message, args, SpecificUser },
            additional: { messagesRemoved, messageCache, messagesToRemove, cacheSize }
        });
        return message.channel.send(`I attempted to delete the messages, but couldn't finish!`);
    })
}