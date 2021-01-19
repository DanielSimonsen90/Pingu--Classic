﻿const { Message, User, MessageEmbed } = require("discord.js");
const { PinguLibrary, PinguUser, PUser, PinguGuild } = require("../../PinguPackage");

module.exports = {
    name: 'tell',
    cooldown: 5,
    description: 'Messages a user from Pingu :eyes:',
    usage: '<user | username | unset> <message>',
    id: 2,
    example: ["Danho Hello!", "Danho's_Super_Cool_Nickname_With_Spaces why is this so long??", "unset"],
    /**@param {{message: Message, args: string[]}}*/
    async execute({ message, args }) {
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
    /**@param {Message} message*/
    async ExecuteTellReply(message) {
        //Pingu sent message in PM
        if (message.author.id == message.client.user.id) return;

        //Get author's replyPerson
        let replyPersonPUser = PinguUser.GetPUser(message.author).replyPerson;
        if (!replyPersonPUser) return PinguLibrary.consoleLog(message.client, `No replyPerson found for ${message.author.username}.`);

        //Find replyPerson as Discord User
        let replyPerson = getReplyUser(message);

        //Find replyPerson as PinguUser
        let replyPersonPinguUser = PinguUser.GetPUser(replyPerson);

        //If replyPerson's replyPerson isn't author anymore, re-bind them again (replyPerson is talking to multiple people through Pingu)
        if (replyPersonPinguUser.replyPerson.id != message.author.id) {
            replyPersonPinguUser.replyPerson = new PUser(message.author);
            PinguUser.UpdatePUsersJSONAsync(message.client, replyPerson, "index: Message.ExecuteTellReply",
                `Successfully re-binded **${replyPerson.tag}**'s replyPerson to **${message.author.tag}**`,
                `Failed re-binding **${replyPerson.tag}**'s replyPerson to **${message.author.tag}**!`
            );
        }

        //Log conversation
        try { PinguLibrary.tellLog(message.client, message.author, replyPerson, message); }
        catch (err) { PinguLibrary.errorLog(message.client, 'Tell reply failed', message.content, err); }

        //Error happened while sending reply
        var cantMessage = async err => {
            if (err.message == 'Cannot send messages to this user')
                return message.channel.send(`Unable to send message to ${Mention.username}, as they have \`Allow direct messages from server members\` disabled!`);

            await PinguLibrary.errorLog(message.client, `${message.author} attempted to *tell ${Mention}`, message.content, err)
            return message.channel.send(`Attempted to message ${Mention.username} but couldn't.. I've contacted my developers.`);
        }
        //Create DM to replyPerson
        let replyPersonDM = await replyPerson.createDM();
        if (!replyPersonDM) return cantMessage({ message: "Unable to create DM from ln: 366" });

        //Add "Conversation with" header to message's content
        message.content = `**Conversation with __${message.author.username}__**\n` + message.content;

        //Send author's reply to replyPerson
        if (message.content && message.attachments.size > 0) replyPersonDM.send(message.content, message.attachments.array()).catch(async err => cantMessage(err)); //Message and files
        else if (message.content) replyPersonDM.send(message.content).catch(async err => cantMessage(err)); //Message only
        else PinguLibrary.errorLog(client, `${message.author} ➡️ ${replyPerson} used else statement from ExecuteTellReply, Index`, message.content);

        //Show author that reply has been sent
        message.react('✅');
        message.channel.send(`**Sent message to __${replyPerson.tag}__**`);
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
    },
    /**@param {Message} message
     * @param {string[]} args*/
    HandleTell(message, args) {
        if (args[0] == 'unset') {
            let replyUser = getReplyUser(message);

            PinguLibrary.tellLog(client, message.author, replyUser, new MessageEmbed()
                .setTitle(`Link between **${message.author.username}** & **${replyUser.username}** was unset.`)
                .setColor(PinguGuild.GetPGuild(PinguLibrary.SavedServers.PinguSupport(client)).embedColor)
                .setDescription(`**${message.author}** unset the link.`)
                .setThumbnail(message.author.avatarURL())
                .setFooter(new Date(Date.now()).toLocaleTimeString())
            );

            message.author.send(`Your link to **${replyUser.username}** was unset.`);
            return;
        }
        else if (args[0] == "info") return;
        let Mention = args[0];
        while (Mention.includes('_')) Mention = Mention.replace('_', ' ');

        let pAuthor = PinguUser.GetPUser(message.author);
        pAuthor.replyPerson = new PUser(module.exports.GetMention(message, Mention));
    },
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
/**@param {Message} message*/
function getReplyUser(message) {
    let { replyPerson } = PinguUser.GetPUser(message.author);
    return getGuildUsers().find(user => user.id == replyPerson.id);

    /**@returns {User[]} */
    function getGuildUsers() {
        let guildUsersArr = message.client.guilds.cache.map(guild => guild.members.cache.map(gm => !gm.user.bot && gm.user));
        let guildUsersSorted = [];

        guildUsersArr.forEach(guildUsers => guildUsers.forEach(user => {
            if (!guildUsersSorted.includes(user))
                guildUsersSorted.push(user);
        }));
        return guildUsersSorted;
    }
}