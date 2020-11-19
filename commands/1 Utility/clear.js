const { Message, User, Permissions } = require('discord.js');
const { PinguSupport, PinguLibrary } = require('../../PinguPackage');

module.exports = {
    name: 'clear',
    description: 'Clears specified messages.',
    usage: '<messages [from @User] | all>',
    id: 1,
    examples: ["5", "10 @Danho#2105", "all"],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        const PermCheck = PermissionCheck(message, args);
        if (PermCheck != `Permission Granted`) return message.channel.send(PermCheck);

        if (args[0].toLowerCase() == "all")
            return message.author.send(ClearAll(message));
        else if (args[0].toLowerCase() == "log" && message.author.id == '245572699894710272') {
            console.clear();
            return message.channel.send('I have cleared the log!');
        }
        else if (message.mentions.users.first())
            return message.channel.send(SpecificClear(message, args, message.mentions.users.first()));

        message.delete().then(() => {
            ClearMessages(message, parseInt(args[0]));
            message.reply(`I've deleted ${args[0]} ${(args[0] != '1' ? "messages" : "message")} for you!`)
                .then(NewMessage => NewMessage.delete(1500));
        });
    },
};
/**@param {Message} message @param {string[]} args*/
function PermissionCheck(message, args) {
    if (message.channel.type != 'dm') {
        var perms = [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.MANAGE_MESSAGES];
        var permCheckClient = PinguLibrary.PermissionCheck(message, message.client.user, perms),
            permCheckUser = PinguLibrary.PermissionCheck(message, message.author, perms);
        if (permCheckClient != PinguLibrary.PermissionGranted) return permCheckClient;
        else if (permCheckUser != PinguLibrary.PermissionGranted) return permCheckUser;
    }
    else if (args[0].toLowerCase() != "log")
        return `I can't execute that command in DMs!`;
    return PinguLibrary.PermissionGranted;
}
/**@param {Message} message @param {number} amount*/
function ClearMessages(message, amount) {
    let MessagesRemoved = 0,
        MsgArrIndex = message.channel.messages.cache.size - 1,
        MessageArray = message.channel.messages.cache.array();

    while (MessagesRemoved != amount)
        MessageArray[MsgArrIndex].delete()
            .then(MessagesRemoved++)
            .catch(err => PinguSupport.errorLog(`Error while deleting messages: ${err}`));
}
/**@param {Message} message*/
function ClearAll(message) {
    if (!message.channel.permissionsFor(message.guild.client.user).has('MANAGE_CHANNELS'))
        return `Hey! I don't have permission to **manage channels**!`;

    message.channel.clone();
    message.channel.delete();
    return `I've deleted the previous #${message.channel.name}, and replaced it with a new one!`;
}
/**@param {Message} message @param {string[]} args @param {User} SpecificUser*/
function SpecificClear(message, args, SpecificUser) {
    let MessagesRemoved = 0,
        MsgArrIndex = message.channel.messages.cache.size - 1,
        MessageArray = message.channel.messages.cache.array();

    message.delete().then(() => {
        while (MessagesRemoved !== parseInt(args[0])) {
            if (MessageArray[MsgArrIndex].author.id == SpecificUser.id)
                MessageArray[MsgArrIndex].delete().then(MessagesRemoved++);
            MsgArrIndex--;
        }
        return `Removed ${args[0]} messages from ${SpecificUser.username}`
            .then(NewMessage => NewMessage.delete(1500));
    }).catch(err => {
        PinguSupport.errorLog(message.client, `Error while clearing ${args[0]} messages from ${SpecificUser.username}\n${err}`);
        return `I attempted to delete the messages, but couldn't finish!`;
    })
}