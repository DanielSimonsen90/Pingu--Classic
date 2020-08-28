module.exports = {
    name: 'clear',
    description: 'Clears specified messages.',
    usage: '<messages | all> [from @User]',
    id: 1,
    execute(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.memberPermissions(message.guild.client.user).has('SEND_MESSAGES'))
                return message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!`)
            else if (!message.channel.memberPermissions(message.guild.client.user).has('MANAGE_MESSAGES'))
                return message.author.send(`Hey! I don't have permission to **manage messages**!`)
        }
        else if (args[0].toLowerCase() !== "log")
            return message.author.send(`I can't execute that command in DMs!`);

        if (args[0].toLowerCase() === "all")
            return message.author.send(ClearAll(message));
        else if (args[0].toLowerCase() === "log" && message.author.id === '245572699894710272') {
            console.clear();
            return message.channel.send('I have cleared the log!');
        }
        else if (message.mentions.users.first())
            return message.channel.send(SpecificClear(message, args, message.mentions.users.first()));

        message.delete().then(() => {
            message.reply((args[0] !== '1') ?
                `I've deleted ${args[0]} messages for you!` :
<<<<<<< Updated upstream
                `I've deleted ${args[0]} message for you!`;

            message.reply(DeleteReply)
                .then((NewMessage) => {
                    NewMessage.delete(1500)
                });
        });
    },
};
=======
                `I've deleted ${args[0]} message for you!`)
                .then((NewMessage) => { NewMessage.delete(1500) });
        });
    },
};

function PermissionCheck(message, args) {
    if (message.channel.type !== 'dm') {
        if (!message.channel.memberPermissions(message.guild.client.user).has('SEND_MESSAGES'))
            return `Hey! I don't have permission to **send messages** in #${message.channel.name}!`;
        else if (!message.channel.memberPermissions(message.guild.client.user).has('MANAGE_MESSAGES'))
            return `Hey! I don't have permission to **manage messages**!`;
    }
    else if (args[0].toLowerCase() !== "log")
        return `I can't execute that command in DMs!`;
    return `Permission granted`;
}
function ClearAll(message) {
    if (!message.channel.memberPermissions(message.guild.client.user).has('MANAGE_CHANNELS'))
        return `Hey! I don't have permission to **manage channels**!`;

    message.channel.clone();
    message.channel.delete();
    return `I've deleted the previous #${message.channel.name}, and replaced it with a new one!`;
}
function SpecificClear(message, args, SpecificUser) {
    let MessagesRemoved = 0,
        MsgArrIndex = message.channel.messages.size - 1,
        MessageArray = message.channel.messages.array();
    try {
        message.delete().then(() => {
            while (MessagesRemoved !== parseInt(args[0])) {
                if (MessageArray[MsgArrIndex].author.id === SpecificUser.id)
                    MessageArray[MsgArrIndex].delete()
                        .then(MessagesRemoved++);
                MsgArrIndex--;
            }
            return `Removed ${args[0]} messages from ${SpecificUser.username}`
                .then((NewMessage) => { NewMessage.delete(1500) });
        });
    }
    catch (error) { return `I attempted to delete the messages, but couldn't finish! \n${error}`; }
}
>>>>>>> Stashed changes
