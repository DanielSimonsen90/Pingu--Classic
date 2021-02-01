const { Message, MessageEmbed, Role, GuildChannel, TextChannel, Channel } = require('discord.js'),
    { PinguGuild, Poll, PollConfig, PRole, TimeLeftObject, PGuildMember, PinguLibrary, DiscordPermissions, PChannel, PClient } = require('../../PinguPackage');
const { disconnect } = require('process');
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
            return message.channel.send(`I had an error trying to get ${message.guild.name}'s Pingu Guild! I've notified my developers.`);
        }

        //Permission check
        const PermResponse = PermissionCheck(message, args);
        if (PermResponse != PinguLibrary.PermissionGranted) return message.channel.send(PermResponse);
        else if (args[0] == 'setup' || !pGuild.pollConfig) return FirstTimeExecuted(message, args);
        else if (args[0] == "list") return ListPolls(message);

        //Create scrubby variables
        const Time = args.shift();
        let pollsChannel = message.guild.channels.cache.find(c =>
            (c.id == args[0] ||
            c.name == args[0] ||
            c == message.mentions.channels.first()) && c.isText()
        );
        if (pollsChannel) args.shift();
        else pollsChannel = message.guild.channels.cache.find(c => c.id == pGuild.pollConfig.channel.id) || message.channel;

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
            .setFooter(`Ends at: ${EndsAt}`);

        if (message.channel.id == pollsChannel.id) message.delete();
        else message.channel.send(`Sent poll!`);

        //Send Embed and react.
        var PollMessage = await pollsChannel.send(Embed);
        await PollMessage.react('👍')
        PollMessage.react('👎');

        PinguLibrary.consoleLog(message.client, `${message.author.tag} hosted a poll in "${message.guild.name}": ${Question}`);
        AddPollToPGuilds(message, new Poll(Question, PollMessage.id, new PGuildMember(message.member), pollsChannel));

        const interval = setInterval(() => UpdateTimer(PollMessage, EndsAt, new PGuildMember(message.guild.member(message.author))), 5000);
        setTimeout(() => AfterTimeOut(Embed, PollMessage, interval), ms(Time));

        /**@param {Message} PollMessage @param {Date} EndsAt @param {PGuildMember} Host*/
        async function UpdateTimer(PollMessage, EndsAt, Host) {
            PollMessage.edit(PollMessage.embeds[0]
                .setDescription(
                    `Brought to you by <@${Host.id}>\n` +
                    `Time left: ${new TimeLeftObject(new Date(Date.now()), EndsAt).toString()}`
                )).catch(async err => {
                    await PinguLibrary.errorLog(message.client, `Updating poll timer`, message.content, err);
                    PollMessage.author.send(`I had an issue updating the poll message, so your poll might not finish! Don't worry though, I have already contacted my developers!`);
                });
        }
    },
};
/**@param {Message} message @param {string[]} args*/
function PermissionCheck(message, args) {
    const pGuildConf = PinguGuild.GetPGuild(message.guild).giveawayConfig;
    if (!pGuildConf || ['setup', "list"].includes(args[0]))
        return PinguLibrary.PermissionGranted;

    if (pGuildConf.pollRole && !message.guild.member(message.author).roles.cache.has(pGuildConf.pollRole.id) && //pollRole exists and author doesn't have it
        !message.channel.permissionsFor(message.author).has('ADMINISTRATOR')) //author doesn't have Administrator
        return `You don't have \`ADMINISTRATOR\` permissions or a \`Polls\` role!`;
    else if (!pGuildConf.pollRole && !message.channel.permissionsFor(message.author).has('ADMINISTRATOR'))  //pollRole doesn't exist && author doesn't have Administrator
        return "You don't have `ADMINISTRATOR` permission!";
    else if (!args[1]) return 'Please provide a poll question!';
    else if (args[0].endsWith('s') && parseInt(args[0].substring(0, args[0].length - 1)) < 30)
        return 'Please specfify a time higher than 29s';
    else if (!ms(args[0])) return 'Please provide a valid time!';
    return PinguLibrary.PermissionGranted;
}
/**@param {Message} message @param {string[]} args*/
function FirstTimeExecuted(message, args) {
    if (args[0] != `setup`) return message.channel.send(`**Hold on fella!**\nWe need to get ${message.guild.name} set up first!`);

    let collector = message.channel.createMessageCollector(m => m.author.id == message.author.id, { maxMatches: 1 }),
        collectorCount = 0, Reply, LastInput;

    if (HasAllArguments()) return;

    message.channel.send('Firstly, I need to know if there is a Polls Host role?');

    collector.on('collect', userInput => {
        LastInput = userInput.content.toLowerCase();
        switch (collectorCount) {
            case 0:
                Reply = LastInput == "yes" ?
                    "Please tag the role or send the role ID" :
                    "Would you like a Polls Host role?";
                break;
            case 1:
                let PollsRole = message.guild.roles.cache
                    .find(role => role == userInput.mentions.roles.first() ||
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
                let pollsChannel = message.guild.channels.cache
                    .find(c => c == userInput.mentions.roles.first() ||
                        c.id == userInput.content ||
                        c.name == userInput.content);
                if (PollsRole) Reply = `Okay, I've found ${pollsChannel}`;
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

                    PollsRole = "makeChannel";
                    Reply = "Okay, I'll make that..";
                }
                else Reply = `Okay, then I won't make one.`;

                SaveSetupToPGuilds(message, PollsRole, pollsChannel);

                break;
            default: collector.stop("Ran default switch-case");
                PinguLibrary.errorLog(message.client, `Ran default in polls, FirstTimeExecuted(), collector.on`, message.content); return;
        }

        collectorCount++;
        message.channel.send(Reply);
        if (collectorCount == 2) collector.stop();
    });
    collector.on('end', () => {
        message.channel.send(`Alright you're good to go!`)
        PinguLibrary.consoleLog(message.client, `"${message.guild.name}" was successfully sat up with *poll.`);

        if (args[0] != 'setup') module.exports.execute({ message, args, pGuild });
    });

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

    /**@param {Message} message 
     * @param {Role | string | undefined} PollsRole
     * @param {GuildChannel | string} pollsChannel*/
    async function SaveSetupToPGuilds(message, PollsRole, pollsChannel) {
        if (typeof (PollsRole) === 'string')
            PollsRole = await MakePollsRole(message);
        PollsRole = PollsRole ? new PRole(PollsRole) : "undefined";

        if (typeof pollsChannel === 'string')
            pollsChannel = await MakePollsChannel(message);
        pollsChannel = pollsChannel ? new PChannel(pollsChannel) : "undefined";

        PinguGuild.GetPGuild(message.guild).pollConfig = new PollConfig({
            channel: pollsChannel,
            pollRole: PollsRole,
            polls: new Array()
        });

        PinguGuild.UpdatePGuildJSON(message.client, message.guild, "Poll: SaveSetupToPGuilds",
            `Successfully updated guilds.json with ${message.guild.name}'s pollConfig.`,
            `I encountered an error, while saving ${message.guild.name}'s pollConfig to guilds.json`
        );
    }

    function HasAllArguments() {
        /*
         [0]: setup
         [1]: pollsRole
         [2]: pollsChannel
         */
        if (args.length != 3) return false;

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

        SaveSetupToPGuilds(message, pollsRole, pollsChannel);

        message.channel.send(`Setup done!`);
        return true;
    }
}
/**@param {MessageEmbed} Embed @param {Message} PollMessage @param {string} Poll*/
function AfterTimeOut(Embed, PollMessage, interval) {
    clearInterval(interval);

    //Defining Verdict
    const poll = PinguGuild.GetPGuild(PollMessage.guild).pollConfig.polls.find(p => p.id == PollMessage.id),
        Yes = PollMessage.reactions.cache.get('👍').count,
        No = PollMessage.reactions.cache.get('👎').count;

    poll.Decide(Yes, No);

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
    let Polls = PinguGuild.GetPGuild(message.guild).pollConfig.polls,
        Embeds = CreateEmbeds(false), EmbedIndex = 0;

    if (!Embeds || Embeds.length == 0) return message.channel.send(`There are no polls saved!`);

    var sent = await message.channel.send(Embeds[EmbedIndex])
    const Reactions = ['⬅️', '🗑️', '➡️', '🛑'];
    await sent.react('⬅️')
    await sent.react('🗑️')
    await sent.react('➡️')
    await sent.react('🛑')

    const reactionCollector = sent.createReactionCollector((reaction, user) =>
        Reactions.includes(reaction.emoji.name) && user.id == message.author.id, { time: ms('20s') });

    reactionCollector.on('end', async reactionsCollected => {
        if (!reactionsCollected.array().includes('🛑')) {
            await sent.delete()
            message.channel.send(`Stopped showing pols.`);
        }
    })

    reactionCollector.on('collect', async reaction => {
        reactionCollector.resetTimer({ time: ms('20s') });
        var embedToSend;

        switch (reaction.emoji.name) {
            case '⬅️': embedToSend = ReturnEmbed(-1); break;
            case '🗑️': embedToSend = ReturnEmbed(0); break;
            case '➡️': embedToSend = ReturnEmbed(1); break;
            case '🛑':
                sent.edit(`Stopped showing polls.`);
                reactionCollector.stop();
                return;
            default: PinguLibrary.errorLog(message.client, `polls, ListPolls(), reactionCollector.on() default case: ${reaction.emoji.name}`, message.content); break;
        }

        if (Polls.length == 0) {
            await sent.delete()
            message.channel.send(`No more polls to find!`);
            reactionCollector.stop();
        }

        //Send new embed
        await sent.edit(sent.embeds[0] = embedToSend.setFooter(`Now viewing: ${EmbedIndex + 1}/${Polls.length}`));
        sent.reactions.cache.forEach(reaction => {
            if (reaction.users.cache.size > 1)
                reaction.users.cache.forEach(user => {
                    if (user.id != message.client.user.id)
                        reaction.users.remove(user)
                })
        })

        /**@param {number} index  @returns {MessageEmbed}*/
        async function ReturnEmbed(index) {
            EmbedIndex += index;
            if (EmbedIndex <= -1) {
                EmbedIndex = Embeds.length - 1;
                index = -1;
            }
            else if (EmbedIndex >= Embeds.length) {
                EmbedIndex = 0;
                index = 1
            }
            let Embed;

            switch (index) {
                case -1: Embed = Embeds[EmbedIndex]; break;
                case 0: Embed = await DeletePoll(Embeds[EmbedIndex]); break;
                case 1: Embed = Embeds[EmbedIndex]; break;
                default: PinguLibrary.errorLog(message.client, `poll, ListPolls, reactionCollector.on(), ReturnEmbed() Ran default: ${index}`, message.content); return Embeds[EmbedIndex = 0];
            }
            return Embed;
        }
        /**@param {MessageEmbed} embed*/
        async function DeletePoll(embed) {
            const deletingPolls = Polls.find(poll => poll.id == embed.description.substring(4, embed.description.length));
            RemovePolls(message, [deletingPolls]);
            Polls = GetPGuild(message.guild).pollConfig.polls;
            Embeds = CreateEmbeds(true);

            if (!Polls.includes(deletingPolls)) {
                await sent.react('✅');
                await setTimeout(async () => await sent.reactions.cache.find(r => r.emoji.name == '✅').remove(), 1500);
                return ReturnEmbed(1);
            }
            else {
                await sent.react('❌');
                await setTimeout(async () => await sent.reactions.cache.find(r => r.emoji.name == '❌').remove(), 1500);
                return ReturnEmbed(-1);
            }
        }
    })

    /**@param {boolean} autocalled*/
    function CreateEmbeds(autocalled) {
        let Embeds = [], ToRemove = [];

        if (Polls.length == 0) return null;

        for (var i = 0; i < Polls.length; i++) {
            try {
                Embeds[i] = new MessageEmbed()
                    .setTitle(Polls[i].value)
                    .setDescription(`ID: ${Polls[i].id}`)
                    .setColor(GetPGuild(message.guild).embedColor)
                    .addField(`Verdict`, Polls[i].approved, true)
                    .addField(`Host`, Polls[i].author.toString(), true)
                    .setFooter(`Now viewing: ${i + 1}/${Polls.length}`);
            } catch (err) { PinguLibrary.errorLog(message.client, `Adding poll to Embeds`, message.content, err); ToRemove.push(Polls[i]); }
        }
        RemovePolls(message, ToRemove);
        if (!Embeds && !autocalled) return null;
        return Embeds;
    }
}

/**@param {Message} message @param {Poll[]} polls*/
async function RemovePolls(message, polls) {
    if (polls.length == 0 || polls[0] == undefined) return;

    const pGuild = PinguGuild.GetPGuild(message.guild);
    pGuild.pollConfig.polls = pGuild.pollConfig.polls.filter(p => !polls.includes(p));

    await PinguGuild.UpdatePGuildJSONAsync(message.client, message.guild, module.exports.name,
        `Removed "${polls[0].value}" from ${message.guild.name}'s polls list.`,
        `I encounted an error, while removing ${polls.id} (${polls.value}) from ${message.guild.name}'s polls list`
    );
}


//#region pGuild Methods
/**@param {Message} message @param {Poll} poll*/
function AddPollToPGuilds(message, poll) {
    PinguGuild.GetPGuild(message.guild).pollConfig.polls.push(poll);
    PinguGuild.UpdatePGuildJSON(message.client, message.guild, module.exports.name,
        `Added "${poll.value}" to "${message.guild.name}" in guilds.json`,
        `I encountered an error, while adding ${poll.value} to guilds.json`
    );
}
/**@param {Message} message @param {Poll} poll*/
function SaveVerdictToPGuilds(message, poll) {
    const pGuildPolls = PinguGuild.GetPGuild(message.guild).pollConfig.polls;

    const thispollman = pGuildPolls.find(p => p.id == poll.id);
    pGuildPolls[pGuildPolls.indexOf(thispollman)] = poll;

    PinguGuild.UpdatePGuildJSON(message.client, message.guild, this.name,
        `Successfully saved the verdict for "${poll.value}" in guilds.json`,
        `I encountered an error, while saving the verdict for "${poll.value}"`
    );
}
//#endregion