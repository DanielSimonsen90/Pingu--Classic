const { Message, User, MessageEmbed } = require("discord.js");
const { PinguLibrary, PinguUser, PUser, PinguGuild } = require("../../PinguPackage");

module.exports = {
    name: 'tell',
    cooldown: 5,
    description: 'Messages a user from Pingu :eyes:',
    usage: '<user | username | unset> <message>',
    id: 2,
    example: ["Danho Hello!", "Danho's_Super_Cool_Nickname_With_Spaces why is this so long??", "unset"],
    /**@param {Message} message @param {string[]} args*/
    async execute(message, args) {
        var permCheck = ArgumentCheck(message, args);
        if (permCheck != PinguLibrary.PermissionGranted)
            return message.channel.send(permCheck);

        let UserMention = args.shift();
        while (UserMention.includes('_')) UserMention = UserMention.replace('_', ' ');

        const Mention = UserMention == 'info' ? 'info' : module.exports.GetMention(message, UserMention);
        if (!Mention) return PinguLibrary.errorLog(message.client, `Mention returned null`, message.content);

        let pAuthor = PinguUser.GetPUser(message.author);
        if (Mention == 'info') {
            let AuthorAsReplyPerson = PinguUser.GetPUsers().filter(pUser => pUser.replyPerson && pUser.replyPerson.id == message.author.id && pUser);

            let tellInfoEmbed = new MessageEmbed()
                .setTitle('Tell Info')
                .setThumbnail(pAuthor.avatar)
                .setColor(message.guild ? PinguGuild.GetPGuild(message.guild).embedColor : PinguLibrary.DefaultEmbedColor)
                .setDescription(`Your replyPerson: **${pAuthor.replyPerson.name}**`);

            AuthorAsReplyPerson.forEach(pUser =>
                tellInfoEmbed.addField(
                    pUser.tag,
                    pUser.sharedServers.filter(guild =>
                        pAuthor.sharedServers.map(pAuthorGuilds =>
                            pAuthorGuilds.name).includes(guild.name)
                    ).map(guild => guild.name),
                    true)
            );

            let dmChannel = await message.author.createDM();
            return dmChannel.send(tellInfoEmbed);
        }
        if(Mention.id == message.author.id) return message.channel.send(``)

        pAuthor.replyPerson = new PUser(Mention);

        let messages = {
            /** @param {User} self @param {PinguUser} partner*/
            success: (self, partner) => `Successfully updated **${PinguUser.PUserFileName(self)}.json**'s replyPerson to **${partner.replyPerson.name}**.`,
            /** @param {User} self @param {PinguUser} partner*/
            error: (self, partner) => `Failed updating **${PinguUser.PUserFileName(self)}**.json's replyPerson to **${partner.replyPerson.name}**!`
        };

        PinguUser.UpdatePUsersJSONAsync(message.client, message.author, 'tell',
            messages.success(message.author, pAuthor),
            messages.error(message.author, pAuthor)
        );

        let pMention = PinguUser.GetPUser(Mention);
        pMention.replyPerson = new PUser(message.author);

        PinguUser.UpdatePUsersJSONAsync(message.client, Mention, "tell",
            messages.success(Mention, pMention),
            messages.error(Mention, pMention)
        );

        Mention.createDM().then(async tellChannel => {
            const sendMessage = args.join(' ');
            var sentMessage = await tellChannel.send(sendMessage, message.attachments.array());

            message.react('✅');
            PinguLibrary.tellLog(message.client, message.author, Mention, sentMessage);
            message.channel.send(`**Established conversation with __${Mention.tag}__**`);

        }).catch(async err => {
            if (err.message == 'Cannot send messages to this user')
                return message.channel.send(`Unable to send message to ${Mention.username}, as they have \`Allow direct messages from server members\` disabled!`);

            await PinguLibrary.errorLog(message.client, `${message.author} attempted to *tell ${Mention}`, message.content, err)
            message.channel.send(`Attempted to message ${Mention.username} but couldn't.. I've contacted my developers.`);
        })
    },
    /**Returns Mention whether it's @Mentioned, username or nickname
    * @param {Message} message 
    * @param {string} UserMention*/
    GetMention(message, UserMention) {
        if (!message.mentions.users.first()) {
            for (var Guild of message.client.guilds.cache.array())
                for (var Member of Guild.members.cache.array())
                    if ([Member.user.username.toLowerCase(), Member.nickname && Member.nickname.toLowerCase(), Member.id].includes(UserMention.toLowerCase()))
                        return Member.user;
            return null;
        }
        return message.mentions.users.first();
    }
};

/**Checks if arguments are correct
 * @param {Message} message @param {string[]} args*/
function ArgumentCheck(message, args) {
    if ((!args[0] || !args[1] && args[0] != "info") && !message.attachments.first())
        return `Not enough arguments provided`;

    let Mention = args[0];
    while (Mention.includes('_')) Mention = Mention.replace('_', ' ');

    return module.exports.GetMention(message, Mention) || args[0] == "info" ? PinguLibrary.PermissionGranted : `No mention provided`;
}