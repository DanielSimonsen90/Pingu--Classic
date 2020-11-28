//const { TellArray } = require('../index');

const { Message } = require("discord.js");
const { PinguLibrary } = require("../../PinguPackage");

module.exports = {
    name: 'tell',
    cooldown: 5,
    description: 'Messages a user from Pingu :eyes:',
    usage: '<user | username | unset> <message>',
    id: 2,
    example: ["Danho Hello!", "Danho's_Super_Cool_Nickname_With_Spaces why is this so long??", "unset"],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        var CheckResponse = ArgumentCheck(message, args);
        if (CheckResponse != PinguLibrary.PermissionGranted)
            return message.channel.send(CheckResponse);

        let UserMention = args.shift();
        while (UserMention.includes('_')) UserMention = UserMention.replace('_', ' ');

        const Mention = GetMention(message, UserMention);

        if (!Mention) return PinguLibrary.errorLog(message.client, `Mention returned null`, message.content);

        Mention.createDM().then(async tellChannel => {
            const sendMessage = args.join(' ');
            var sentMessage = await tellChannel.send(sendMessage, message.attachments.array());

            //message.author.send(`Sent ${Mention.username }:\n "${Message}"`);
            message.react('✅');
            PinguLibrary.tellLog(message.client, message.author, Mention, sentMessage);

            //TellArray.push({
            //    Giver: message.author,
            //    Reciever: Mention.user,
            //    Message: Message
            //});
        }).catch(async err => {
            if (err.message == 'Cannot send messages to this user')
                return message.channel.send(`Unable to send message to ${Mention.username}, as they have \`Allow direct messages from server members\` disabled!`);

            await PinguLibrary.errorLog(message.client, `${message.author} attempted to *tell ${Mention}`, message.content, err)
            message.channel.send(`Attempted to message ${Mention.username} but couldn't.. I've contacted my developers.`);
        })
    },
};

/**Checks if arguments are correct
 * @param {Message} message @param {string[]} args*/
function ArgumentCheck(message, args) {
    if (!args[0] || !args[1])
        return `Not enough arguments provided`;

    let Mention = args[0];
    while (Mention.includes('_')) Mention = Mention.replace('_', ' ');

    if (message.mentions.users.first() == null) {
        for (var Guild of message.client.guilds.cache.array())
            for (var Member of Guild.members.cache.array()) 
                if ([Member.user.username, Member.nickname, Member.id].includes(Mention))
                    return PinguLibrary.PermissionGranted;
        return `No mention provided`;
    }
    return PinguLibrary.PermissionGranted;
}
/**Returns Mention whether it's @Mentioned, username or nickname
 * @param {Message} message @param {string} UserMention*/
function GetMention(message, UserMention) {
    if (message.mentions.users.first() == null) {
        for (var Guild of message.client.guilds.cache.array())
            for (var Member of Guild.members.cache.array())
                if ([Member.user.username.toLowerCase(), Member.nickname.toLowerCase(), Member.id].includes(UserMention.toLowerCase()))
                    return Member.user;
        return null;
    }
    return message.mentions.users.first();
}