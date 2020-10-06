const { Message, User } = require('discord.js');

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
            const DeleteReply = args[0] != '1' ?
                `I've deleted ${args[0]} messages for you!` :
                `I've deleted ${args[0]} message for you!`;

            message.reply(DeleteReply).then(NewMessage => NewMessage.delete(1500));
        });
    },
};
/**@param {Message} message @param {string[]} args*/
function PermissionCheck(message, args) {
    if (message.channel.type !== 'dm') {
        const PermArr = ["SEND_MESSAGES", "MANAGE_MESSAGES"],
            PermArrMsg = ["send messages", "manage messages"];

        for (var x = 0; x < PermArr.length; x++)
            if (!message.channel.permissionsFor(message.client.user).has(PermArr[x]))
                return `Hey! I don't have permission to **${PermArrMsg[x]}** in #${message.channel.name}!`
    }
    else if (args[0].toLowerCase() !== "log")
        return `I can't execute that command in DMs!`;
    return `Permission Granted`;
}
/**@param {Message} message @param {number} amount*/
function ClearMessages(message, amount) {
    let MessagesRemoved = 0,
        MsgArrIndex = message.channel.messages.cache.size - 1,
        MessageArray = message.channel.messages.cache.array();

    while (MessagesRemoved != amount)
        MessageArray[MsgArrIndex].delete()
            .then(MessagesRemoved++)
            .catch(error => message.author.send(error));
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
    try {
        message.delete().then(() => {
            while (MessagesRemoved !== parseInt(args[0])) {
                if (MessageArray[MsgArrIndex].author.id == SpecificUser.id)
                    MessageArray[MsgArrIndex].delete().then(MessagesRemoved++);
                MsgArrIndex--;
            }
            return `Removed ${args[0]} messages from ${SpecificUser.username}`
                .then(NewMessage => NewMessage.delete(1500));
        });
    }
    catch (error) { return `I attempted to delete the messages, but couldn't finish! \n${error.message}`; }
}
