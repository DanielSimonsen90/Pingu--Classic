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

        const SpecificUser = message.mentions.users.first();
        if (args[0].toLowerCase() === "all") {
            if (!message.channel.memberPermissions(message.guild.client.user).has('MANAGE_CHANNELS'))
                return message.author.send(`Hey! I don't have permission to **manage channels**!`)

            var TextChannel = message.channel;
            TextChannel.clone();
            TextChannel.delete();
            return message.author.send(`I've deleted the previous #${TextChannel.name}, and replaced it with a new one!`);
        }
        else if (args[0].toLowerCase() === "log" && message.author.id === '245572699894710272') {
            console.clear();
            return message.channel.send('I have cleared the log!');
        }
        else if (SpecificUser) {
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
                    return message.channel.send(`Removed ${args[0]} messages from ${SpecificUser.username}`)
                        .then((NewMessage) => {
                            NewMessage.delete(1500)
                        });
                });
            }
            catch (error){
                return message.channel.send(`I attempted to delete the messages, but couldn't finish! \n${error}`);
            }
        }

        message.delete().then(() => {
            message.channel.bulkDelete(args[0]);
            let DeleteReply = (args[0] !== '1') ?
                `I've deleted ${args[0]} messages for you!` :
                `I've deleted ${args[0]} message for you!`;

            message.reply(DeleteReply)
                .then((NewMessage) => {
                    NewMessage.delete(1500)
                });
        });
    },
};