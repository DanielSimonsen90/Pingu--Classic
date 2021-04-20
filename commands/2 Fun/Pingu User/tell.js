const { Message, User, MessageEmbed } = require("discord.js");
const { PinguCommand, PinguLibrary, PinguUser, PUser, PinguGuild, PinguClient } = require("PinguPackage");
const { pushd } = require("shelljs");

module.exports = {
    ...new PinguCommand('tell', 'Fun', 'Messages a user from Pingu 👀', {
        usage: '<user | username | unset> <message>',
        example: ["Danho Hello!", "Danho's_Super_Cool_Nickname_With_Spaces why is this so long??", "unset"]
    }, async ({ client, message, args, pAuthor, pGuildClient }) => {
        var permCheck = ArgumentCheck(message, args);
        if (permCheck != PinguLibrary.PermissionGranted)
            return message.channel.send(permCheck);

        let UserMention = args.shift();
        while (UserMention.includes('_')) UserMention = UserMention.replace('_', ' ');

        const Mention = UserMention == 'info' ? 'info' : module.exports.GetMention(message, UserMention);
        if (!Mention) return PinguLibrary.errorLog(client, `Mention returned null`, message.content, null, {
            params: { message, args, pAuthor, pGuildClient },
            additional: { UserMention, Mention },
        });

        if (Mention == 'info') {
            let AuthorAsReplyPerson = (await PinguUser.GetUsers()).filter(pUser => pUser.replyPerson && pUser.replyPerson._id == message.author.id && pUser);

            let tellInfoEmbed = new MessageEmbed()
                .setTitle('Tell Info')
                .setThumbnail(pAuthor.avatar)
                .setColor(message.guild ? pGuildClient.embedColor : client.DefaultEmbedColor)
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
        if (Mention.id == message.author.id) return message.channel.send(`I have a feeling that not even *you* would want to talk to yourself...`);

        pAuthor.replyPerson = new PUser(Mention);

        /** @param {User} self @param {PinguUser} partner*/
        let log = (self, partner) => `**${self.tag}**'s replyPerson is now **${partner.replyPerson.name}**.`;

        let pMention = await PinguUser.Get(Mention);
        pMention.replyPerson = new PUser(message.author);

        await Promise.all([
            { user: message.author, replyPerson: pMention },
            { user: Mention, replyPerson: pAuthor }
        ].map(({ user, replyPerson }) => PinguUser.Update(client, ['replyPerson'], pAuthor, module.exports.name, log(user, replyPerson))))

        Mention.createDM().then(async tellChannel => {
            const sendMessage = args.join(' ');
            var sentMessage = await tellChannel.send(sendMessage, message.attachments.array());

            message.react('✅');
            PinguLibrary.tellLog(client, message.author, Mention, sentMessage);
            return message.channel.send(`**Established conversation with __${Mention.tag}__**`);

        }).catch(async err => {
            if (err.message == 'Cannot send messages to this user')
                return message.channel.send(`Unable to send message to ${Mention.username}, as they have \`Allow direct messages from server members\` disabled!`);

            await PinguLibrary.errorLog(client, `${message.author} attempted to ${client.DefaultPrefix}tell ${Mention}`, message.content, err, {
                params: { message, args, pAuthor, pGuildClient },
                additional: { Mention, pMention },
            })
            return message.channel.send(`Attempted to message ${Mention.username} but couldn't.. I've contacted my developers.`);
        })
    }), ...{
        /**@param {Message} message*/
        async ExecuteTellReply(message) {
            //Pingu sent message in PM
            if (message.author.bot) return;

            let pAuthor = await PinguUser.Get(message.author);

            //Get author's replyPerson
            let authorReplyPerson = pAuthor.replyPerson;
            if (!authorReplyPerson) return PinguLibrary.consoleLog(message.client, `No replyPerson found for ${message.author.username}.`);

            //Find replyPerson as Discord User
            let replyPersonUser = await message.client.users.fetch(authorReplyPerson._id)

            //Find replyPerson as PinguUser
            let replyPersonPinguUser = await PinguUser.Get(replyPersonUser);

            //If replyPerson's replyPerson isn't author anymore, re-bind them again (replyPerson is talking to multiple people through Pingu)
            if (replyPersonPinguUser.replyPerson._id != message.author.id) {
                replyPersonPinguUser.replyPerson = new PUser(message.author);

                PinguUser.Update(message.client, ['replyPerson'], replyPersonPinguUser, "tell: ExecuteTellReply", `Re-binded **${replyPersonUser.tag}**'s replyPerson to **${message.author.tag}**`);
            }

            //Log conversation
            PinguLibrary.tellLog(message.client, message.author, replyPersonUser, message).catch(err => {
                PinguLibrary.errorLog(message.client, 'Tell reply failed', message.content, err, {
                    params: { message },
                    additional: {
                        author: { user: message.author, pUser: pAuthor },
                        replyPerson: { user: replyPersonUser, pUser: replyPersonPinguUser }
                    },
                });
            });

            //Error happened while sending reply
            /**@param {{message: string}} err*/
            var cantMessage = async err => {
                if (err.message == 'Cannot send messages to this user')
                    return message.channel.send(`Unable to send message to ${Mention.username}, as they have \`Allow direct messages from server members\` disabled!`);

                await PinguLibrary.errorLog(message.client, `${message.author} attempted to ${client.DefaultPrefix}tell ${Mention}`, message.content, err, {
                    params: { message },
                    additional: {
                        author: { user: message.author, pUser: pAuthor },
                        replyPerson: { user: replyPersonUser, pUser: replyPersonPinguUser }
                    },
                })
                return message.channel.send(`Attempted to message ${Mention.username} but couldn't.. I've contacted my developers.`);
            }
            //Create DM to replyPerson
            let replyPersonDM = await replyPersonUser.createDM();
            if (!replyPersonDM) return cantMessage({ message: "Unable to create DM from ln: 366" });

            //Add "Conversation with" header to message's content
            message.content = `**Conversation with __${message.author.username}__**\n` + message.content;

            //Send author's reply to replyPerson
            if (message.content && message.attachments.size > 0) replyPersonDM.send(message.content, message.attachments.array()).catch(async err => cantMessage(err)); //Message and files
            else if (message.content) replyPersonDM.send(message.content).catch(async err => cantMessage(err)); //Message only
            else PinguLibrary.errorLog(client, `${message.author} ➡️ ${replyPersonUser} used else statement from ExecuteTellReply, Index`, message.content, {
                params: { message },
                additional: {
                    author: { user: message.author, pUser: pAuthor },
                    replyPerson: { user: replyPersonUser, pUser: replyPersonPinguUser }
                },
            });

            //Show author that reply has been sent
            message.react('✅');
            return message.channel.send(`**Sent message to __${replyPersonUser.tag}__**`);
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
        async HandleTell(message, args) {
            const { author, client } = message;
            const pAuthor = PinguUser.Get(author);

            if (args[0] == 'unset') {
                let [replyPUser, replyUser] = await Promise.all([
                    PinguUser.Get(pAuthor.replyPerson._id),
                    client.users.fetch(pAuthor.replyPerson._id)
                ]);

                pAuthor.replyPerson = replyPUser.replyPerson = null;

                let pGuild = await PinguGuild.Get(PinguLibrary.SavedServers.PinguSupport(client));
                let pGuildClient = PinguClient.ToPinguClient(client).toPClient(pGuild);

                PinguLibrary.tellLog(message.client, message.author, replyUser, new MessageEmbed()
                    .setTitle(`Link between **${message.author.username}** & **${replyUser.tag}** was unset.`)
                    .setColor(pGuildClient.embedColor)
                    .setDescription(`**${message.author}** unset the link.`)
                    .setThumbnail(message.author.avatarURL())
                    .setTimestamp(Date.now())
                );

                await Promise.all([
                    PinguUser.Update(client, ['replyPerson'], pAuthor, module.exports.name, `${pUser.tag} unset the link to ${replyPUser.tag}`),
                    PinguUser.Update(client, ['replyPerson'], replyPUser, module.exports.name, `${replyPUser.tag} unset the link to ${pUser.tag}`)
                ]);

                author.send(`Your link to **${replyUser.username}** was unset.`);
                return;
            }
            else if (args[0] == "info") return;
            let Mention = args[0];
            while (Mention.includes('_')) Mention = Mention.replace('_', ' ');

            pAuthor.replyPerson = new PUser(module.exports.GetMention(message, Mention));
        },
    }
};

/**Checks if arguments are correct
 * @param {Message} message 
 * @param {string[]} args*/
function ArgumentCheck(message, args) {
    if ((!args[0] || !args[1] && ["info", "unset"].includes(args[0].toLowerCase())) && !message.attachments.first())
        return `Not enough arguments provided`;

    let Mention = args[0];
    while (Mention.includes('_')) Mention = Mention.replace('_', ' ');

    return module.exports.GetMention(message, Mention) || args[0] == "info" ? PinguLibrary.PermissionGranted : `No mention provided`;
}