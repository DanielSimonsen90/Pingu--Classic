const { Channel, Client, Guild, GuildMember, MessageEmbed, Role, TextChannel, User, Message } = require('discord.js'),
    { DiscordPermissions, Giveaway, GiveawayConfig, PChannel, PClient, PGuildMember, PRole, PinguLibrary, TimeLeftObject, PinguGuild } = require('../../PinguPackage'),
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
    /**@param {{message: Message, args: string[], pGuild: PinguGuild, pGuildClient: PClient}}*/
    async execute({ message, args, pGuild, pGuildClient }) {
        // Test if all permissions are available & if all arguments are met
        let permCheck = await PermissionCheck(message, args);
        if (permCheck != PinguLibrary.PermissionGranted) return message.author.send(permCheck);

        //Is user trying to host a giveaway?
        if (pGuild.giveawayConfig.firstTimeExecuted || args[0] == `setup`)
            return await FirstTimeExecuted(message, args, pGuild, pGuildClient);
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
        else giveawayChannel = args[0] != 'reroll' ? message.guild.channels.cache.find(c => c.id == pGuild.giveawayConfig.channel._id) || message.channel : message.channel;

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
            .setColor(pGuildClient.embedColor)
            .setDescription(
                `React with :fingers_crossed: to enter!\n` +
                `Winners: **${Winners}**\n` +
                `Ends in: ${new TimeLeftObject(new Date(Date.now()), EndsAt).toString()}\n` +
                `Hosted by ${GiveawayCreator.user}`)
            .setFooter(`Ends at`)
            .setTimestamp(EndsAt);
        //#endregion

        //Handle response
        if (args[0] == `reroll`) var rerollMessage = await message.channel.send(`Rerolling giveaway...`);
        else if (message.channel.id == giveawayChannel.id) message.delete();
        else message.channel.send(`Announcing the giveaway in <#${giveawayChannel.id}> now!`);

        //reroll
        if (args[0] == `reroll`) return await Reroll(rerollMessage, args, embed);

        //Announce giveaway
        let GiveawayMessage = await giveawayChannel.send(`**Giveawayy woo**`, embed);
        GiveawayMessage.react('🤞');
        PinguLibrary.consoleLog(message.client, `${GiveawayCreator.user.username} hosted a giveaway in ${message.guild.name}, #${message.channel.name}, giving "${Prize}" away`);
        AddGiveawayToPGuilds(GiveawayMessage, new Giveaway(Prize, GiveawayMessage.id, new PGuildMember(GiveawayCreator), giveawayChannel, EndsAt));

        const interval = setInterval(() => UpdateTimer(GiveawayMessage, EndsAt, GiveawayCreator), 5000);
        setTimeout(() => AfterTimeOut(message, GiveawayMessage, Prize, Winners, embed, GiveawayCreator, interval, null), ms(Time));

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
            } catch (e) { PinguLibrary.errorLog(message.client, `Updating giveaway timer error`, message.cotent, e) }
        }
    },
};

//#region Misc Methods
/**@param {Message} message 
 * @param {string[]} args*/
async function PermissionCheck(message, args) {
    const pGuildConf = (await PinguGuild.GetPGuild(message.guild)).giveawayConfig;

    if (pGuildConf.firstTimeExecuted || ["reroll", "setup", "list"].includes(args[0]))
        return PinguLibrary.PermissionGranted;
    else if (!args[0] && !args[1]) return `You didn't give me enough arguments!`;

    await CheckRoleUpdates(message);

    if (!message.member.hasPermission(DiscordPermissions.ADMINISTRATOR) && pGuildConf.hostRole && !message.member.roles.cache.has(pGuildConf.hostRole._id))
        return "You don't have `Administrator` permissions" + (pGuildConf.hostRole ? ` or the \`${pGuildConf.hostRole.name}\` role` : "" + "!");

    //Defined winners
    if (args[0].endsWith('w') && !isNaN(args[0].substring(0, args[0].length - 1)))
        args.shift();

    if (args[0].endsWith('s') && parseInt(args[0].substring(0, args[0].length - 1)) < 30)
        return 'Please specfify a time higher than 29s';
    else if (!ms(args[0]))
        return 'Please provide a valid time!';
    else if (!isNaN(args[0].substring(args[0].length - 1, args[0].length))) //No s,m,h provided, treat as minutes
        args[0] = args[0] + "m";
    return PinguLibrary.PermissionGranted;

    /**@param {Message} message*/
    async function CheckRoleUpdates(message) {
        let pGuild = await PinguGuild.GetPGuild(message.guild);
        let WinnerPRole = pGuild.giveawayConfig.winnerRole,
            HostPRole = pGuild.giveawayConfig.hostRole;

        let WinnerRole = CheckRole(WinnerPRole);
        let HostRole = CheckRole(HostPRole);

        if (!WinnerRole && WinnerPRole != undefined || WinnerPRole != undefined && WinnerRole || //Winner role (doesn't) exist(s)
            !HostRole && HostPRole != undefined || HostPRole != undefined && HostRole || //Host role (doesn't) exist(s)
            WinnerPRole && WinnerRole && WinnerRole.name != WinnerPRole.name || //Winner role's name changed
            HostPRole && HostPRole && HostRole.name != HostPRole.name) //Host role's name changed
            await UpdatePGuild(message.client, pGuild,
                `Updated giveaway roles`,
                `I encountered and error while updating giveaway roles`
            );


        /**@param {PRole} pRole*/
        function CheckRole(pRole) {
            if (!pRole) return undefined;
            return guildRole = message.guild.roles.cache.find(r => r.id == pRole._id);
        }
    }
}
/**@param {Message} message 
 * @param {string[]} args
 * @param {PinguGuild} pGuild
 * @param {PClient} pGuildClient*/
async function FirstTimeExecuted(message, args, pGuild, pGuildClient) {
    if (args[0] != `setup`) message.channel.send(`**Hold on fella!**\nWe need to get ${message.guild.name} set up first!`);
    let collectorCount = 0, collector = message.channel.createMessageCollector(m => m.author.id == message.author.id, { maxMatches: 1 });
    let GiveawayHostRole, GiveawayWinnerRole, Reply, LastInput, LFRole, RoleName = "Giveaway Host", HostDone = false, Channel;

    if (await HasAllArguments()) return;

    message.channel.send(`Firstly, I need to know if there's a **${RoleName}** role. You can reply \`Yes\` or \`No\` (without prefix).`)

    collector.on('collect', async userInput => {
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
                        "Would you like a channel for your giveaways?" : null;
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
                else Reply = `Okay, then I won't make one.`;
                message.channel.send(Reply);

                Reply = `Alright last thing, should I allow same winners? (A user wins a giveaway can't win the next one, if you say no)`;
                break;
            case 4:
                pGuild.giveawayConfig = await SaveGiveawayConfig(message, GiveawayHostRole, GiveawayWinnerRole, userInput.content.toLowerCase() == "yes", Channel);
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
    collector.on('end', async () => {
        message.channel.send(`Alright then you're all set!`);
        PinguLibrary.consoleLog(message.client, `"${message.guild.name}" was successfully sat up with *giveaway.`);

        if (args[0] != 'setup') module.exports.execute({ message, args, pGuild, pGuildClient });
    })

    async function HasAllArguments() {
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

        await SaveGiveawayConfig(message, hostRole, winnerRole, args[4] == 'true', channel);

        message.channel.send(`Setup done!`);
        return true;
    }
}
/**@param {Message} message*/
async function ListGiveaways(message) {
    let pGuild = await PinguGuild.GetPGuild(message.guild);
    let Giveaways = pGuild.giveawayConfig.giveaways;
    let Embeds = CreateEmbeds(false), EmbedIndex = 0;

    if (!Giveaways.length || !Embeds.length) return message.channel.send(`There are no giveaways saved!`);

    var sent = await message.channel.send(Embeds[EmbedIndex])
    const Reactions = ['⬅️', '🗑️', '➡️', '🛑'];
    Reactions.forEach(r => sent.react(r));

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
        switch (reaction.emoji.name) {
            case '⬅️': var embedToSend = await ReturnEmbed(-1); break;
            case '🗑️': embedToSend = await ReturnEmbed(0); break;
            case '➡️': embedToSend = await ReturnEmbed(1); break;
            case '🛑': reactionCollector.stop(); return;
            default: PinguLibrary.errorLog(message.client, `ListGiveaways(), reactionCollector.on() default case`, message.content); break;
        }

        if (!Giveaways.length || !embedToSend) {
            message.channel.send(`No more giveaways to find!`);
            return reactionCollector.stop();
        }

        //Send new embed
        await sent.edit(embedToSend.setFooter(`Now viewing: ${EmbedIndex + 1}/${Giveaways.length}`))
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
                case -1: return Embeds[EmbedIndex]; break;
                case 0: return await DeleteGiveaway(Embeds[EmbedIndex]); break;
                case 1: return Embeds[EmbedIndex]; break;
                default: PinguLibrary.errorLog(message.client, `Ran default in ReturnEmbed()`, message.content); return Embeds[EmbedIndex = 0];
            }
        }
        /**@param {MessageEmbed} embed*/
        async function DeleteGiveaway(embed) {
            const deletingGiveaway = Giveaways.find(giveaway => giveaway._id == embed.fields[0].value);
            Giveaways = await RemoveGiveaways(message, [deletingGiveaway]);
            Embeds = CreateEmbeds(true);

            return !Giveaways.includes(deletingGiveaway) ?
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

        if (!Giveaways.length) return null;

        for (var i = 0; i < Giveaways.length; i++) {
            try {
                const Winners = Giveaways[i].winners.map(pg => `<@${pg._id}>`).join(", ") || "No winners",
                    Host = `<@${Giveaways[i].author._id}>`;
                //if (!Winners) PinguLibrary.errorLog(message.client, `Couldn't find a winner to ${Giveaways[i].id} from ${message.guild.name} (${message.guild.id})`);
                Embeds[i] = new MessageEmbed()
                    .setTitle(Giveaways[i].value)
                    .setDescription(`**__Winner(s)__**\n` + Winners)
                    .setColor(PinguGuild.GetPClient(message.client, pGuild).embedColor)
                    .addField(`ID`, Giveaways[i]._id, true)
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

    const pGuildGiveaway = (await PinguGuild.GetPGuild(message.guild)).giveawayConfig,
        GiveawayWinnerRole = pGuildGiveaway.winnerRole,
        allowSameWinner = pGuildGiveaway.allowSameWinner;
    let WinnerArr = [];

    try { var peopleReacted = (await GiveawayMessage.reactions.cache.get('🤞').users.fetch()).array(); }
    catch (err) {
        await PinguLibrary.errorLog(message.client, `Fetching 🤞 reactions from giveaway`, message.content, err);
        var GiveawayCreatorDM = await GiveawayCreator.createDM();
        GiveawayCreatorDM.send(`Hi! I ran into an issue while finding a winner for your giveaway "${Prize}"... I've already contacted my developers!`);
    }

    let members = await message.guild.members.fetch({ user: peopleReacted });

    peopleReacted = peopleReacted.filter(user =>
        !user.bot && //Not bot
        allowSameWinner != null && ( //allowSameWinner exists
            allowSameWinner || //Allow same winner
            GiveawayWinnerRole && //Giveaway role exists
            !members.get(user.id).roles.cache.has(GiveawayWinnerRole._id) //Don't allow same winner and user doesn't have giveaway winner role
        ));

    // While there's no winner
    for (var i = 0; i < parseInt(Winners); i++) {
        var Winner;
        while (!Winner || PreviousWinner && PreviousWinner.id == Winner.id)
            Winner = FindWinner(message);

        //Winner not found
        if (Winner == `A winner couldn't be found!`) Winner = "no one";
        WinnerArr[i] = Winner;
        peopleReacted.splice(peopleReacted.indexOf(Winner), 1);
    }

    if (Winner == `no one` || !WinnerArr.length || !WinnerArr[0]) {
        GiveawayMessage.edit(embed
            .setTitle(`Unable to find a winner for "${Prize}"!`)
            .setDescription(`Winner not found!`)
            .setFooter(`Giveaway ended.`)
        );
        return message.channel.send(`A winner to "**${Prize}**" couldn't be found!`);
    }

    let WinnerArrStringed = WinnerArr.join(' & ');

    //Announce Winner
    var WinnerMessage = await GiveawayMessage.channel.send(`The winner of "**${Prize}**" is no other than ${WinnerArrStringed}! Congratulations!`)
    WinnerMessage.react(PinguLibrary.getEmote(message.client, 'hypers', PinguLibrary.SavedServers.PinguSupport(message.client)));

    RemovePreviousWinners(message.guild.members.cache.filter(Member => Member.roles.cache.has(GiveawayWinnerRole._id)).array());

    let gCreatorMessage = '';
    for (var i = 0; i < WinnerArr.length; i++) {
        await message.guild.member(WinnerArr[i]).roles.add(GiveawayWinnerRole._id)
            .catch(async err => {
                if (err != `TypeError [INVALID_TYPE]: Supplied roles is not a Role, Snowflake or Array or Collection of Roles or Snowflakes.`) {
                    await PinguLibrary.errorLog(message.client, `Unable to give <@${Winner.id}> "${message.guild.name}"'s Giveaway Winner Role, ${GiveawayWinnerRole.name} (${GiveawayWinnerRole._id})`, message.content, err);
                    GiveawayCreator.user.send(`I couldn't give <@${Winner.id}> a Giveaway Winner role! I have already notified my developers.`);
                }
                //`Please give me a role above the Giveaway Winner role, or move my role above it!`
            });
        gCreatorMessage += `<@${WinnerArr[i].id}> & `;
    }
    GiveawayCreator.user.send(gCreatorMessage.substring(0, gCreatorMessage.length - 3) + ` won your giveaway, "**${Prize}**" in **${message.guild.name}**!\n${GiveawayMessage.url}`)

    //Edit embed to winner
    GiveawayMessage.edit(embed
        .setTitle(`Winner of "${Prize}"!`)
        .setDescription(`${(Winners.length == 1 ? `Winner` : `Winners`)}: ${WinnerArrStringed}\nHosted by: ${GiveawayCreator.user}`)
        .setFooter('Giveaway ended.')
    ).catch(err => PinguLibrary.errorLog(message.client, `Editing the Giveaway Message`, message.content, err)
        .then(() => GiveawayCreator.user.send(`I had an error while updating the original giveaway message... I've already notified my developers!`))
    );

    await UpdatePGuildWinner(GiveawayMessage, WinnerArr);
    PinguLibrary.consoleLog(message.client, `Winner of "${Prize}" (hosted by ${GiveawayCreator.user.tag}) was won by: ${WinnerArr.map(u => u.tag).join(' & ')}.`);

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
            else if (message.guild.member(Winner).roles.cache.has(GiveawayWinnerRole._id))
                return pGuildGiveaway.allowSameWinner ? Winner : null;
            return Winner;
        }
    }
    /**@param {GuildMember[]} WinnerArray*/
    function RemovePreviousWinners(WinnerArray) {
        for (var x = 0; x < WinnerArray.length; x++)
            WinnerArray[x].roles.remove(GiveawayWinnerRole._id);
    }
}
/**@param {Message} rerollMessage 
 * @param {string[]} args 
 * @param {MessageEmbed} embed*/
async function Reroll(rerollMessage, args, embed) {
    if (!args[1]) return rerollMessage.edit(`Giveaway message not found - please provide with a message ID`);

    let PreviousGiveawayMessage = rerollMessage.channel.messages.cache.find(premsg => premsg.id == parseInt(args[1]));
    if (!PreviousGiveawayMessage) {
        PreviousGiveawayMessage = rerollMessage.channel.messages.cache.find(premsg => premsg.id == parseInt(args[1].split('/')[6]));
        if (!PreviousGiveawayMessage)
            return rerollMessage.author.send(`Unable to parse ${args[1]} as ID, or message can't be found!`);
        else if (!PreviousGiveawayMessage.embeds[0])
            return rerollMessage.author.send(`I couldn't find the giveaway embed from that message link!`);
    }

    const Giveaway = (await PinguGuild.GetPGuild(rerollMessage.guild)).giveawayConfig.giveaways.find(ga => ga._id == PreviousGiveawayMessage.id);
    return await AfterTimeOut(
        rerollMessage,
        PreviousGiveawayMessage,
        Giveaway.value,
        Giveaway.winners.length || 1,
        embed,
        await rerollMessage.guild.members.fetch(Giveaway.author._id),
        null,
        Giveaway.winners[0]
    );
}
//#endregion

//#region pGuild Methods
/**@param {Message} message 
 * @param {string} GiveawayHostRole 
 * @param {Role | string} GiveawayWinnerRole 
 * @param {boolean} allowSameWinner
 * @param {Channel | string} channel*/
async function SaveGiveawayConfig(message, GiveawayHostRole, GiveawayWinnerRole, allowSameWinner, channel) {
    const pGuild = await PinguGuild.GetPGuild(message.guild);

    if (typeof (GiveawayHostRole) === 'string')
        GiveawayHostRole = await CreateGiveawayRole(message.guild, GiveawayHostRole);
    if (typeof (GiveawayWinnerRole) === 'string')
        GiveawayWinnerRole = await CreateGiveawayRole(message.guild, GiveawayWinnerRole);
    if (typeof (channel) === 'string')
        channel = await message.guild.channels.create(Channel, {
            reason: "Auto-created when setting up giveaways",
            type: 'text'
        }).catch(err => PinguLibrary.errorLog(message.client, "Creating Giveaway channel", message.content, err));

    if (!GiveawayHostRole) GiveawayHostRole = undefined;
    if (!GiveawayWinnerRole) GiveawayWinnerRole = undefined;

    pGuild.giveawayConfig = new GiveawayConfig({
        firstTimeExecuted: false,
        channel: message.channel,
        allowSameWinner: allowSameWinner,
        giveaways: new Array(),
        hostRole: GiveawayHostRole ? new PRole(GiveawayHostRole) : undefined,
        winnerRole: GiveawayWinnerRole ? new PRole(GiveawayWinnerRole) : undefined,
        channel: channel ? new PChannel(channel) : undefined
    });

    await UpdatePGuild(message.client, pGuild,
        `Successfully saved **${pGuild.name}**'s Giveaway config`,
        `Failed to save **${pGuild.name}**'s Giveaway config`
    );
    return pGuild.giveawayConfig;

    /**@param {Guild} Guild 
     * @param {string} RoleName*/
    function CreateGiveawayRole(Guild, RoleName) {
        return Guild.roles.create({
            data: { name: RoleName },
            reason: "Auto-created when setting up giveaways"
        }).catch(err => PinguLibrary.errorLog(message.client, `Creating Giveaway role`, message.content, err));
    }
}
/**@param {Message} message 
 * @param {Giveaway} giveaway*/
async function AddGiveawayToPGuilds(message, giveaway) {
    const pGuild = await PinguGuild.GetPGuild(message.guild);
    pGuild.giveawayConfig.giveaways.push(giveaway);

    return await UpdatePGuild(message.client, pGuild,
        `Added new giveaway to **${message.guild.name}**'s PinguGuild.`,
        `Saving giveaway in ${message.guild.name} failed!`
    );
}
/**@param {Message} GiveawayMessage 
 * @param {User[]} WinnerArr*/
async function UpdatePGuildWinner(GiveawayMessage, WinnerArr) {
    const pGuild = await PinguGuild.GetPGuild(GiveawayMessage.guild),
        pGuildGiveaways = pGuild.giveawayConfig.giveaways;
        let giveaway = pGuildGiveaways.find(giveaway => giveaway._id == GiveawayMessage.id);

    for (var i = 0; i < WinnerArr.length; i++)
        giveaway.winners.push(new PGuildMember(GiveawayMessage.guild.member(WinnerArr[i])));

    pGuildGiveaways[pGuildGiveaways.indexOf(giveaway)] = giveaway;

    return await UpdatePGuild(GiveawayMessage.client, pGuild,
        `Successfully updated **${GiveawayMessage.guild.name}**'s "${giveaway.value}" giveaway winner`,
        `Error saving **${GiveawayMessage.guild.name}**'s "${giveaway.value}" giveaway winner!`
    );
}
/**@param {Message} message 
 * @param {Giveaway[]} giveaways*/
async function RemoveGiveaways(message, giveaways) {
    if (!giveaways || !giveaways.length || !giveaways[0]) return;
    const pGuild = await PinguGuild.GetPGuild(message.guild);

    giveaways.forEach(ga => pGuild.giveawayConfig.giveaways.splice(pGuild.giveawayConfig.giveaways.indexOf(ga), 1))

    PinguLibrary.consoleLog(message.client, `The giveaway, ${giveaways[0].value} (${giveaways[0]._id}) was removed.`);

    await UpdatePGuild(message.client, pGuild,
        `Removed ${giveaways.length} giveaways from **${message.guild.name}**'s giveaway list.`,
        `Removing ${giveaways[0]._id} (${giveaways[0].value}) from **${message.guild.name}**'s giveaways list`,
    );
    return pGuild.giveawayConfig.giveaways;
}
/**@param {Client} client
 * @param {PinguGuild} pGuild
 * @param {string} succMsg
 * @param {string} errMsg*/
async function UpdatePGuild(client, pGuild, succMsg, errMsg) {
    return await PinguGuild.UpdatePGuild(
        client,
        { giveawayConfig: pGuild.giveawayConfig },
        pGuild, module.exports.name,
        succMsg, errMsg
    );
}
//#endregion