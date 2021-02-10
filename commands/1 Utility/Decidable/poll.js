const { Message, MessageEmbed, Role, GuildChannel, TextChannel, Client } = require('discord.js'),
    { PinguGuild, Poll, PollConfig, PRole, TimeLeftObject, PGuildMember, PinguLibrary, DiscordPermissions, PChannel, PClient } = require('PinguPackage');
ms = require('ms');

module.exports = {
    name: 'poll',
    description: 'Create a poll for users to react',
    usage: '<setup> | <list> | <time> [channel] <question>',
    guildOnly: true,
    id: 1,
    example: ["setup", "list", "10m Am I asking a question?"],
    permissions: [
        DiscordPermissions.SEND_MESSAGES,
        DiscordPermissions.ADD_REACTIONS,
        DiscordPermissions.MANAGE_MESSAGES
    ],
    /**@param {{message: Message, args: string[], pGuild: PinguGuild, pGuildClient: PClient}}*/
    async execute({ message, args, pGuild, pGuildClient }) {
        if (!pGuild) {
            await PinguLibrary.errorLog(message.client, `Couldn't find pGuild for "${message.guild.name}" (${message.guild.id})`)
            return message.channel.send(`I had an error trying to get your Pingu Guild! I've notified my developers.`);
        }

        //Permission check
        const permCheck = await PermissionCheck(message, args, pGuild);
        if (permCheck != PinguLibrary.PermissionGranted) return message.channel.send(permCheck);
        else if (args[0] == 'setup' || pGuild.pollConfig.firstTimeExecuted) return await FirstTimeExecuted(message, args, pGuild, pGuildClient);
        else if (args[0] == "list") return ListPolls(message);

        //Create scrubby variables
        const Time = args.shift();
        let pollsChannel = message.guild.channels.cache.find(c =>
            (c.id == args[0] ||
                c.name == args[0] ||
                c == message.mentions.channels.first()) && c.isText()
        );
        if (pollsChannel) args.shift();
        else pollsChannel = message.guild.channels.cache.find(c => c.id == pGuild.pollConfig.channel._id) || message.channel;

        let check = {
            author: message.author,
            channel: pollsChannel,
            client: message.client,
            content: message.content
        }
        let channelPerms = PinguLibrary.PermissionCheck(check, [DiscordPermissions.VIEW_CHANNEL]);
        if (channelPerms != PinguLibrary.PermissionGranted) return message.channel.send(channelPerms);

        check.author = message.client.user;
        channelPerms = PinguLibrary.PermissionCheck(check, [DiscordPermissions.SEND_MESSAGES, DiscordPermissions.ADD_REACTIONS]);
        if (channelPerms != PinguLibrary.PermissionGranted) return message.channel.send(channelPerms);

        let Question = args.join(" ");
        const color = pGuildClient.embedColor, EndsAt = new Date(Date.now() + ms(Time));

        //Create Embed
        let Embed = new MessageEmbed()
            .setTitle(Question)
            .setColor(color)
            .setDescription(
                `Brought to you by <@${message.author.id}>\n` +
                `Time left: ${new TimeLeftObject(new Date(Date.now()), EndsAt).toString()}`)
            .setFooter(`Ends at`)
            .setTimestamp(EndsAt);

        if (message.channel.id == pollsChannel.id &&
            PinguLibrary.PermissionCheck(
                { author: client.suer, client, channel: pollsChannel },
                DiscordPermissions.MANAGE_MESSAGES
            ) == PinguLibrary.PermissionGranted)
            message.delete();
        else message.channel.send(`Poll sent!`).then(sent => sent.delete({ timeout: 5000 }));

        //Send Embed and react.
        var PollMessage = await pollsChannel.send(Embed);
        await PollMessage.react('👍')
        PollMessage.react('👎');

        PinguLibrary.consoleLog(message.client, `${message.author.tag} hosted a poll in "${message.guild.name}": ${Question}`);
        AddPollToPGuilds(message, new Poll(Question, PollMessage.id, new PGuildMember(message.member), pollsChannel, EndsAt));

        const interval = setInterval(() => UpdateTimer(PollMessage, EndsAt, new PGuildMember(message.guild.member(message.author))), 5000);
        setTimeout(() => AfterTimeOut(Embed, PollMessage, interval), ms(Time));

        /**@param {Message} PollMessage 
         * @param {Date} EndsAt 
         * @param {PGuildMember} Host*/
        async function UpdateTimer(PollMessage, EndsAt, Host) {
            PollMessage.edit(PollMessage.embeds[0]
                .setDescription(
                    `Brought to you by <@${Host._id}>\n` +
                    `Time left: ${new TimeLeftObject(new Date(Date.now()), EndsAt).toString()}`
                )).catch(async err => {
                    await PinguLibrary.errorLog(message.client, `Updating poll timer`, message.content, err);
                    PollMessage.author.send(`I had an issue updating the poll message, so your poll might not finish! Don't worry though, I have already contacted my developers!`);
                });
        }
    },
};

/**@param {Message} message 
 * @param {string[]} args
 * @param {PinguGuild} pGuild*/
async function PermissionCheck(message, args, pGuild) {
    const pGuildConf = pGuild.pollConfig;

    if (pGuildConf.firstTimeExecuted || ['setup', "list"].includes(args[0]))
        return PinguLibrary.PermissionGranted;
    else if (!args[0] && !args[1]) return `You didn't give me enough arguments!`;

    await CheckRoleUpdates(message);

    if (!message.member.hasPermission(DiscordPermissions.ADMINISTRATOR) && pGuildConf.pollRole && !message.member.roles.cache.has(pGuildConf.pollRole._id))
        return "You don't have `Administrator` permissions" + pGuildConf.pollRole ? ` or the \`${pGuildConf.pollRole.name}\` role` : "" + "!";

    else if (args[0].endsWith('s') && parseInt(args[0].substring(0, args[0].length - 1)) < 30)
        return 'Please specfify a time higher than 29s';
    else if (!ms(args[0])) return 'Please provide a valid time!';
    else if (!isNaN(args[0].substring(args[0].length - 1, args[0].length))) //No s,m,h provided, treat as minutes
        args[0] = args[0] + "m";

    return PinguLibrary.PermissionGranted;

    /**@param {Message} message*/
    async function CheckRoleUpdates(message) {
        let pGuild = await PinguGuild.GetPGuild(message.guild);
        let pollPRole = pGuild.pollConfig.pollRole;
        let pollRole = CheckRole(pollPRole);

        if (!pollRole && pollPRole != undefined || pollPRole != undefined && pollRole || //Poll role (doesn't) exist(s)
            pollPRole && pollRole && pollRole.name != pollPRole.name) //Pole role's name changed
            await UpdatePGuild(message.client, pGuild,
                `Updated giveaway roles`,
                `I encountered and error while updating giveaway roles`
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
        collectorCount = 0, Reply, LastInput, PollsRole;

    if (await HasAllArguments()) return;

    message.channel.send(`Firstly, I need to know if there is a **Polls Host** role? You can reply \`Yes\` or \`No\` (without prefix).`);
    collector.on('collect', async userInput => {
        LastInput = userInput.content.toLowerCase();
        switch (collectorCount) {
            case 0:
                Reply = LastInput == "yes" ?
                    "Please tag the role or send the role ID" :
                    "Would you like a **Polls Host** role?";
                break;
            case 1:
                PollsRole = message.guild.roles.cache.find(role =>
                    role == userInput.mentions.roles.first() ||
                    role.id == userInput.content ||
                    role.name == userInput.content);
                if (PollsRole) Reply = `Okay, I've found ${PollsRole.name}`;
                else if (LastInput == `yes`) {
                    PollsRole = "makeRole";
                    Reply = "Okay, I'll make that..";
                }
                else Reply = `Okay, then I won't make one.`;
                message.channel.send(Reply);
                Reply = `Do you have a channel for it?`;
                break;
            case 2:
                Reply = LastInput == "yes" ?
                    "Please tag the channel or send the channel ID" :
                    "Would you like a channel for the polls?";
                break;
            case 3:
                let pollsChannel = message.guild.channels.cache.find(c =>
                    c == userInput.mentions.channels.first() ||
                    c.id == userInput.content ||
                    c.name == userInput.content);
                if (pollsChannel) Reply = `Okay, I've found ${pollsChannel}`;
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

                    pollsChannel = "makeChannel";
                    Reply = "Okay, I'll make that..";
                }
                else Reply = `Okay, then I won't make one.`;
                await message.channel.send(Reply);
                Reply = null;
                pGuild.pollConfig = await SavePollConfig(message, PollsRole, pollsChannel);
                collector.stop();
                break;
            default:
                collector.stop("Ran default switch-case");
                PinguLibrary.errorLog(message.client, `Ran default in polls, FirstTimeExecuted(), collector.on`, message.content); return;
        }

        collectorCount++;
        if (Reply) message.channel.send(Reply);
    });
    collector.on('end', async () => {
        message.channel.send(`Alright you're good to go!`)
        PinguLibrary.consoleLog(message.client, `"${message.guild.name}" was successfully sat up with *poll.`);

        if (args[0] != 'setup') module.exports.execute({ message, args, pGuild, pGuildClient });
    });
    async function HasAllArguments() {
        /*
         [0]: setup
         [1]: pollsRole
         [2]: pollsChannel
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

        let pollsRole = findRole(args[1]);
        let pollsChannel = findChannel(args[2]);

        await SavePollConfig(message, pollsRole, pollsChannel);

        message.channel.send(`Setup done!`);
        return true;
    }
}

/**@param {MessageEmbed} Embed 
 * @param {Message} PollMessage 
 * @param {string} Poll*/
async function AfterTimeOut(Embed, PollMessage, interval) {
    clearInterval(interval);

    //Defining Verdict
    let poll = (await PinguGuild.GetPGuild(PollMessage.guild)).pollConfig.polls.find(p => p._id == PollMessage.id);
    poll = Poll.Decide(
        poll,
        PollMessage.reactions.cache.get('👍').count,
        PollMessage.reactions.cache.get('👎').count
    );

    //Submitting Verdict
    PollMessage.channel.send(`The poll of "**${poll.value}**", voted **${poll.approved}**!`);

    PollMessage.edit(Embed
        .setTitle(`FINISHED!: ${poll.value}`)
        .setDescription(`Voting done! Final answer: ${poll.approved}`)
        .setFooter(`Poll Ended.`)
    );
    SaveVerdictToPGuilds(PollMessage, poll);
}
/**@param {Message} message*/
async function ListPolls(message) {
    let pGuild = await PinguGuild.GetPGuild(message.guild);
    let Polls = pGuild.pollConfig.polls,
        Embeds = CreateEmbeds(false), EmbedIndex = 0;

    if (!Polls.length || !Embeds.length) return message.channel.send(`There are no polls saved!`);

    var sent = await message.channel.send(Embeds[EmbedIndex])
    const Reactions = ['⬅️', '🗑️', '➡️', '🛑'];
    Reactions.forEach(r => sent.react(r));

    const reactionCollector = sent.createReactionCollector((reaction, user) =>
        Reactions.includes(reaction.emoji.name) && user.id == message.author.id, { time: ms('20s') });

    reactionCollector.on('end', async reactionsCollected => {
        if (!reactionsCollected.array().includes('🛑')) {
            await sent.delete()
            message.channel.send(`Stopped showing pols.`);
        }
    });
    reactionCollector.on('collect', async reaction => {
        reactionCollector.resetTimer({ time: ms('20s') });
        switch (reaction.emoji.name) {
            case '⬅️': var embedToSend = await ReturnEmbed(-1); break;
            case '🗑️': embedToSend = await ReturnEmbed(0); break;
            case '➡️': embedToSend = await ReturnEmbed(1); break;
            case '🛑': reactionCollector.stop(); return;
            default: PinguLibrary.errorLog(message.client, `polls, ListPolls(), reactionCollector.on() default case: ${reaction.emoji.name}`, message.content); break;
        }

        if (!Polls.length || !embedToSend) {
            message.channel.send(`No more polls to find!`);
            return reactionCollector.stop();
        }

        //Send new embed
        await sent.edit(embedToSend.setFooter(`Now viewing: ${EmbedIndex + 1}/${Polls.length}`));
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
                case 0: return await DeletePoll(Embeds[EmbedIndex]);
                case 1: return Embeds[EmbedIndex];
                default: PinguLibrary.errorLog(message.client, `poll, ListPolls, reactionCollector.on(), ReturnEmbed() Ran default: ${index}`, message.content); return Embeds[EmbedIndex = 0];
            }
        }
        /**@param {MessageEmbed} embed*/
        async function DeletePoll(embed) {
            const deletingPolls = Polls.find(poll => poll._id == embed.description.substring(4, embed.description.length));
            Polls = await RemovePolls(message, [deletingPolls]);
            Embeds = CreateEmbeds(true);

            return !Polls.includes(deletingPolls) ?
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

        if (!Polls.length) return null;

        for (var i = 0; i < Polls.length; i++) {
            try {
                Embeds[i] = new MessageEmbed()
                    .setTitle(Polls[i].value)
                    .setDescription(`ID: ${Polls[i]._id}`)
                    .setColor(PinguGuild.GetPClient(message.client, pGuild).embedColor)
                    .addField(`Verdict`, Polls[i].approved, true)
                    .addField(`Host`, `<@${Polls[i].author._id}>`, true)
                    .setFooter(`Now viewing: ${i + 1}/${Polls.length}`);
            } catch (err) { PinguLibrary.errorLog(message.client, `Adding poll to Embeds`, message.content, err); ToRemove.push(Polls[i]); }
        }
        RemovePolls(message, ToRemove);
        if (!Embeds && !autocalled) return null;
        return Embeds;
    }
}

//#region pGuild Methods
/**@param {Message} message 
 * @param {Role | string} PollsRole
 * @param {GuildChannel | string} pollsChannel*/
async function SavePollConfig(message, PollsRole, pollsChannel) {
    if (typeof (PollsRole) === 'string')
        PollsRole = await MakePollsRole(message);
    PollsRole = PollsRole ? new PRole(PollsRole) : undefined;

    if (typeof pollsChannel === 'string')
        pollsChannel = await MakePollsChannel(message);
    pollsChannel = pollsChannel ? new PChannel(pollsChannel) : undefined;

    let pGuild = await PinguGuild.GetPGuild(message.guild);
    pGuild.pollConfig = new PollConfig({
        firstTimeExecuted: false,
        channel: pollsChannel,
        pollRole: PollsRole,
        polls: new Array()
    });
    await UpdatePGuild(message.client, pGuild,
        `Successfully updated ${message.guild.name}'s pollConfig.`,
        `I encountered an error, while saving ${message.guild.name}'s pollConfig!`
    );

    return pGuild.pollConfig;

    /**@param {Message} message 
     * @returns {Promise<Role>}*/
    function MakePollsRole(message) {
        return message.guild.roles.create({
            data: { name: 'Polls' }
        }).catch(async err => {
            await PinguLibrary.errorLog(`Create Polls role for "${message.guild.name}" (${message.guild.id})`, err)
            message.channel.send(`I had an error trying to create the polls role! I've contacted my developers.`);
        });
    }
    /**@param {Message} message 
     * @returns {Promise<TextChannel>}*/
    function MakePollsChannel(message) {
        return message.guild.channels.create('polls').catch(async err => {
            await PinguLibrary.errorLog(`Create Polls channel for "${message.guild.name}" (${message.guild.id})`, err)
            message.channel.send(`I had an error trying to create the polls channel! I've contacted my developers.`);
        })
    }
}
/**@param {Message} message 
 * @param {Poll} poll*/
async function AddPollToPGuilds(message, poll) {
    let pGuild = await PinguGuild.GetPGuild(message.guild);
    let { pollConfig } = pGuild;
    pollConfig.polls.push(poll);

    return await UpdatePGuild(message.client, pGuild,
        `Added "${poll.value}" to "${message.guild.name}"'s PinguGuild`,
        `I encountered an error, while adding ${poll.value}'s PinguGuild`
    );
}
/**@param {Message} message 
 * @param {Poll} poll*/
async function SaveVerdictToPGuilds(message, poll) {
    let pGuild = await PinguGuild.GetPGuild(message.guild);
    const pGuildPolls = pGuild.pollConfig.polls;

    const thispollman = pGuildPolls.find(p => p._id == poll._id);
    pGuildPolls[pGuildPolls.indexOf(thispollman)] = poll;

    return await UpdatePGuild(message.client, pGuild,
        `Successfully saved the verdict for "${poll.value}" to ${message.guild.name} PinguGuild.`,
        `I encountered an error, while saving the verdict for "${poll.value}"`
    );
}
/**@param {Message} message 
 * @param {Poll[]} polls*/
async function RemovePolls(message, polls) {
    if (!polls.length || !polls[0]) return;

    const pGuild = await PinguGuild.GetPGuild(message.guild);

    polls.forEach(p => pGuild.pollConfig.polls.splice(pGuild.pollConfig.polls.indexOf(p), 1))
    PinguLibrary.consoleLog(message.client, `The poll, ${polls[0].value} (${polls[0]._id}) was removed.`);

    await UpdatePGuild(message.client, pGuild,
        `Removed "${polls[0].value}" from ${message.guild.name}'s polls list.`,
        `I encounted an error, while removing ${polls.id} (${polls.value}) from ${message.guild.name}'s polls list`
    );
    return pGuild.pollConfig.polls;
}
/**@param {Client} client
 * @param {PinguGuild} pGuild
 * @param {string} succMsg
 * @param {string} errMsg*/
async function UpdatePGuild(client, pGuild, succMsg, errMsg) {
    return await PinguGuild.UpdatePGuild(client,
        { pollConfig: pGuild.pollConfig },
        pGuild, module.exports.name,
        succMsg, errMsg
    );
}
//#endregion