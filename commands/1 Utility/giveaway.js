﻿const { Message, MessageEmbed, User, Guild, GuildMember, Role, Channel, TextChannel } = require('discord.js'),
    { PinguGuild, PGuildMember, PRole, GiveawayConfig, Giveaway, TimeLeftObject, PinguLibrary, DiscordPermissions, PChannel } = require('../../PinguPackage'),
    ms = require('ms');

module.exports = {
    name: 'giveaway',
    cooldown: 5,
    description: 'Giveaway time!',
    usage: 'setup | list | <time> [winners] [channel] <prize>',
    guildOnly: true,
    id: 1,
    examples: ["setup", "list", "10m Discord Nitro", "24h 2w Movie tickets for 2!"],
    permissions: [
        DiscordPermissions.SEND_MESSAGES,
        DiscordPermissions.MANAGE_MESSAGES,
        DiscordPermissions.ADD_REACTIONS
    ],
    /**@param {{message: Message, args: string[], pGuild: PinguGuild}}*/
    async execute({ message, args, pGuild }) {
        // Test if all permissions are available & if all arguments are met
        let ReturnMessage = PermissionCheck(message, args);
        if (ReturnMessage != PinguLibrary.PermissionGranted) return message.author.send(ReturnMessage);

        //Is user trying to host a giveaway?
        if (!pGuild.giveawayConfig || args[0] == `setup`)
            return FirstTimeExecuted(message, args);
        else if (args[0] == "list") return ListGiveaways(message);

        //#region Variables creation
        //Get time
        const Time = args[0];
        if (args[0] != `reroll`) args.shift();

        //Declare Winners & GiveawayChannel
        let Winners = 1, giveawayChannel;
        
        //Assign Winners & Giveaway channel values, if defined
        if (args[0].endsWith('w') && !isNaN(args[0].substring(0, args[0].length - 1))) {
            Winners = args.shift();
            Winners = Winners.substring(0, Winners.length - 1);
        }

        giveawayChannel = message.guild.channels.cache.find(c =>
            c.id == args[0] ||
            c.name == args[0] ||
            c == message.mentions.channels.first()
        );
        if (giveawayChannel) args.shift();
        else giveawayChannel = message.guild.channels.cache.find(c => c.id == pGuild.giveawayConfig.channel.id) || message.channel;

        let check = {
            author: message.author,
            channel: giveawayChannel,
            client: message.client,
            content: message.content
        }
        let channelPerms = PinguLibrary.PermissionCheck(check, [DiscordPermissions.VIEW_CHANNEL]);
        if (channelPerms != PinguLibrary.PermissionGranted) return message.channel.send(channelPerms);

        check.author = message.client.user;
        channelPerms = PinguLibrary.PermissionCheck(check, [DiscordPermissions.SEND_MESSAGES, DiscordPermissions.ADD_REACTIONS]);
        if (channelPerms != PinguLibrary.PermissionGranted) return message.channel.send(channelPerms);

        //Declare and assign Prize, GiveawayCreator & Mention
        let Prize = args.join(' '),
            GiveawayCreator = message.guild.member(message.author),
            Mention = message.mentions.members.first();

        //If giveaway has a mention (Mention != null) replace ping with display name
        if (Prize.includes(`<@`))
            Prize = Prize.replace(/(<@!*[\d]{18}>)/, Mention.displayName);

        const EndsAt = new Date(Date.now() + ms(Time));

        let embed = new MessageEmbed()
            .setTitle(Prize)
            .setColor(pGuild.embedColor)
            .setDescription(
                `React with :fingers_crossed: to enter!\n` +
                `Winners: **${Winners}**\n` +
                `Ends in: ${new TimeLeftObject(new Date(Date.now()), EndsAt).toString()}\n` +
                `Hosted by ${GiveawayCreator.user}`)
            .setFooter(`Ends at: ${EndsAt}`);
        //#endregion

        //Handle response
        if (message.channel.id == giveawayChannel.id) message.delete();
        else if (args[0] == `reroll`) message.channel.send(`Rerolling giveaway...`);
        else message.channel.send(`Announcing the giveaway in <#${giveawayChannel.id}> now!`);

        //reroll
        if (args[0] == `reroll`) return Reroll(message, args, embed);

        //Announce giveaway
        giveawayChannel.send(`**Giveawayy woo**`, embed)
            .then(GiveawayMessage => {
                GiveawayMessage.react('🤞');
                PinguLibrary.consoleLog(message.client, `${GiveawayCreator.user.username} hosted a giveaway in ${message.guild.name}, #${message.channel.name}, giving "${Prize}" away`);
                SaveGiveawayToPGuilds(GiveawayMessage, Prize, GiveawayCreator, giveawayChannel);

                const interval = setInterval(() => UpdateTimer(GiveawayMessage, EndsAt, GiveawayCreator), 5000);
                setTimeout(() => AfterTimeOut(message, GiveawayMessage, Prize, Winners, embed, GiveawayCreator, interval, null), ms(Time));
            });

        /**@param {Message} GiveawayMessage @param {Date} EndsAt*/
        function UpdateTimer(GiveawayMessage, EndsAt) {
            try {
                GiveawayMessage.edit(GiveawayMessage.embeds[0]
                    .setDescription(
                        `React with :fingers_crossed: to enter!\n` +
                        `Winners: **${Winners}**\n` +
                        `Ends in: ${new TimeLeftObject(new Date(Date.now()), EndsAt).toString()}\n` +
                        `Hosted by ${GiveawayCreator.user}`
                    ));
            } catch (e) { errorLog(message.client, `Updating giveaway timer error`, message.cotent, e) }
        }
    },
};

//#region Misc Methods
/**@param {Message} message @param {string[]} args*/
function PermissionCheck(message, args) {
    const pGuildConf = PinguGuild.GetPGuild(message.guild).giveawayConfig;

    if (["reroll", "setup", "list"].includes(args[0]) || !pGuildConf)
        return PinguLibrary.PermissionGranted;
    else if (!args[0] && !args[1]) return `You didn't give me enough arguments!`;

    CheckRoleUpdates(message);

    if (!message.member.hasPermission('ADMINISTRATOR')) {
        if (!message.member.roles.cache.has(pGuildConf.hostRole.id) && PinguLibrary.isPinguDev(message.author))
            return `You don't have \`administrator\` permissions or the \`${pGuildConf.hostRole.name}\` role!`;
    }

    if (args[0].endsWith('w') && !isNaN(args[0].substring(0, args[0].length - 1)))
        args.shift();

    if (args[0].endsWith('s') && parseInt(args[0].substring(0, args[0].length - 1)) < 30)
        return 'Please specfify a time higher than 29s';
    else if (!ms(args[0]))
        return 'Please provide a valid time!';
    return PinguLibrary.PermissionGranted;

    /**@param {Message} message*/
    function CheckRoleUpdates(message) {
        pGuild = PinguGuild.GetPGuild(message.guild);
        let WinnerRole = pGuild.giveawayConfig.winnerRole,
            HostRole = pGuild.giveawayConfig.hostRole;

        WinnerRole = CheckRole(WinnerRole);
        HostRole = CheckRole(HostRole);

        PinguGuild.UpdatePGuildJSON(message.client, message.guild, module.exports.name,
            `Updated giveaway roles`,
            `I encountered and error while updating giveaway roles`
        );

        /**@param {Role} Role*/
        function CheckRole(Role) {
            if (!Role) return "undefined";
            const guildRole = message.guild.roles.cache.find(r => r.id == Role.id);
            return guildRole;
        }
    }
}
/**@param {Message} message @param {string[]} args*/
function FirstTimeExecuted(message, args) {
    if (args[0] != `setup`) message.channel.send(`**Hold on fella!**\nWe need to get ${message.guild.name} set up first!`);
    let collectorCount = 0, collector = message.channel.createMessageCollector(m => m.author.id == message.author.id, { maxMatches: 1 });
    let GiveawayHostRole, GiveawayWinnerRole, Reply, LastInput, LFRole, RoleName = "Giveaway Host", HostDone = false, Channel;

    if (HasAllArguments()) return;

    message.channel.send(`Firstly, I need to know if there's a **${RoleName}** role. You can reply \`Yes\` or \`No\` (without prefix).`)

    collector.on('collect', userInput => {
        switch (collectorCount) {
            case 0:
                Reply = userInput.content.toLowerCase() == `yes` ?
                    "Please tag the role, or send the role ID." :
                    userInput.content.toLowerCase() == `no` ?
                        `Would you like a **${RoleName}** role?` : null;
                LastInput = userInput.content.toLowerCase();
                break;
            case 1:
                LFRole = message.guild.roles.cache
                    .find(GiveawayRole => GiveawayRole == userInput.mentions.roles.first() ||
                        GiveawayRole.id == userInput.content ||
                        GiveawayRole.name == userInput.content);

                if (LFRole) Reply = `Okay, I've found ${LFRole.name}`;
                else if (userInput.content.toLowerCase() == `yes`) {
                    LFRole = RoleName;
                    Reply = "Okay, I'll make that..";
                }
                else if (userInput.content.toLowerCase() == `no`)
                    Reply = `Okay, then I won't make one.`;

                if (!HostDone) GiveawayHostRole = LFRole ? LFRole : undefined;
                else if (HostDone) GiveawayWinnerRole = LFRole ? LFRole : undefined;

                if (!HostDone) {
                    HostDone = true;
                    RoleName = "Giveaway Winner";
                    message.channel.send(Reply);
                    Reply = `Okay so, I need to know is there's a **${RoleName}** role?`;
                    collectorCount = -1;
                    LastInput = userInput.content.toLowerCase();
                }
                else {
                    message.channel.send(Reply);
                    Reply = "Do you have a seperate channel for giveaways?";
                    LastInput = userInput.content.toLowerCase();
                }
                break;
            case 2:
                Reply = userInput.content.toLowerCase() == `yes` ?
                    "Please tag the channel, or send the channel ID" :
                    userInput.content.toLowerCase() == `no` ?
                        "Would you like a channel for it?" : null;
                LastInput = userInput.content.toLowerCase();
                break;
            case 3:
                Channel = message.guild.channels.cache
                    .find(channel => channel == userInput.mentions.channels.first() ||
                        channel.id == userInput.content ||
                        channel.name == userInput.content);
                if (Channel) Reply = `Okay, I've found ${Channel}`;
                else if (userInput.content.toLowerCase() == `yes`) {
                    Reply = `Okay, then I'll make that...`;
                    Channel = "make one yes";
                }
                else if (message.content.toLowerCase() == `no`)
                    Reply = `Okay, then I won't make one.`;
                message.channel.send(Reply);

                Reply = `Alright last thing, should I allow same winners? (A user wins a giveaway can't win the next one, if you say no)`;
                break;
            case 4:
                SaveGiveawayConfig(message, GiveawayHostRole, GiveawayWinnerRole, userInput.content.toLowerCase() == "yes", Channel);
                message.channel.send(`Alright then you're all set!`);
                collector.stop();
                return;
            default:
                collector.stop("Ran default switch-case");
                PinguLibrary.errorLog(message.client, `Ran default in giveaways, collector.on, FirstTimeExecuted(), ${RoleName}, ${collectorCount}`, message.content); return;
        }

        collectorCount++;
        if (!Reply) {
            switch (collectorCount) {
                case 0: Reply = `I need to know if there's a **${RoleName}** role. \`Yes\` or \`no\`?`; break;
                case 1: Reply = LastInput == `yes` ?
                    "Please tag the role, or send the role ID." :
                    `I need to know if you would like a **${RoleName}** role.`;
                    break;
                case 3: Reply = LastInput == 'yes' ?
                    "Please tag the channel, or send the channel ID" :
                    "I need to know if you would like a channel for giveaways.";
                default: return;
            }
            collectorCount--;
        }
        message.channel.send(Reply);
    });
    collector.on('end', () => {
        if (args[0] != 'setup')
            module.exports.execute(message, args);
    })

    function HasAllArguments() {
        /*
        [0]: setup
        [1]: host
        [2]: winner
        [3]: channel
        [4]: multipleWinners
        */
        if (args.length != 5) return false;

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

        let hostRole = findRole(args[1]);
        let winnerRole = findRole(args[2]);
        let channel = findChannel(args[3]);

        SaveGiveawayConfig(message, hostRole, winnerRole, args[4] == 'true', channel);

        message.channel.send(`Setup done!`);
        return true;
    }
}
/**@param {Message} message*/
async function ListGiveaways(message) {
    let Giveaways = PinguGuild.GetPGuild(message).giveawayConfig.giveaways;
    let Embeds = CreateEmbeds(false), EmbedIndex = 0;

    if (Giveaways.length == 0 || Embeds.length == 0) return message.channel.send(`There are no giveaways saved!`);

    var sent = await message.channel.send(Embeds[EmbedIndex])
    const Reactions = ['⬅️', '🗑️', '➡️', '🛑'];
    await sent.react('⬅️');
    await sent.react('🗑️');
    await sent.react('➡️');
    await sent.react('🛑');

    const reactionCollector = sent.createReactionCollector((reaction, user) =>
        Reactions.includes(reaction.emoji.name) && user.id == message.author.id, { time: ms('20s') });

    reactionCollector.on('end', async reactionsCollected => {
        if (!reactionsCollected.array().includes('🛑')) {
            await sent.delete()
            message.channel.send(`Stopped showing giveaways.`);
        }
    });
    reactionCollector.on('collect', async reaction => {
        reactionCollector.resetTimer({ time: ms('20s') });
        var embedToSend;

        switch (reaction.emoji.name) {
            case '⬅️': embedToSend = ReturnEmbed(-1); break;
            case '🗑️': embedToSend = ReturnEmbed(0); break;
            case '➡️': embedToSend = ReturnEmbed(1); break;
            case '🛑': reactionCollector.stop(); return;
            default: PinguLibrary.errorLog(message.client, `ListGiveaways(), reactionCollector.on() default case`, message.content); break;
        }

        if (Giveaways.length == 0 || !embedToSend) {
            await sent.delete()
            message.channel.send(`No more giveaways to find!`);
            reactionCollector.stop();
        }

        //Send new embed
        embedToSend
        if (!embedToSend) reactionCollector.stop();

        await sent.edit(sent.embeds[0] = embed.setFooter(`Now viewing: ${EmbedIndex + 1}/${Giveaways.length}`))
        sent.reactions.cache.forEach(reaction => {
            if (reaction.users.cache.size > 1)
                reaction.users.cache.forEach(user => {
                    if (user.id != message.client.user.id)
                        reaction.users.remove(user)
                })
        })



        /**@param {number} index @returns {MessageEmbed}*/
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
                case -1: return Embeds[EmbedIndex]; break;
                case 0: return await DeleteGiveaway(Embeds[EmbedIndex]); break;
                case 1: return Embeds[EmbedIndex]; break;
                default: PinguLibrary.errorLog(message.client, `Ran default in ReturnEmbed()`, message.content); return Embeds[EmbedIndex = 0];
            }
        }
        /**@param {MessageEmbed} embed*/
        async function DeleteGiveaway(embed) {
            const deletingGiveaway = Giveaways.find(giveaway => giveaway.id == embed.fields[0].value);
            await RemoveGiveaways(message, [deletingGiveaway]);
            Giveaways = PinguGuild.GetPGuild(message.guild).giveawayConfig.giveaways;
            Embeds = CreateEmbeds(true);

            if (!Giveaways.includes(deletingGiveaway)) {
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

        if (Giveaways.length == 0) return null;

        for (var i = 0; i < Giveaways.length; i++) {
            try {
                const Winners = Giveaways[i].winners.join(", "),
                    Host = Giveaways[i].author.toString();
                if (!Winners) PinguLibrary.errorLog(message.client, `Couldn't find a winner to ${Giveaways[i].id} from ${message.guild.name} (${message.guild.id})`);
                Embeds[i] = new MessageEmbed()
                    .setTitle(Giveaways[i].value)
                    .setDescription(`Winner(s)`, Winners)
                    .setColor(PinguGuild.GetPGuild(message).embedColor)
                    .addField(`ID`, Giveaways[i].id, true)
                    .addField(`Host`, Host, true)
                    .setFooter(`Now viewing: ${i + 1}/${Giveaways.length}`);
            } catch (err) { PinguLibrary.errorLog(message.client, `Error while adding giveaway to Embeds`, message.content, err); ToRemove.push(Giveaways[i]); }
        }
        RemoveGiveaways(message, ToRemove);
        if (!Embeds && !autocalled) return null;
        return Embeds;
    }
}
//#endregion

//#region After waiting methods
/**@param {Message} message
 * @param {Message} GiveawayMessage
 * @param {string} Prize
 * @param {number} Winners
 * @param {MessageEmbed} embed
 * @param {GuildMember} GiveawayCreator
 * @param {NodeJS.Timeout} interval
 * @param {GuildMember} PreviousWinner*/
async function AfterTimeOut(message, GiveawayMessage, Prize, Winners, embed, GiveawayCreator, interval, PreviousWinner) {
    clearInterval(interval);
    const pGuildGiveaway = PinguGuild.GetPGuild(message.guild).giveawayConfig,
        GiveawayWinnerRole = pGuildGiveaway.winnerRole,
        allowSameWinner = pGuildGiveaway.allowSameWinner;
    let WinnerArr = [];

    let peopleReacted;
    try { peopleReacted = GiveawayMessage.reactions.cache.get('🤞').users.cache.array(); }
    catch (err) {
        await PinguLibrary.errorLog(message.client, `Fetching 🤞 reactions from giveaway`, message.content, err);
        var GiveawayCreatorDM = await GiveawayCreator.createDM();
        GiveawayCreatorDM.send(`Hi! I ran into an issue while finding a winner for your giveaway "${Prize}"... I've already contacted my developers!`);
    }

    peopleReacted = peopleReacted.filter(user =>
        !user.bot && //Not bot
        allowSameWinner != null && ( //allowSameWinner exists
            allowSameWinner || //Allow same winner
            GiveawayWinnerRole && //Giveaway role exists
            !message.guild.member(user).roles.cache.has(GiveawayWinnerRole.id) //Don't allow same winner and user doesn't have giveaway winner role
        ));

    // While there's no winner
    for (var i = 0; i < parseInt(Winners); i++) {
        let Winner;
        while (!Winner || PreviousWinner && PreviousWinner.id == Winner.id)
            Winner = FindWinner(message);

        //Winner not found
        if (Winner == `A winner couldn't be found!` && WinnerArr.length == 0) {
            GiveawayMessage.edit(embed
                .setTitle(`Unable to find a winner for ${Prize}!`)
                .setDescription(`Winner not found!`)
                .setFooter(`Giveaway ended.`)
            );
            return message.channel.send(`A winner to "**${Prize}**" couldn't be found!`);
        }
        else if (Winner == `A winner couldn't be found!`) Winner = "no one";
        WinnerArr[i] = Winner;
        peopleReacted.splice(peopleReacted.indexOf(Winner), 1);
    }

    let WinnerArrStringed = WinnerArr.join(' & ');

    //Announce Winner
    var WinnerMessage = await GiveawayMessage.channel.send(`The winner of "**${Prize}**" is no other than ${WinnerArrStringed}! Congratulations!`)
    WinnerMessage.react(PinguLibrary.getEmote(message.client, 'hypers', PinguLibrary.SavedServers.PinguSupport(message.client)));

    RemovePreviousWinners(message.guild.members.cache.filter(Member => Member.roles.cache.has(GiveawayWinnerRole.id)).array());

    let gCreatorMessage = '';
    for (var i = 0; i < WinnerArr.length; i++) {
        await message.guild.member(WinnerArr[i]).roles.add(GiveawayWinnerRole.id)
            .catch(async err => {
                if (err != `TypeError [INVALID_TYPE]: Supplied roles is not a Role, Snowflake or Array or Collection of Roles or Snowflakes.`) {
                    await PinguLibrary.errorLog(message.client, `Unable to give <@${Winner.id}> "${message.guild.name}"'s Giveaway Winner Role, ${GiveawayWinnerRole.name} (${GiveawayWinnerRole.id})`, message.content, err);
                    GiveawayCreator.user.send(`I couldn't give <@${Winner.id}> a Giveaway Winner role! I have already notified my developers.`);
                }
                //`Please give me a role above the Giveaway Winner role, or move my role above it!`
            });
        gCreatorMessage += `<@${WinnerArr[i].id}> & `;
    }
    GiveawayCreator.user.send(gCreatorMessage.substring(0, gCreatorMessage.length - 2) + ` won your giveaway, "**${Prize}**" in **${message.guild.name}**!\n${GiveawayMessage.url}`)

    //Edit embed to winner
    GiveawayMessage.edit(embed
        .setTitle(`Winner of "${Prize}"!`)
        .setDescription(`${(Winners.length == 1 ? `Winner` : `Winners`)}: ${WinnerArrStringed}\nHosted by: ${GiveawayCreator.user}`)
        .setFooter('Giveaway ended.')
    ).catch(err => PinguLibrary.errorLog(message.client, `Editing the Giveaway Message`, message.content, err)
        .then(() => GiveawayCreator.user.send(`I had an error while updating the original giveaway message... I've already notified my developers!`))
    );

    UpdatePGuildWinner(GiveawayMessage, WinnerArr);
    PinguLibrary.consoleLog(message.client, `Winner of "${Prize}" (hosted by ${GiveawayCreator.user.username}) was won by: ${WinnerArrStringed}.`);

    /**@param {Message} message @param {Message} GiveawayMessage*/
    function FindWinner(message) {
        let Winner = SelectWinner(message, peopleReacted, GiveawayWinnerRole);

        if (Winner == `A winner couldn't be found!`) return Winner;

        // If PreviousWinner roles don't exist
        if (!GiveawayWinnerRole) message.author.send(`I couldn't find a "Giveaway Winner(s)" role!\nI have selected a random winner from everyone.`);

        return WinnerArr.includes(Winner) ? null : Winner;

        /**@param {Message} message @param {User[]} peopleReacted @param {PRole} GiveawayWinnerRole*/
        function SelectWinner(message, peopleReacted, GiveawayWinnerRole) {
            if (peopleReacted.length == 0) return `A winner couldn't be found!`;

            let Winner = peopleReacted[Math.floor(Math.random() * peopleReacted.length)];

            if (!GiveawayWinnerRole) return Winner;
            else if (message.guild.member(Winner).roles.cache.has(GiveawayWinnerRole.id))
                return pGuildGiveaway.allowSameWinner ? Winner : null;
            return Winner;
        }
    }
    /**@param {GuildMember[]} WinnerArray*/
    function RemovePreviousWinners(WinnerArray) {
        for (var x = 0; x < WinnerArray.length; x++)
            WinnerArray[x].roles.remove(GiveawayWinnerRole.id);
    }
}
/**@param {Message} message @param {string[]} args  @param {MessageEmbed} embed*/
function Reroll(message, args, embed) {
    if (!args[1]) return message.author.send(`Giveaway message not found - please provide with a message ID`);

    let PreviousGiveaway = message.channel.messages.cache.find(premsg => premsg.id == parseInt(args[1]));
    if (!PreviousGiveaway) {
        PreviousGiveaway = message.channel.messages.cache.find(premsg => premsg.id == parseInt(args[1].split('/')[6]));
        if (!PreviousGiveaway)
            return message.author.send(`Unable to parse ${args[1]} as ID, or message can't be found!`);
        else if (!PreviousGiveaway.embeds[0])
            return message.author.send(`I couldn't find the giveaway embed from that message link!`);
    }

    const Giveaway = PinguGuild.GetPGuild(message.guild).giveawayConfig.giveaways.find(ga => ga.id == PreviousGiveaway.id);
    return AfterTimeOut(message, PreviousGiveaway, Giveaway.value, Giveaway.winners.length, embed, message.guild.members.cache.find(GM => GM.id == Giveaway.author.id), null, Giveaway.winners[0].toGuildMember());
}
//#endregion

//#region pGuild Methods
/**@param {Message} message @param {string} Prize @param {GuildMember} GiveawayCreator @param {TextChannel} GiveawayChannel*/
function SaveGiveawayToPGuilds(message, Prize, GiveawayCreator, GiveawayChannel) {
    const pGuild = PinguGuild.GetPGuild(message.guild);
    pGuild.giveawayConfig.giveaways.push(new Giveaway(Prize, message.id, new PGuildMember(GiveawayCreator), GiveawayChannel));

    PinguGuild.UpdatePGuildJSON(message.client, message.guild, module.exports.name,
        `pGuild.Giveaways for **${message.guild.name}** was successfully updated with the new giveaway!`,
        `Saving giveaway in ${message.guild.name}`
    );
}
/**@param {Message} GiveawayMessage @param {User[]} WinnerArr*/
function UpdatePGuildWinner(GiveawayMessage, WinnerArr) {
    const pGuild = PinguGuild.GetPGuild(GiveawayMessage.guild),
        Giveaway = pGuild.giveawayConfig.giveaways.find(giveaway => giveaway.id == GiveawayMessage.id);

    for (var i = 0; i < WinnerArr.length; i++)
        Giveaway.winners.push(new PGuildMember(GiveawayMessage.guild.member(WinnerArr[i])));

    PinguGuild.UpdatePGuildJSON(GiveawayMessage.client, GiveawayMessage.guild, module.exports.name,
        `Successfully updated **${GiveawayMessage.guild.name}**'s "${Giveaway.value}" giveaway winner in guilds.json!`,
        `Saving **${GiveawayMessage.guild.name}**'s "${Giveaway.value}" giveaway winner in guilds.json!`
    );

}
/**@param {Message} message 
 * @param {string} GiveawayHostRole 
 * @param {Role | string} GiveawayWinnerRole 
 * @param {boolean} allowSameWinner
 * @param {Channel | string} channel*/
async function SaveGiveawayConfig(message, GiveawayHostRole, GiveawayWinnerRole, allowSameWinner, channel) {
    const pGuild = PinguGuild.GetPGuild(message.guild);

    if (typeof (GiveawayHostRole) === 'string')
        GiveawayHostRole = await CreateGiveawayRole(message.guild, GiveawayHostRole);
    if (typeof (GiveawayWinnerRole) === 'string')
        GiveawayWinnerRole = await CreateGiveawayRole(message.guild, GiveawayWinnerRole);
    if (typeof (channel) === 'string')
        channel = await message.guild.channels.create(Channel, {
            reason: "Auto-created when setting up giveaways",
            type: 'text'
        }).catch(err => PinguLibrary.errorLog(mesasg.eclient, "Creating Giveaway channel", message.content, err));

    if (!GiveawayHostRole) GiveawayHostRole = "undefined";
    if (!GiveawayWinnerRole) GiveawayWinnerRole = "undefined";

    pGuild.giveawayConfig = new GiveawayConfig({
        channel: message.channel,
        allowSameWinner: allowSameWinner,
        giveaways: new Array(),
        hostRole: new PRole(GiveawayHostRole),
        winnerRole: new PRole(GiveawayWinnerRole),
        channel: new PChannel(channel)
    });

    PinguGuild.UpdatePGuildJSON(message.client, message.guild, module.exports.name,
        `Successfully saved **${message.guild.name}**'s Giveaway Host & Giveaway Winner to guild.json!`,
        `Saving **${message.guild.name}**'s Giveaway config to guild.json!`
    );

    /**@param {Guild} Guild @param {string} RoleName*/
    function CreateGiveawayRole(Guild, RoleName) {
        return Guild.roles.create({
            data: { name: RoleName },
            reason: "Auto-created when setting up giveaways"
        }).catch(err => PinguLibrary.errorLog(message.client, `Creating Giveaway role`, message.content, err));
    }
}
/**@param {Message} message @param {Giveaway[]} giveaways*/
async function RemoveGiveaways(message, giveaways) {
    if (!giveaways || giveaways.length == 0 || !giveaways[0]) return;
    const pGuild = PinguGuild.GetPGuild(message.guild);

    pGuild.giveawayConfig.giveaways = pGuild.giveawayConfig.giveaways.filter(ga => !giveaways.includes(ga));

    PinguLibrary.consoleLog(message.client, `The giveaway, ${giveaways[0].value} (${giveaways[0].id}) was removed.`);

    await PinguGuild.UpdatePGuildJSONAsync(message.client, message.guild, module.exports.name,
        `Removed ${giveaways.length} giveaways from **${message.guild.name}**'s giveaway list.`,
        `Removing ${giveaways[0].id} (${giveaways[0].value}) from **${message.guild.name}**'s giveaways list`,
    );
}
//#endregion
