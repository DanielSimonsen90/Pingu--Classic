const { Message, MessageEmbed, Role } = require('discord.js'),
    { PinguGuild, Poll, PollConfig, PRole, TimeLeftObject, PGuildMember } = require('../../PinguPackage');
    ms = require('ms'), { isString } = require('util'),

module.exports = {
    name: 'poll',
    cooldown: 5,
    description: 'Create a poll for users to react',
    usage: '<setup> | <list> | <time> <question>',
    guildOnly: true,
    id: 1,
    example: ["setup", "list", "10m Am I asking a question?"],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        //Permission check
        const PermResponse = PermissionCheck(message, args), pGuild = GetPGuild(message);
        if (PermResponse != `Permission Granted`) return message.channel.send(PermResponse);
        else if (args[0] == 'setup' || pGuild.pollConfig.firstTimeExecuted)
            return FirstTimeExecuted(message, args);
        else if (args[0] == "list") return ListPolls(message);

        //Create scrubby variables
        const Time = args.shift();
        let Question = args.join(" ");
        message.delete();

        const color = GetPGuild(message).embedColor,
            EndsAt = new Date(Date.now() + ms(Time));

        //Create Embed
        let Embed = new MessageEmbed()
            .setTitle(Question)
            .setColor(color)
            .setDescription(
                `Brought to you by <@${message.author.id}>\n` +
                `Time left: ${new TimeLeftObject(new Date(Date.now()), EndsAt).toString()}`)
            .setFooter(`Ends at: ${EndsAt}`);

        //Send Embed and react.
        message.channel.send(Embed).then(PollMessage => {
            PollMessage.react('👍').then(() => PollMessage.react('👎'));
            console.log(`${message.author.tag} hosted a poll in "${message.guild.name}": ${Question}`);
            AddPollToPGuilds(message, new Poll(Question, PollMessage.id, new PGuildMember(message.guild.member(message.author))));

            const interval = setInterval(() => UpdateTimer(PollMessage, EndsAt, new PGuildMember(message.guild.member(message.author))), 5000);
            setTimeout(() => OnTimeOut(Embed, PollMessage, interval), ms(Time));
        })
        /**@param {Message} PollMessage @param {Date} EndsAt @param {PGuildMember} Host*/
        function UpdateTimer(PollMessage, EndsAt, Host) {
            try {
                PollMessage.edit(PollMessage.embeds[0]
                    .setDescription(
                        `Brought to you by <@${Host.id}>\n` +
                        `Time left: ${new TimeLeftObject(new Date(Date.now()), EndsAt).toString()}`
                    ));
            } catch (e) { console.log(e); }
        }
    },
};
/**@param {Message} message @param {string[]} args*/
function PermissionCheck(message, args) {
    const PermArr = ["SEND_MESSAGES", "MANAGE_MESSAGES"],
        PermArrMsg = ["send messages", "manage messages"];
    for (var x = 0; x < PermArr.length; x++)
        if (!message.channel.permissionsFor(message.client.user).has(PermArr[x]))
            return `Hey! I don't have permission to **${PermArrMsg}** in #${message.channel.name}!`;

    const pGuild = PinguGuild.GetPGuild(message);
    if (pGuild.pollConfig.firstTimeExecuted || args[0] == 'setup' || args[0] == "list")
        return `Permission Granted`;

    if (pGuild.pollConfig.pollRole && !message.guild.member(message.author).roles.cache.has(pGuild.pollConfig.pollRole.id) && //pollRole exists and author doesn't have it
        !message.channel.permissionsFor(message.author).has('ADMINISTRATOR')) //author doesn't have Administrator
        return `You don't have \`ADMINISTRATOR\` permissions or a \`Polls\` role!`;
    else if (!pGuild.pollConfig.pollRole && message.channel.permissionsFor(message.author).has('ADMINISTRATOR'))  //pollRole doesn't exist && author has Administrator
        return "You don't have `ADMINISTRATOR` permission!";
    else if (!args[1]) return 'Please provide a poll question!';
    else if (args[0].endsWith('s') && parseInt(args[0].substring(0, args[0].length - 1)) < 30)
        return 'Please specfify a time higher than 29s';
    else if (!ms(args[0])) return 'Please provide a valid time!';
    return `Permission Granted`;
}
/**@param {Message} message @param {string[]} args*/
function FirstTimeExecuted(message, args) {
    if (args[0] != `setup`) return message.channel.send(`**Hold on fella!**\nWe need to get ${message.guild.name} set up first!`);
    let collector = message.channel.createMessageCollector(m => m.author.id == message.author.id, { maxMatches: 1 }),
        collectorCount = 0, Reply, LastInput;
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
                SaveSetupToPGuilds(message, PollsRole);
                break;
            default: collector.stop("Ran default switch-case");
                console.log(`Ran default in polls, collector.on`); return;
        }

        collectorCount++;
        message.channel.send(Reply);
        if (collectorCount == 2) collector.stop();
    });
    collector.on('end', () => message.channel.send(`Alright you're good to go!`));

    /**@param {Message} message @returns {Promise<Role>}*/
    function MakePollsRole(message) {
        return message.guild.roles.create({
            data: { name: 'Polls' }
        }).catch(err => { return err; });
    }
    /**@param {Message} message @param {Role | string | undefined} PollsRole*/
    async function SaveSetupToPGuilds(message, PollsRole) {
        if (isString(PollsRole))
            PollsRole = await MakePollsRole(message);
        PollsRole = PollsRole ? new PRole(PollsRole) : "undefined";

        PinguGuild.GetPGuild(message).pollConfig = new PollConfig({
            firstTimeExecuted: false,
            pollRole: PollsRole,
            polls: new Array()
        });

        PinguGuild.UpdatePGuildsJSON(message, GetPGuilds(),
            `Successfully updated guilds.json with ${message.guild.name}'s pollConfig.`,
            `I encountered an error, while saving ${message.guild.name}'s pollConfig to guilds.json`
        );
    }
}
/**@param {MessageEmbed} Embed @param {Message} PollMessage @param {string} Poll*/
function OnTimeOut(Embed, PollMessage, interval) {
    clearInterval(interval);

    //Defining Verdict
    const poll = GetPGuild(PollMessage).pollConfig.polls.find(p => p.id == PollMessage.id),
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
function ListPolls(message) {
    let Polls = PinguGuild.GetPGuild(message).pollConfig.polls,
        Embeds = CreateEmbeds(false), EmbedIndex = 0;

    if (!Embeds || Embeds.length == 0) return message.channel.send(`There are no polls saved!`);

    message.channel.send(Embeds[EmbedIndex]).then(sent => {
        const Reactions = ['⬅️', '🗑️', '➡️', '🛑'];
        sent.react('⬅️').then(() =>
            sent.react('🗑️').then(() =>
                sent.react('➡️').then(() =>
                    sent.react('🛑')
                )
            )
        );

        const reactionCollector = sent.createReactionCollector((reaction, user) =>
            Reactions.includes(reaction.emoji.name) && user.id == message.author.id, { time: ms('20s') });

        reactionCollector.on('end', reactionsCollected => {
            if (!reactionsCollected.array().includes('🛑'))
                sent.delete().then(() => message.channel.send(`Stopped showing pols.`));
        })
        reactionCollector.on('collect', reaction => {
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
                default: message.channel.send(`reactionCollector.on() default case`); break;
            }

            if (Polls.length == 0) {
                sent.delete().then(() => message.channel.send(`No more polls to find!`));
                reactionCollector.stop();
            }

            //Send new embed
            embedToSend.then(embed => {
                sent.edit(sent.embeds[0] = embed.setFooter(`Now viewing: ${EmbedIndex + 1}/${Polls.length}`)).then(() => {
                    sent.reactions.cache.forEach(reaction => {
                        if (reaction.users.cache.size > 1)
                            reaction.users.cache.forEach(user => {
                                if (user.id != message.client.user.id)
                                    reaction.users.remove(user)
                            })
                    })
                })
            })

            /**@param {number} index*/
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
                    default: message.channel.send(`Ran default in ReturnEmbed()`); return Embeds[EmbedIndex = 0];
                }
                return Embed;
            }
            /**@param {MessageEmbed} embed*/
            async function DeletePoll(embed) {
                const deletingPolls = Polls.find(poll => poll.id == embed.description.substring(4, embed.description.length));
                RemovePolls(message, [deletingPolls]);
                Polls = GetPGuild(message).pollConfig.polls;
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

    })

    /**@param {boolean} autocalled*/
    function CreateEmbeds(autocalled) {
        let Embeds = [], ToRemove = [];

        if (Polls.length == 0)
            return null;

        for (var i = 0; i < Polls.length; i++) {
            try {
                Embeds[i] = new MessageEmbed()
                    .setTitle(Polls[i].value)
                    .setDescription(`ID: ${Polls[i].id}`)
                    .setColor(GetPGuild(message).embedColor)
                    .addField(`Verdict`, Polls[i].approved, true)
                    .addField(`Host`, Polls[i].author.toString(), true)
                    .setFooter(`Now viewing: ${i + 1}/${Polls.length}`);
            } catch { ToRemove.push(Polls[i]); }
        }
        RemovePolls(message, ToRemove);
        if (!Embeds && !autocalled) return null;
        return Embeds;
    }
    /**@param {Message} message @param {Poll[]} polls*/
    async function RemovePolls(message, polls) {
        if (polls.length == 0 || polls[0] == undefined) return;

        const pGuild = PinguGuild.GetPGuild(message);
        pGuild.pollConfig.polls = pGuild.pollConfig.polls.filter(p => !polls.includes(p));

        await PinguGuild.UpdatePGuildsJSONAsync(message,
            `Removed "${polls[0].value}" from ${message.guild.name}'s polls list.`,
            `I encounted an error, while removing ${polls.id} (${polls.value}) from ${message.guild.name}'s polls list`
        );
    }
}

//#region pGuild Methods
/**@param {Message} message @param {Poll} poll*/
function AddPollToPGuilds(message, poll) {
    PinguGuild.GetPGuild(message).pollConfig.polls.push(poll);
    PinguGuild.UpdatePGuildsJSON(message,
        `Added "${poll.value}" to "${message.guild.name}" in guilds.json`,
        `I encountered an error, while adding ${poll.value} to guilds.json`
    );
}
/**@param {Message} message @param {Poll} poll*/
function SaveVerdictToPGuilds(message, poll) {
    const pGuildPolls = PinguGuild.GetPGuild(message).pollConfig.polls;

    const thispollman = pGuildPolls.find(p => p.id == poll.id);
    pGuildPolls[pGuildPolls.indexOf(thispollman)] = poll;

    PinguGuild.UpdatePGuildsJSON(message,
        `Successfully saved the verdict for "${poll.value}" in guilds.json`,
        `I encountered an error, while saving the verdict for "${poll.value}"`
    );
}
//#endregion