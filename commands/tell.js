module.exports = {
    name: 'tell',
    cooldown: 5,
    description: 'Messages a user from Pingu :eyes:',
    usage: '<user | username> <message>',
    execute(message, args) {
        CheckResponse = ArgumentCheck(message, args);
        if (CheckResponse != `Arguments met`)
            return message.channel.send(CheckResponse);

        let Mention;
        const UserProvided = args.shift();

        message.client.guilds.forEach(Guild => {
            Mention = Guild.members.find(Member => Member.user.username == UserProvided ||
                                                   Member.nickname == UserProvided).user;
        });

        if (!Mention) return message.channel.send(`you dumbed up somewhere man gdi`);

        Mention.createDM().then(Channel => {
            const Message = args.join(' ');
            Channel.send(Message);

            message.author.send(`Sent ${Mention.username}:\n "${Message}"`);
            console.log(`${message.author.username} sent a message to ${Mention.username}, saying "${Message}"`);
        });
    },
};

//<user> <message>

/// <summary> Checks if arguments are correct </summary>
function ArgumentCheck(message, args) {
    if (!args[0] && !args[1])
        return `Not enough arguments provided`;

    if (message.mentions.users.first() == null) {
        message.client.guilds.forEach(Guild => {
            if (Guild.members.find(Member => Member.user.username == args[0] || Member.nickname == args[0]).user == null)
                return `No mention provided`;
        })
    }

    return `Arguments met`;
}
