//const { TellArray } = require('../index');

const { Message } = require("discord.js");

module.exports = {
    name: 'tell',
    cooldown: 5,
    description: 'Messages a user from Pingu :eyes:',
    usage: '<user | username | unset> <message>',
    id: 2,
    example: ["Danho Hello!", "Danho's_Super_Cool_Nickname_With_Spaces why is this so long??", "unset"],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        CheckResponse = ArgumentCheck(message, args);
        if (CheckResponse != `Permission Granted`)
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
        }).catch(error => message.channel.send(`Attempted to message ${Mention.user.username} but couldn't due to ${error}`));
    },
};

/**Checks if arguments are correct
 * @param {Message} message @param {string[]} args*/
function ArgumentCheck(message, args) {
    if (!args[0] && !args[1])
        return `Not enough arguments provided`;

    let Mention = args[0];
    while (Mention.includes('_')) Mention = Mention.replace('_', ' ');

    if (message.mentions.users.first() == null) {
        for (var Guild of message.client.guilds.cache.array())
            for (var Member of Guild.members.cache.array()) 
                if (Member.user.username == Mention || Member.nickname == Mention)
                    return `Permission Granted`;
        return `No mention provided`;
    }
    return `Permission Granted`;
}
/**Returns Mention whether it's @Mentioned, username or nickname
 * @param {Message} message @param {string} UserMention*/
function GetMention(message, UserMention) {
    if (message.mentions.users.first() == null) {
        for (var Guild of message.client.guilds.cache.array())
            for (var Member of Guild.members.cache.array())
                if (Member.user.username == UserMention || Member.nickname == UserMention)
                    return Member;
        return null;
    }
    return message.mentions.users.first();
}