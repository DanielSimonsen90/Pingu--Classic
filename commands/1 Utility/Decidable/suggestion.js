const { Message, TextChannel, MessageEmbed, Client, GuildMember, Role, GuildChannel } = require('discord.js');
const { PinguLibrary, PinguGuild, PinguUser, DiscordPermissions, PClient, Suggestion, PGuildMember, PRole, EmbedField, SuggestionConfig, PChannel } = require('../../PinguPackage');
const ms = require('ms');

module.exports = {
    name: 'suggestion',
    description: 'Suggest something',
    usage: '<setup> | <list> | [#channel] <suggestion>',
    guildOnly: true,
    id: 1,
    examples: [""],
    permissions: [
        DiscordPermissions.SEND_MESSAGES,
        DiscordPermissions.ADD_REACTIONS,
        DiscordPermissions.MANAGE_MESSAGES
    ],
    aliases: ["suggest"],
    /**@param {{message: Message, args: string[], pAuthor: PinguUser, pGuild: PinguGuild, pGuildClient: PClient}}*/
    async execute({ message, args, pAuthor, pGuild, pGuildClient }) {
        if (!pGuild) {
            await PinguLibrary.errorLog(message.client, `I couldn't find pGuild for "${message.guild.name}" (${message.guild.id})`);
            return message.channel.send(`I had an error trying to get your Pingu Guild! I've contacted my developers...`);
        }

        //Permission check
        const permCheck = await PermissionCheck(message, args, pGuild);
        if (permCheck != PinguLibrary.PermissionGranted) return message.channel.send(permCheck);

        let { managerRole, firstTimeExecuted, channel } = pGuild.suggestionConfig;

        if (["setup", "list"].includes(args[0]) || firstTimeExecuted) {
            if (!message.member.hasPermission(DiscordPermissions.ADMINISTRATOR) && !firstTimeExecuted && //Member isn't admin, suggestion is configurated, manager role exists & member doesn't have it
                (managerRole && !message.member.roles.cache.has(managerRole._id) || !managerRole)) //Member isn't admin, suggestion is configured & manager role doesn't exist
                return "You don't have `Administrator` permissions" + managerRole ? ` or the \`${managerRole.name}\` role` : "" + "!";
            if (args[0] == 'setup' || pGuild.suggestionConfig.firstTimeExecuted) return await FirstTimeExecuted(message, args, pGuild, pGuildClient);
            else return ListSuggestions(message, pGuild);
        }

        let suggestionChannel = getSuggestionChannel();
        let channelPermissions = channelCheck(suggestionChannel);
        if (!channelPermissions.value) return message.channel.send(channelPermissions.message);

        let suggestionValue = args.join(' ');
        let embed = new MessageEmbed()
            .setTitle('Suggestion')
            .setDescription(suggestionValue)
            .setColor(pGuildClient.embedColor)
            .setFooter(`This suggestion is currently Undecided`);

        if (message.channel.id == channel._id &&
            PinguLibrary.PermissionCheck(
                { author: client.suer, client, channel: suggestionChannel },
                DiscordPermissions.MANAGE_MESSAGES
            ) == PinguLibrary.PermissionGranted)
            message.delete();
        else message.channel.send(`Suggested!`).then(sent => sent.delete({ timeout: 5000 }));

        let suggestionMessage = await suggestionChannel.send(embed);
        await suggestionMessage.react(GetCheckMark(message.client));
        suggestionMessage.react('❌');

        PinguLibrary.consoleLog(message.client, `**${message.author.tag}** suggested "${suggestionValue}" in #${suggestionChannel.name}, ${message.guild.name}`);
        AddSuggestionToPGuilds(message, new Suggestion(suggestionValue, suggestionMessage.id, new PGuildMember(message.member), suggestionChannel, null));

        /**@returns {TextChannel} */
        function getSuggestionChannel() {
            let suggestionChannel = message.guild.channels.cache.find(c =>
                ([c.id, c.name].includes(args[0]) ||
                    c == message.mentions.channels.first()) && c.isText()
            );
            if (suggestionChannel) args.shift();
            else suggestionChannel = message.guild.channels.cache.find(c => c.id == channel._id) || message.channel;
            return suggestionChannel
        }

        /**@param {TextChannel} channel*/
        function channelCheck(channel) {
            let check = {
                author: message.author,
                channel,
                client: message.client,
                content: message.content
            }
            let channelPerms = PinguLibrary.PermissionCheck(check, [DiscordPermissions.VIEW_CHANNEL]);
            if (channelPerms != PinguLibrary.PermissionGranted) return { value: false, message: channelPerms };

            check.author = message.client.user;
            channelPerms = PinguLibrary.PermissionCheck(check, [DiscordPermissions.SEND_MESSAGES, DiscordPermissions.ADD_REACTIONS]);
            if (channelPerms != PinguLibrary.PermissionGranted) return { value: false, message: channelPerms };

            return { value: true, message: PinguLibrary.PermissionGranted };
        }
    }
}

/**@param {Message} message
 * @param {string[]} args
 * @param {PinguGuild} pGuild*/
async function PermissionCheck(message, args, pGuild) {
    const pGuildConf = pGuild.suggestionConfig;

    if (pGuildConf.firstTimeExecuted || ["setup", "list"].includes(args[0]))
        return PinguLibrary.PermissionGranted;
    else if (!args[0] && !args[1]) return `You didn't give me enough arguments!`;

    await CheckRoleUpdates(message);

    return PinguLibrary.PermissionGranted;

    /**@param {Message} message*/
    async function CheckRoleUpdates(message) {
        let managerPRole = pGuildConf.managerRole;
        let managerRole = CheckRole(managerPRole);

        if (!managerRole && managerPRole != undefined || managerPRole != undefined && managerRole || //Manager role (doesn't) exist(s)
            managerPRole && managerRole && managerRole.name != managerPRole.name) //Manager role's name changed
            await UpdatePGuild(message.client, pGuild,
                `Updated managerRole`,
                `I encountered and error while updating managerRole`
            );


        /**@param {PRole} pRole*/
        function CheckRole(pRole) {
            if (!pRole) return undefined;
            return message.guild.roles.cache.find(r => r.id == pRole._id);
        }
    }
}

/**@param {Message} message
 * @param {string[]} args
 * @param {PinguGuild} pGuild
 * @param {PClient} pGuildClient*/
async function FirstTimeExecuted(message, args, pGuild, pGuildClient) {
    if (args[0] != `setup`) message.channel.send(`**Hold on fella!**\nWe need to get ${message.guild.name} set up first!`);

    let collector = message.channel.createMessageCollector(m => m.author.id == message.author.id, { maxMatches: 1 }),
        collectorCount = 0, Reply = "", LastInput, ManagerRole;

    if (await HasAllArguments()) return;

    message.channel.send(`Firstly, I need to know if you have a Suggestion Manager role? You can reply \`Yes\` or \`No\` (without prefix).`);
    collector.on('collect', async userInput => {
        LastInput = userInput.content.toLowerCase();
        switch (collectorCount) {
            case 0:
                Reply = LastInput == "yes" ?
                    "Please tag the role or send the role ID" :
                    "Would you like a **Suggestion Manager** role?";
                break;
            case 1:
                ManagerRole = message.guild.roles.cache.find(role =>
                    role == userInput.mentions.roles.first() ||
                    role.id == userInput.content ||
                    role.name == userInput.content);
                if (ManagerRole) Reply = `Okay, I've found ${ManagerRole.name}`;
                else if (LastInput == `yes`) {
                    ManagerRole = "makeRole";
                    Reply = "Okay, I'll make that..";
                }
                else Reply = `Okay, then I won't make one.`;
                message.channel.send(Reply);
                Reply = `Do you have a channel for your suggestions?`;
                break;
            case 2:
                Reply = LastInput == "yes" ?
                    "Please tag the channel or send the channel ID" :
                    "Would you like a channel for the suggestions?";
                break;
            case 3:
                let suggestionChannel = message.guild.channels.cache.find(c =>
                    c == userInput.mentions.channels.first() ||
                    c.id == userInput.content ||
                    c.name == userInput.content);
                if (suggestionChannel) Reply = `Okay, I've found ${suggestionChannel}`;
                else if (LastInput == `yes`) {
                    if (PinguLibrary.PermissionCheck({
                        author: message.client.user,
                        channel: message.channel,
                        client: message.client,
                        content: message.content
                    }, [DiscordPermissions.MANAGE_CHANNELS]) != PinguLibrary.PermissionGranted) {
                        Reply = `I don't have permissions to create one!`;
                        break;
                    }

                    suggestionChannel = "makeChannel";
                    Reply = "Okay, I'll make that..";
                }
                else Reply = `Okay, then I won't make one.`;
                await message.channel.send(Reply);
                Reply = null;
                pGuild.pollConfig = await SaveSuggestionConfig(message, ManagerRole, suggestionChannel);
                collector.stop();
                break;
            default:
                collector.stop("Ran default switch-case");
                PinguLibrary.errorLog(message.client, `Ran default in suggestion, FirstTimeExecuted(), collector.on`, message.content); return;
        }

        collectorCount++;
        if (Reply) message.channel.send(Reply);
    });
    collector.on('end', async () => {
        message.channel.send(`Alright you're good to go!`)
        PinguLibrary.consoleLog(message.client, `"${message.guild.name}" was successfully sat up with *suggestion.`);

        if (args[0] != 'setup') module.exports.execute({ message, args, pGuild, pGuildClient });
    });
    async function HasAllArguments() {
        /*
         [0]: setup
         [1]: managerRole
         [2]: suggestionChannel
         */
        if (args.length != 3 || !isNaN(ms(args[0]))) return false;

        let find = (i, arg) => {
            return [i.id, i.name.toLowerCase(), i.toString().toLowerCase()].includes(arg);
        }
        let findRole = argument => {
            if (argument == 'null') return null;

            return message.guild.roles.cache.find(r => find(r, argument));
        };
        let findChannel = argument => {
            return message.guild.channels.cache.find(c => find(c, argument) && c.isText());
        };

        let managerRole = findRole(args[1]);
        let suggestionChannel = findChannel(args[2]);

        await SaveSuggestionConfig(message, managerRole, suggestionChannel);

        message.channel.send(`Setup done!`);
        return true;
    }

}
/**@param {Message} message
 @param {PinguGuild} pGuild*/
async function ListSuggestions(message, pGuild) {
    let Suggestions = pGuild.suggestionConfig.suggestions,
        Embeds = CreateEmbeds(false), EmbedIndex = 0;

    if (!Suggestions.length || !Embeds.length) return message.channel.send(`There are no suggestions saved!`);

    var sent = await message.channel.send(Embeds[EmbedIndex])
    const Reactions = ['⬅️', GetCheckMark(message.client), '❌', '🗑️', '➡️', '🛑'];
    Reactions.forEach(async r => await sent.react(r));
    Reactions[1] = 'Checkmark';

    const reactionCollector = sent.createReactionCollector((reaction, user) =>
        Reactions.includes(reaction.emoji.name) && user.id == message.author.id, { time: ms('20s') });

    reactionCollector.on('end', async reactionsCollected => {
        if (!reactionsCollected.array().includes('🛑')) {
            await sent.delete()
            message.channel.send(`Stopped showing suggestions.`);
        }
    });
    reactionCollector.on('collect', async reaction => {
        let suggestion = Suggestions.find(suggestion =>
            suggestion._id == reaction.message.embeds[0].description.substring(4, reaction.message.embeds[0].description.length))

        reactionCollector.resetTimer({ time: ms('20s') });
        switch (reaction.emoji.name) {
            case '⬅️': var embedToSend = await ReturnEmbed(-1); break;
            case 'Checkmark': case '❌':
                Suggestions = await Decide(pGuild, reaction.emoji.name != '❌', suggestion, message.member);
                Embeds = CreateEmbeds(true);
                embedToSend = await ReturnEmbed(1);
                break;
            case '🗑️': embedToSend = await ReturnEmbed(0); break;
            case '➡️': embedToSend = await ReturnEmbed(1); break;
            case '🛑': reactionCollector.stop(); return;
            default: PinguLibrary.errorLog(message.client, `suggestion, ListSuggestions(), reactionCollector.on() default case: ${reaction.emoji.name}`, message.content); break;
        }

        if (!Suggestions.length || !embedToSend) {
            message.channel.send(`No more suggestions to find!`);
            return reactionCollector.stop();
        }

        //Send new embed
        await sent.edit(embedToSend.setFooter(`Now viewing: ${EmbedIndex + 1}/${Suggestions.length}`));
        sent.reactions.cache.forEach(reaction => {
            if (reaction.users.cache.size > 1)
                reaction.users.cache.forEach(async user => {
                    if (user.id != message.client.user.id)
                        await reaction.users.remove(user)
                })
        })

        /**@param {number} index  
         * @returns {Promise<MessageEmbed>}*/
        async function ReturnEmbed(index) {
            if (!Embeds) return null;

            EmbedIndex += index;
            if (EmbedIndex <= -1) {
                EmbedIndex = Embeds.length - 1;
                index = -1;
            }
            else if (EmbedIndex >= Embeds.length) {
                EmbedIndex = 0;
                index = 1
            }

            switch (index) {
                case -1: return Embeds[EmbedIndex];
                case 0: return await DeleteSuggestion(Embeds[EmbedIndex]);
                case 1: return Embeds[EmbedIndex];
                default: PinguLibrary.errorLog(message.client, `suggestion, ListSuggestions, reactionCollector.on(), ReturnEmbed() Ran default: ${index}`, message.content); return Embeds[EmbedIndex = 0];
            }
        }
        /**@param {MessageEmbed} embed*/
        async function DeleteSuggestion(embed) {
            const deletingSuggestions = Suggestions.find(suggestion => suggestion._id == embed.description.substring(4, embed.description.length));
            Suggestions = await RemoveSuggestions(message, [deletingSuggestions]);
            Embeds = CreateEmbeds(true);

            return !Suggestions.includes(deletingSuggestions) ?
                await DoTheEmojiThing('✅', 1) :
                await DoTheEmojiThing('❌', -1);

            /**@param {'✅' | '❌'} emote
             * @param {0 | -1} index*/
            async function DoTheEmojiThing(emote, index) {
                await sent.react(emote);
                await setTimeout(async () => await sent.reactions.cache.find(r => r.emoji.name == emote).remove(), 1500);
                return await ReturnEmbed(index);
            }
        }
    });

    /**@param {boolean} autocalled*/
    function CreateEmbeds(autocalled) {
        let Embeds = [], ToRemove = [];

        if (!Suggestions.length) return null;

        for (var i = 0; i < Suggestions.length; i++) {
            try {
                Embeds[i] = new MessageEmbed()
                    .setTitle(Suggestions[i].value)
                    .setDescription(`ID: ${Suggestions[i]._id}`)
                    .setColor(PinguGuild.GetPClient(message.client, pGuild).embedColor)
                    .addFields([
                        new EmbedField(`Verdict`, `${(
                            Suggestions[i].approved == 'Approved' ? GetCheckMark(message.client) :
                                Suggestions[i].approved == 'Denied' ? '❌' : '🤷'
                        )}` + Suggestions[i].approved, true),
                        new EmbedField(`Suggested By`, `<@${Suggestions[i].author._id}>`, true),
                        Suggestions[i].approved != 'Undecided' ?
                            new EmbedField(`Decided By`, `<@${Suggestions[i].decidedBy._id}>`, true) :
                            PinguLibrary.BlankEmbedField(true)
                    ])
                    .setFooter(`Now viewing: ${i + 1}/${Suggestions.length}`);
            } catch (err) { PinguLibrary.errorLog(message.client, `Adding suggestion to Embeds`, message.content, err); ToRemove.push(Suggestions[i]); }
        }
        RemoveSuggestions(message, ToRemove);
        if (!Embeds && !autocalled) return null;
        return Embeds;
    }
}

//#region pGuild Methods
/**@param {Message} message 
 * @param {Role | string} ManagerRole
 * @param {GuildChannel | string} suggestionChannel*/
async function SaveSuggestionConfig(message, ManagerRole, suggestionChannel) {
    if (typeof (ManagerRole) === 'string')
        ManagerRole = await MakeManagerRole(message);
    ManagerRole = ManagerRole ? new PRole(ManagerRole) : undefined;

    if (typeof suggestionChannel === 'string')
        suggestionChannel = await MakeSuggestionChannel(message);
    suggestionChannel = suggestionChannel ? new PChannel(suggestionChannel) : undefined;

    let pGuild = await PinguGuild.GetPGuild(message.guild);
    pGuild.suggestionConfig = new SuggestionConfig({
        firstTimeExecuted: false,
        channel: suggestionChannel,
        managerRole: ManagerRole,
        suggestions: new Array()
    });
    await UpdatePGuild(message.client, pGuild,
        `Successfully updated ${message.guild.name}'s suggestionConfig.`,
        `I encountered an error, while saving ${message.guild.name}'s suggestionConfig!`
    );

    return pGuild.suggestionConfig;

    /**@param {Message} message 
     * @returns {Promise<Role>}*/
    function MakeManagerRole(message) {
        return message.guild.roles.create({
            data: { name: 'Suggestion Manager' }
        }).catch(async err => {
            await PinguLibrary.errorLog(`Create Suggestion Mmanager role for "${message.guild.name}" (${message.guild.id})`, err)
            message.channel.send(`I had an error trying to create the manager role! I've contacted my developers.`);
        });
    }
    /**@param {Message} message 
     * @returns {Promise<TextChannel>}*/
    function MakeSuggestionChannel(message) {
        return message.guild.channels.create('suggestions').catch(async err => {
            await PinguLibrary.errorLog(`Create Suggestions channel for "${message.guild.name}" (${message.guild.id})`, err)
            message.channel.send(`I had an error trying to create the suggestions channel! I've contacted my developers.`);
        })
    }
}
/**@param {Message} message 
 * @param {Suggestion} suggestion*/
async function AddSuggestionToPGuilds(message, suggestion) {
    let pGuild = await PinguGuild.GetPGuild(message.guild);
    let { suggestionConfig } = pGuild;
    suggestionConfig.suggestions.push(suggestion);

    return await UpdatePGuild(message.client, pGuild,
        `Added "${suggestion.value}" to "${message.guild.name}"'s PinguGuild`,
        `I encountered an error, while adding suggestion to ${message.guild.name}'s PinguGuild`
    );
}
/**@param {PinguGuild} pGuild
 * @param {boolean} approved
 * @param {Suggestion} suggestion
 * @param {GuildMember} decidedBy*/
async function Decide(pGuild, approved, suggestion, decidedBy) {
    suggestion = Suggestion.Decide(suggestion, approved, new PGuildMember(decidedBy));

    UpdateSuggestionEmbed(decidedBy.guild.channels.cache.get(suggestion.channel._id));

    const pGuildSuggestions = pGuild.suggestionConfig.suggestions;

    const thisusggestionman = pGuildSuggestions.find(s => s._id == suggestion._id);
    pGuildSuggestions[pGuildSuggestions.indexOf(thisusggestionman)] = suggestion;

    await UpdatePGuild(decidedBy.client, pGuild,
        `Successfully saved the verdict for "${suggestion.value}" to ${decidedBy.guild.name} PinguGuild.`,
        `I encountered an error, while saving the verdict for "${suggestion.value}" to ${decidedBy.guild.name} PinguGuild.`
    );
    return pGuildSuggestions;

    /**@param {TextChannel} channel*/
    async function UpdateSuggestionEmbed(channel) {
        let fetchedMessage = await channel.messages.fetch(suggestion._id);
        return fetchedMessage.embeds[0].setFooter(`Suggestion was ${suggestion.value} by <@${suggestion.author._id}>`);
    }
}
/**@param {Message} message 
 * @param {Suggestion[]} suggestions*/
async function RemoveSuggestions(message, suggestions) {
    if (!suggestions.length || !suggestions[0]) return;

    const pGuild = await PinguGuild.GetPGuild(message.guild);

    suggestions.forEach(p => pGuild.suggestionConfig.suggestions.splice(pGuild.suggestionConfig.suggestions.indexOf(p), 1))
    PinguLibrary.consoleLog(message.client, `The suggestion, ${suggestions[0].value} (${suggestions[0]._id}) was removed.`);

    await UpdatePGuild(message.client, pGuild,
        `Removed "${suggestions[0].value}" from ${message.guild.name}'s suggestions list.`,
        `I encounted an error, while removing ${suggestions.id} (${suggestions.value}) from ${message.guild.name}'s suggestions list`
    );
    return pGuild.suggestionConfig.suggestions;
}
/**@param {Client} client
 * @param {PinguGuild} pGuild
 * @param {string} succMsg
 * @param {string} errMsg*/
async function UpdatePGuild(client, pGuild, succMsg, errMsg) {
    return await PinguGuild.UpdatePGuild(client,
        { suggestionConfig: pGuild.suggestionConfig },
        pGuild, module.exports.name,
        succMsg, errMsg
    );
}
//#endregion

/**@param {Client} client*/
function GetCheckMark(client) {
    return PinguLibrary.SavedServers.DanhoMisc(client).emojis.cache.find(e => e.name == 'Checkmark');
}