const { Message, User, MessageEmbed } = require("discord.js");
const { PinguCommand, PinguUser, PUser, PinguClient, Arguments } = require("PinguPackage");

module.exports = {
    ...new PinguCommand('tell', 'Fun', 'Messages a user from Pingu 👀', {
        usage: '<user | username | unset> <message>',
        example: ["Danho Hello!", "Danho's_Super_Cool_Nickname_With_Spaces why is this so long??", "unset"]
    }, async ({ client, message, args, pAuthor, pGuildClient }) => {
        var permCheck = ArgumentCheck();
        if (permCheck != client.permissions.PermissionGranted) return message.channel.send(permCheck);

        let userMention = args.shift().replace(/_+/, ' ')

        const mention = userMention == 'info' ? 'info' : module.exports.GetMention(message, userMention);
        if (!mention) return client.log('error', `Mention returned null`, message.content, null, {
            params: { message, args, pAuthor, pGuildClient },
            additional: { userMention, mention },
        });

        if (mention == 'info') {
            const authorAsReplyPerson = client.pUsers.array().filter(pUser => pUser.replyPerson?._id == message.author.id);

            let tellInfoEmbed = new MessageEmbed({
                title: 'Tell Info',
                description: `Your replyPerson: **${pAuthor.replyPerson.name}**`,
                thumbnail: { url: pAuthor.avatar },
                color: pGuildClient.embedColor || client.DefaultEmbedColor,
            })
            authorAsReplyPerson.forEach(pUser =>
                tellInfoEmbed.addField(
                    pUser.tag,
                    pUser.sharedServers.filter(guild => pAuthor.sharedServers.map(pAuthorGuilds => pAuthorGuilds.name).includes(guild.name)).map(guild => guild.name),
                    true
                )
            );

            let dmChannel = await message.author.createDM();
            return dmChannel.sendEmbeds(tellInfoEmbed);
        }
        if (mention.id == message.author.id) return message.channel.send(`I have a feeling that not even *you* would want to talk to yourself...`);

        pAuthor.replyPerson = new PUser(mention);

        /**@param {User} self @param {PinguUser} partner*/
        const log = (self, partner) => `**${self.tag}**'s replyPerson is now **${partner.tag}**.`;

        const pMention = client.pUsers.get(mention);
        pMention.replyPerson = new PUser(message.author);

        await Promise.all([
            { user: message.author, replyPerson: pMention },
            { user: mention, replyPerson: pAuthor }
        ].map(({ user, replyPerson }) => client.pUsers.update(pAuthor, module.exports.name, log(user, replyPerson))));

        try {
            const tellChannel = await mention.createDM();
            const sendMessage = args.join(' ');
            const send = await tellChannel.send({ content: sendMessage, files: message.attachments.array() });
            message.react('✅');

            client.log('tell', message.author, mention, sentMessage);
            return message.channel.send(`**Established conversation with __${mention.tag}__**`);
        } catch (err) {
            if (err.message == 'Cannot send messages to this user')
                return message.channel.send(`Unable to send message to ${mention.username}, as they have \`Allow direct messages from server members\` disabled!`);

            await client.log('error', `${message.author} attempted to ${client.DefaultPrefix}tell ${mention}`, message.content, err, {
                params: { message, args, pAuthor, pGuildClient },
                additional: { mention, pMention },
            })
            return message.channel.send(`Attempted to message ${mention.username} but couldn't.. I've contacted my developers.`);
        }

        function ArgumentCheck() {
            if ((!args[0] || !args[1] && ["info", "unset"].includes(args[0].toLowerCase())) && !message.attachments.first())
                return `Not enough arguments provided`;
        
            let mention = args[0].replace(/_+/, ' ')
            return module.exports.GetMention(message, mention) || args[0] == "info" ? client.permissions.PermissionGranted : `No mention provided`;
        }
    }), ...{
        /**@param {Message} message*/
        async ExecuteTellReply(message) {
            const { client, author, content } = message;

            //Pingu sent message in PM
            if (author.bot) return;

            const pAuthor = client.pUsers.get(author);

            //Get author's replyPerson
            const authorReplyPerson = pAuthor.replyPerson;
            if (!authorReplyPerson) return client.log('console', `No replyPerson found for ${author.username}.`);

            //Find replyPerson as Discord User
            const replyPersonUser = await client.users.fetch(authorReplyPerson._id);

            //Find replyPerson as PinguUser
            const replyPersonPinguUser = client.pUsers.get(replyPersonUser);

            //If replyPerson's replyPerson isn't author anymore, re-bind them again (replyPerson is talking to multiple people through Pingu)
            if (replyPersonPinguUser.replyPerson._id != author.id) {
                replyPersonPinguUser.replyPerson = new PUser(author);

                client.pUsers.update(replyPersonPinguUser, 'tell: ExecuteTellReply()', `Re-binded **${replyPersonUser.tag}**'s replyPerson to **${author.tag}**`)
            }

            //Log conversation
            try {
                await client.log('tell', author, replyPersonUser, message);
            } catch (err) {
                client.log('error', 'Tell reply failed', content, err, {
                    params: { message },
                    additional: {
                        author: { user: author, pUser: pAuthor },
                        replyPerson: { user: replyPersonUser, pUser: replyPersonPinguUser }
                    }
                })
            }

            //Error happened while sending reply
            /**@param {{message: string}} err*/
            var cantMessage = async err => {
                if (err.message == 'Cannot send messages to this user')
                    return message.channel.send(`Unable to send message to ${replyPersonUser.username}, as they have \`Allow direct messages from server members\` disabled!`);

                await client.log('error', `${author} attempted to ${client.DefaultPrefix}tell ${replyPersonUser}`, content, err, {
                    params: { message },
                    author: { user: author, pUser: pAuthor },
                    replyPerson: { user: replyPersonUser, pUser: replyPersonPinguUser }
                })
                return message.channel.send(`Attempted to message ${replyPersonUser.username} but couldn't.. I've contacted my developers.`);
            }
            //Create DM to replyPerson
            let replyPersonDM = await replyPersonUser.createDM();
            if (!replyPersonDM) return cantMessage({ message: "Unable to create DM from ln: 136" });

            //Add "Conversation with" header to message's content
            //message.content = `**Conversation with __${message.author.username}__**\n` + message.content;

            //Send author's reply to replyPerson
            if (content && message.attachments.size > 0) var sent = replyPersonDM.send({ content, files: message.attachments.array() }).catch(async err => cantMessage(err)); //Message and files
            else if (content) sent = replyPersonDM.send(content).catch(async err => cantMessage(err)); //Message only
            else sent = client.log('error', `${author} ➡️ ${replyPersonUser} used else statement from ExecuteTellReply`, content, {
                params: { message },
                additional: {
                    author: { user: author, pUser: pAuthor },
                    replyPerson: { user: replyPersonUser, pUser: replyPersonPinguUser }
                },
            });

            //Show author that reply has been sent
            message.react('✅');
            return sent;
        },
        /**Returns Mention whether it's @Mentioned, username or nickname
        * @param {Message} message 
        * @param {string} username
        * @returns {User}*/
        GetMention(message, username) {
            const userMention = message.mentions.users.first();
            if (userMention) return userMention;

            const args = new Arguments(username);
            const snowflakeMention = args.mentions.get('SNOWFLAKE');
            if (snowflakeMention.value) {
                const snowflake = args.splice(snowflakeMention.index, 1)[0];
                return message.client.users.cache.get(snowflake);
            }

            const displayNames = message.client.guilds.cache.map(g => 
                g.members.cache.reduce((result, gm) => result.set(gm.displayName, gm.user), new Map())
            ).reduce((result, map) => {
                map.forEach((k, v) => result.set(k, v));
                return result;
            }, new Map());
            message.client.users.cache.forEach(u => displayNames.set(u.username, u));

            return displayNames.get(username);
        },
        /**@param {Message} message
         * @param {Arguments} args*/
        async HandleTell(message, args) {
            const { author, client } = message;
            const pAuthor = client.pUsers.get(author);

            if (args[0] == 'unset') {
                if (!pAuthor.replyPerson) return message.channel.send(`You don't have a replyPerson!`);

                const replyPUser = client.pUsers.get(pAuthor.replyPerson._id);
                const replyUser = client.users.fetch(pAuthor.replyPerson._id);

                pAuthor.replyPerson = replyPUser.replyPerson = null;

                client.log('tell', message.author, replyUser, new MessageEmbed({
                    title: `Link between **${message.author.username}** & **${replyUser.tag}** was unset.`,
                    description: `**${message.author}** unset the link.`,
                    color: client.toPClient(client.pGuilds.get(client.savedServers.get('Pingu Support'))).embedColor,
                    thumbnail: { url: message.author.avatarURL() },
                    timestamp: Date.now()
                }));

                await Promise.all([
                    client.pUsers.update(pAuthor, module.exports.name, `${pUser.tag} unset the link to ${replyPUser.tag}`),
                    client.pUsers.update(replyPUser, module.exports.name, `${replyPUser.tag} unset the link to ${pUser.tag}`),
                ]);

                author.send(`Your link to **${replyUser.username}** was unset.`);
                return;
            }
            else if (args[0] == "info") return;
            let mention = args[0].replace(/_+/, ' ')
            pAuthor.replyPerson = new PUser(module.exports.GetMention(message, mention));
        },
    }
};