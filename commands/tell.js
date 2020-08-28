//const { TellArray } = require('../index');

module.exports = {
    name: 'tell',
    cooldown: 5,
    description: 'Messages a user from Pingu :eyes:',
    usage: '<user | username | unset> <message>',
    id: 2,
    execute(message, args) {
        CheckResponse = ArgumentCheck(message, args);
        if (CheckResponse != `Arguments met`)
            return message.channel.send(CheckResponse);

        let UserMention = args.shift();
        while (UserMention.includes('_')) UserMention = UserMention.replace('_', ' ');

        const Mention = GetMention(message, UserMention);

        if (!Mention) return message.channel.send(`you dumbed up somewhere man gdi`);

        Mention.createDM().then(Channel => {
            const Message = args.join(' ');
            Channel.send(Message);

            //message.author.send(`Sent ${Mention.username || Mention.user.username}:\n "${Message}"`);
            message.react('✅');
            console.log(`${message.author.username} sent a message to ${Mention.user.username}, saying "${Message}"`);

            //TellArray.push({
            //    Giver: message.author,
            //    Reciever: Mention.user,
            //    Message: Message
            //});
        }).catch(error => {
            message.channel.send(`Attempted to message ${Mention.user.username} but couldn't due to ${error}`);
        });
    },
};

/// <summary> Checks if arguments are correct </summary>
function ArgumentCheck(message, args) {
    if (!args[0] && !args[1])
        return `Not enough arguments provided`;

    let Mention = args[0];
    while (Mention.includes('_')) Mention = Mention.replace('_', ' ');

    if (message.mentions.users.first() == null) {
        for (var Guild of message.client.guilds.array()) 
            for (var Member of Guild.members.array()) 
                if (Member.user.username == Mention || Member.nickname == Mention)
                    return `Arguments met`;
        return `No mention provided`;
    }
    return `Arguments met`;
}

/// <summary> Returns Mention whether it's @Mentioned, username or nickname </summary>
function GetMention(message, UserMention) {
    if (message.mentions.users.first() == null) {
        for (var Guild of message.client.guilds.array())
            for (var Member of Guild.members.array())
                if (Member.user.username == UserMention || Member.nickname == UserMention)
                    return Member;
        return null;
    }
    return message.mentions.users.first();
}