const { Message, MessageEmbed, GuildChannel } = require('discord.js');
const { PinguLibrary, DiscordPermissions, Error } = require('../../PinguPackage');

module.exports = {
    name: 'embed',
    description: 'Creates an embed',
    usage: '<sub-command> <channel | message ID> <...value(s)>',
    guildOnly: true,
    id: 1,
    examples: ["create", "795961520722935808 title My Embed Title", `795961520722935808 field "Does Danho smell?", "Yes, yes he does", "true"`],
    permissions: [DiscordPermissions.EMBED_LINKS],
    /**@param {{message: Message, args: string[]}}*/
    async execute({ message, args }) {
        let messageID = args.shift();
        let command = args.shift();
        let permCheck = await PermissionsCheck(message, args, command);
        if (permCheck != PinguLibrary.PermissionGranted) return message.channel.send(permCheck);

        if (messageID == 'create') return EmbedCreate();

        let { embed, embedMessage, returnMessage } = await getEmbed();
        if (!embed) return message.channel.send(returnMessage);

        switch (command) {
            case 'delete': return EmbedDelete();
            case 'title': embed.setTitle(args.join(' ')); break;
            case 'description': embed.setDescription(args.join(' ')); break;
            case 'footer': embed.setFooter(args.join(' ')); break;
            case 'field': embed = addField(args.join(' ')); break;
            case 'color': embed.setColor(args[0]); break;
            case 'thumbnail': embed = setMedia('thumbnail'); break;
            case 'image': embed = setMedia('image'); break;
            case 'file': embed = setMedia('file'); break;
            case 'url': embed = getURL(); break;
            default: return message.channel.send(`**${command}** is not a valid embed command!`);
        }

        embed.setTimestamp(Date.now());

        await embedMessage.edit(embed);
        LogChanges('edited', `Added ${command}`);
        message.react('✅');

        //#region Baisc functions
        async function PermissionsCheck() {
            if (messageID == 'create') {
                let channel = getChannel(message, args);
                let permCheck = PinguLibrary.PermissionCheck({
                    author: message.author,
                    channel: channel,
                    client: message.client,
                    content: message.content
                }, [DiscordPermissions.SEND_MESSAGES, DiscordPermissions.EMBED_LINKS]);
                return permCheck;
            }
            let getEmbedResult = await getEmbed();
            if (!getEmbedResult.embed) return getEmbedResult.returnMessage;

            if (!getEmbedResult.embed.author.name == message.author.tag)
                return `You're not the author of that embed! Please contact **${getEmbedResult.embed.author.name}**.`;

            return PinguLibrary.PermissionGranted;
        }
        /**@returns {GuildChannel}*/
        function getChannel() {
            let search = args.shift();
            if (!search) return message.channel;

            if (message.mentions.channels.first())
                return message.mentions.channels.first();

            let channels = message.guild.channels.cache.array();
            let channel = channels.find(channel => (channel.id == search || channel.name.includes(search)) && channel.isText());

            return channel ? channel : message.channel;
        }
        /**@returns {{embed: MessageEmbed, returnMessage: string, embedMessage : Message}}*/
        async function getEmbed() {
            let result = {
                embed: null,
                embedMessage: null,
                returnMessage: "unset",
                /**@param {string} message*/
                setReturnMessage(message) {
                    this.returnMessage = message;
                    return this;
                },
                /**@param {Message} message*/
                setMessage(message) {
                    this.embedMessage = message;
                    return this;
                },
                /**@param {MessageEmbed} value*/
                setValue(value) {
                    this.embed = value;
                    return this;
                }
            };

            for (var channel of message.guild.channels.cache.array()) {
                if (!channel.isText()) continue;

                let HistoryPermission = PinguLibrary.PermissionCheck({
                    author: message.author,
                    channel: channel,
                    client: message.client,
                    content: message.content
                }, [DiscordPermissions.READ_MESSAGE_HISTORY]);
                if (HistoryPermission != PinguLibrary.PermissionGranted) return message.channel.send(HistoryPermission);

                try { var fetchedMessage = await channel.messages.fetch(messageID); }
                catch (err) {
                    continue;
                    PinguLibrary.errorLog(message.client, `Unable to fetch message from ${messageID}`, message.content, new Error(err));
                    return result.setReturnMessage(`Unable to fetch message from ${messageID}`);
                }

                if (!fetchedMessage.embeds[0]) return result.setReturnMessage(`There are no embds in that message!\n(${fetchedMessage.url})`);

                return result
                    .setReturnMessage(PinguLibrary.PermissionGranted)
                    .setValue(fetchedMessage.embeds[0])
                    .setMessage(fetchedMessage);
            }
            return result.setReturnMessage(`Unable to find channel with message that matched message id **${messageID}**!`);
        }
        /**@param {'created' | 'edited' | 'deleted'} type
         * @param {string} logMessage
         * @returns {`[12.34.56] Author typed their embed: logMessage`}*/
        function LogChanges(type, logMessage) {
            PinguLibrary.ConsoleLog(`${message.author.tag} ${type} their embed${(logMessage ? `: ${logMessage}` : "")}`);
        }
        //#endregion

        //#region Embed editing
        async function EmbedCreate() {
            args.unshift(command);
            let channel = getChannel(message, args);
            let embed = new MessageEmbed()
                .setTitle(`${message.member.displayName}'s embed`)
                .setColor(message.member.displayColor)
                .setAuthor(message.author.tag, message.author.avatarURL());

            let embedMessage = await channel.send(embed);

            if (channel.id != message.channel.id) message.channel.send(`Embed created! Your message ID is **${embedMessage.id}**`)
            LogChanges('created', embedMessage.id)
        }
        async function EmbedDelete() {
            await embedMessage.delete({ reason: `Messaged contained embed, which was removed by ${message.member.displayName} (${message.author.tag})` });
            message.channel.send(`Deleted!`);
            LogChanges('deleted', `from #${embedMessage.channel.name}`);
        }
        /**@param {string} args*/
        function addField(args) {
            let splitArgs = args.includes('","') ? args.split('","') : args.split('", "');
            let title = splitArgs[0].substring(1, splitArgs[0].length);
            if (splitArgs.length == 2) {
                var value = splitArgs[splitArgs.length - 1].substring(0, splitArgs[splitArgs.length - 1].length - 1);
                var inline = false;
            }
            else {
                value = splitArgs[1];
                inline = splitArgs[splitArgs.length - 1].substring(0, splitArgs[splitArgs.length - 1].length - 1).toLowerCase() == 'true';
            }

            let values = [title, value, inline];
            let valueNames = ["title", "value", "inline"];
            for (var i = 0; i < values.length; i++) {
                let valueItem = values[i], valueName = valueNames[i];
                if (!valueItem) {
                    message.channel.send(`${valueName} must not be empty!`);
                    return embed;
                }
            }

            return embed.addField(title, value, inline);
        }
        /**@param {'image' | 'thumbnail' | 'file'} type*/
        function setMedia(type) {
            let file = message.attachments.first();

            if (!args[0] && !file) {
                message.channel.send('Nothing provided!')
                return embed;
            }
            if (args[0] && args[0].includes('.'))
                try { return addToEmbed(args[0]); }
                catch { message.channel.send(`That is an invalid media!`); return embed; }

            return addToEmbed(file.url);

            function addToEmbed(item) {
                switch (type) {
                    case 'image': return embed.setImage(item);
                    case 'thumbnail': return embed.setThumbnail(item);
                    case 'file': return embed.attachFiles(item);
                    default: return embed;
                }
            }
        }
        function getURL() {
            let url = args.shift();
            if (!url.startsWith('http')) {
                message.channel.send(`**${url}** is not a valid URL!`);
                return embed;
            }
            return embed.setURL(url);
        }
        //#endregion
    }
}