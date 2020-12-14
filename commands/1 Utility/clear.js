const { Message, User, GuildChannel } = require('discord.js');
const { PinguLibrary, DiscordPermissions } = require('../../PinguPackage');

module.exports = {
    name: 'clear',
    description: 'Clears specified messages.',
    usage: '<messages [from @User] | all [channelID]> ',
    id: 1,
    examples: ["5", "10 @Danho#2105", "all"],
    permissions: [DiscordPermissions.SEND_MESSAGES, DiscordPermissions.MANAGE_MESSAGES],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        const PermCheck = PermissionCheck(message, args);
        if (PermCheck != PinguLibrary.PermissionGranted) return message.channel.send(PermCheck);

        if (args[0].toLowerCase() == "all")
            return message.author.send(ClearAll(message, args[1]));
        else if (args[0].toLowerCase() == "log" && PinguLibrary.isPinguDev(message.author)) {
            console.clear();
            return message.channel.send('I have cleared the log!');
        }
        else if (message.mentions.users.first())
            return SpecificClear(message, args, message.mentions.users.first());

        message.delete().then(() => {
            ClearMessages(message, parseInt(args[0]));
            message.reply(`I've deleted ${args[0]} ${(args[0] != '1' ? "messages" : "message")} for you!`)
                .then(NewMessage => NewMessage.delete(1500));
        });
    },
};
/**@param {Message} message 
 * @param {string[]} args*/
function PermissionCheck(message, args) {
    return args[0].toLowerCase() != "log" ? `I can't execute that command in DMs!` : PinguLibrary.PermissionGranted;
}
/**@param {Message} message 
 * @param {number} amount*/
async function ClearMessages(message, amount) {
    let MessagesRemoved = 0,
        MessageArray = (await message.channel.messages.fetch()).array();
    let MsgArrIndex = MessageArray.length - 1;

    while (MessagesRemoved != amount)
        MessageArray[MsgArrIndex].delete()
            .then(++MessagesRemoved)
            .catch(err => PinguLibrary.errorLog(message.client, `Failed to remove message`, message.content, err)
                .then(() => message.channel.send(`I had an error trying to delete the messages! I've already notified my developers.`)
            ));
}
/**@param {Message} message
 @param {GuildChannel} channel*/
async function ClearAll(message, channel) {
    var permCheck = PinguLibrary.PermissionCheck(message, [Permissions.FLAGS.MANAGE_CHANNELS]);
    if (permCheck != PinguLibrary.PermissionGranted) return permCheck;

    if (!channel) channel = message.channel;
    else channel = message.guild.channels.cache.find(c =>
        c.id == channel ||
        c.name == channel ||
        c == channel ||
        `<#${c.id}>` == channel
    );

    if (message.guild.rulesChannelID == channel.id || !['text', 'voice'].includes(channel.type))
        return `I cannot replace that channel!`;


    channel.delete(`Requested by ${message.author.username}`);
    var newChannel = await channel.clone();
    return `I've deleted the previous #${channel.name}, and replaced it with ${(`${newChannel}` ||  `a new one!`)}!`;
}
/**@param {Message} message 
 * @param {string[]} args 
 * @param {User} SpecificUser*/
async function SpecificClear(message, args, SpecificUser) {
    let messagesRemoved = 0,
        messageCache = (await message.channel.messages.fetch()).array(),
        messagesToRemove = parseInt(args[0]);
    let cacheSize = messageCache.length - 1;


    message.delete().then(async () => {
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
        PinguLibrary.errorLog(message.client, `Tried to clear ${args[0]} messages from ${SpecificUser.username}`, message.content, err);
        return message.channel.send(`I attempted to delete the messages, but couldn't finish!`);
    })
}