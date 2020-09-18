const { Message, MessageEmbed, User, Guild, GuildMember, Role } = require('discord.js'),
    { PinguGuild, PGuildMember, PRole, GiveawayConfig, Giveaway, TimeLeftObject } = require('../../PinguPackage'),
    { isString } = require('util'), ms = require('ms'), fs = require('fs');
//const { GiveawaysManager } = require('discord-giveaways')

module.exports = {
    name: 'giveaway',
    cooldown: 5,
    description: 'Giveaway time!',
    usage: '<time> <prize>',
    guildOnly: true,
    id: 1,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        // Test if all permissions are available & if all arguments are met
        let ReturnMessage = PermissionCheck(message, args);
        if (ReturnMessage != `Permission Granted`) return message.author.send(ReturnMessage);

        const pGuild = GetPGuild(message);
        if (pGuild.giveawayConfig.firstTimeExecuted || args[0] == `setup`)
            return FirstTimeExecuted(message, args);
        else if (args[0] == "list") return ListGiveaways(message);

        //#region Variables creation
        const Time = args[0];
        if (args[0] != `reroll`) args.shift();

        let Prize = args.join(' '),
            GiveawayCreator = message.guild.member(message.author),
            Mention = message.mentions.members.first();

        if (Prize.includes(`<@`))
            Prize = Prize.replace(/(<@!*[\d]{18}>)/, Mention.nickname || Mention.user.username ||
                Mention.displayName || Mention.user.username);

        const color = pGuild.embedColor;
        const EndsAt = new Date(Date.now() + ms(Time));

        let embed = new MessageEmbed()
            .setTitle(Prize)
            .setColor(color)
            .setDescription(
                `React with :fingers_crossed: to enter!\n` +
                `Ends in: ${new TimeLeftObject(new Date(Date.now()), EndsAt).toString()}\n` +
                `Hosted by ${GiveawayCreator.user}`)
            .setFooter(`Ends at: ${EndsAt}`);
        //#endregion

        message.delete();

        //reroll
        if (args[0] == `reroll`) return Reroll(message, args, embed);

        //Announce giveaway
        message.channel.send(`**Giveawayy woo**`, embed)
            .then(GiveawayMessage => {
                GiveawayMessage.react('🤞');
                console.log(`${GiveawayCreator.user.username} hosted a giveaway in ${message.guild.name}, #${message.channel.name}, giving "${Prize}" away`);
                SaveGiveawayToPGuilds(GiveawayMessage, Prize, GiveawayCreator);

                const interval = setInterval(() => UpdateTimer(GiveawayMessage, EndsAt, GiveawayCreator), 5000);
                setTimeout(() => ExecuteTimeOut(message, GiveawayMessage, Prize, embed, GiveawayCreator, interval, null), ms(Time));
            });

        /**@param {Message} GiveawayMessage @param {Date} EndsAt*/
        function UpdateTimer(GiveawayMessage, EndsAt) {
            try {
                GiveawayMessage.edit(GiveawayMessage.embeds[0]
                    .setDescription(
                        `React with :fingers_crossed: to enter!\n` +
                        `Ends in: ${new TimeLeftObject(new Date(Date.now()), EndsAt).toString()}\n` +
                        `Hosted by ${GiveawayCreator.user}`
                    ));
            } catch (e) { console.log(e); }
        }
    },
};

//#region Misc Methods
/**@param {Message} message @param {string[]} args*/
function PermissionCheck(message, args) {
    const PermArr = ["SEND_MESSAGES", "MANAGE_MESSAGES", "ADD_REACTIONS"],
        pGuildConf = GetPGuild(message).giveawayConfig;
    for (var Perm = 0; Perm < PermArr.length; Perm++)
        if (!message.channel.permissionsFor(message.client.user).has(PermArr[Perm]))
            return `Sorry, ${message.author}. It seems like I don't have the **${PermArr[Perm]}** permission.`;

    const OtherArguments = ["reroll", "setup", "list"];
    if (OtherArguments.includes(args[0]) || pGuildConf.firstTimeExecuted)
        return "Permission Granted";
    else if (!args[0] && !args[1]) return `Hey! You didn't give me enough arguments!`;

    CheckRoleUpdates(message);

    if (!message.member.hasPermission('ADMINISTRATOR')) {
        if (!message.member.roles.cache.has(pGuildConf.hostRole.id))
            return `You don't have \`administrator\` permissions or the \`${pGuildConf.hostRole.name}\` role!`;
    }
    else if (args[0].endsWith('s') && parseInt(args[0].substring(0, args[0].length - 1)) < 30)
        return 'Please specfify a time higher than 29s';
    else if (!ms(args[0]))
        return 'Please provide a valid time!';
    return `Permission Granted`;

    /**@param {Message} message*/
    function CheckRoleUpdates(message) {
        const pGuilds = GetPGuilds(),
            pGuild = GetPGuild(message);
        let WinnerRole = pGuild.giveawayConfig.winnerRole,
            HostRole = pGuild.giveawayConfig.hostRole;

        WinnerRole = CheckRole(WinnerRole);
        HostRole = CheckRole(HostRole);

        UpdatePGuildsJSON(message, pGuilds,
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
    if (!args[0] == `setup`) return message.channel.send(`**Hold on fella!**\nWe need to get ${message.guild.name} set up first!`);
    let collectorCount = 0,
        collector = message.channel.createMessageCollector(m => m.author.id == message.author.id, { maxMatches: 1 });

    let GiveawayHostRole, GiveawayWinnerRole, Reply, LastInput, LFRole,
        RoleName = "Giveaway Host", HostDone = false;
    message.channel.send(`Firstly, I need to know if there's a **${RoleName}** role. You can reply \`Yes\` or \`No\` (without prefix).`)

    collector.on('collect', userInput => {
        switch (collectorCount) {
            case 0:
                Reply = userInput.content.toLowerCase() == `yes` ?
                    "Please tag the role, or send the role ID." :
                    `Would you like a **${RoleName}** role?`;
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
                else Reply = `Okay, then I won't make one.`;

                if (!HostDone) GiveawayHostRole = LFRole ? LFRole : undefined;
                else if (HostDone) GiveawayWinnerRole = LFRole ? LFRole : undefined;

                message.channel.send(Reply);

                if (!HostDone) {
                    HostDone = true;
                    RoleName = "Giveaway Winner";
                    Reply = `Okay so, I need to know is there's a **${RoleName}** role?`;
                    collectorCount = -1;
                }
                else if (HostDone) {
                    if (!GiveawayHostRole) {
                        SaveGiveawayRolesToPGuilds(message, GiveawayHostRole, GiveawayWinnerRole, true);
                        Reply = `Alright then you're all set!`;
                        collector.stop();
                        break;
                    }
                    Reply = `Alright last thing, should I allow repeated winners?`;
                }
                break;
            case 2:
                SaveGiveawayRolesToPGuilds(message, GiveawayHostRole, GiveawayWinnerRole, userInput.content.toLowerCase() == "yes");
                Reply = `Alright then you're all set!`;
                collector.stop();
                break;
            default:
                collector.stop("Ran default switch-case");
                console.log(`Ran default in giveaways, collector.on, ${RoleName}`); return;
        }

        collectorCount++;
        if (!Reply) {
            switch (userInput) {
                case 0: Reply = `I need to know if there's a **${RoleName}** role. \`Yes\` or \`no\`?`; break;
                case 1: Reply = LastInput == `yes` ?
                    "Please tag the role, or send the role ID." :
                    `I need to know if you would like a **${RoleName}** role.`;
                    break;
                default: return;
            }
        }
        message.channel.send(Reply);
    });
}
/**@param {Message} message*/
function ListGiveaways(message) {
    let Giveaways = GetPGuild(message).giveawayConfig.giveaways;
    let Embeds = CreateEmbeds(false), EmbedIndex = 0;

    if (!Embeds) return message.channel.send(`There are no giveaways saved!`);

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
                sent.delete().then(() => message.channel.send(`Stopped showing giveaways.`));
        })
        reactionCollector.on('collect', reaction => {
            reactionCollector.resetTimer({ time: ms('20s') });
            var embedToSend;

            switch (reaction.emoji.name) {
                case '⬅️': embedToSend = ReturnEmbed(-1); break;
                case '🗑️': embedToSend = ReturnEmbed(0); break;
                case '➡️': embedToSend = ReturnEmbed(1); break;
                case '🛑':
                    sent.edit(`Stopped showing giveaways.`);
                    reactionCollector.stop();
                    return;
                default: message.channel.send(`reactionCollector.on() default case`); break;
            }

            if (Giveaways.length == 0) {
                sent.delete().then(() => message.channel.send(`No more giveaways to find!`));
                reactionCollector.stop();
            }

            //Send new embed
            embedToSend.then(embed => {
                sent.edit(sent.embeds[0] = embed.setFooter(`Now viewing: ${EmbedIndex + 1}/${Giveaways.length}`)).then(() => {
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
                    case 0: Embed = await DeleteGiveaway(Embeds[EmbedIndex]); break;
                    case 1: Embed = Embeds[EmbedIndex]; break;
                    default: message.channel.send(`Ran default in ReturnEmbed()`); return Embeds[EmbedIndex = 0];
                }
                return Embed;
            }

            /**@param {MessageEmbed} embed*/
            async function DeleteGiveaway(embed) {
                const deletingGiveaway = Giveaways.find(giveaway => giveaway.id == embed.title);
                RemoveGiveaways(message, [deletingGiveaway]);
                Giveaways = GetPGuild(message).giveawayConfig.giveaways;
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

    })

    /**@param {boolean} autocalled*/
    function CreateEmbeds(autocalled) {
        let Embeds = [], ToRemove = [];

        if (Giveaways.length == 0)
            return null;

        for (var i = 0; i < Giveaways.length; i++) {
            try {
                const Winners = Giveaways[i].winners.join(", "),
                    Host = Giveaways[i].author.toString();
                Embeds[i] = new MessageEmbed()
                    .setTitle(Giveaways[i].id)
                    .setDescription(Giveaways[i].value)
                    .setColor(GetPGuild(message).embedColor)
                    .addField(`Winner(s)`, Winners, true)
                    .addField(`Host`, Host, true)
                    .setFooter(`Now viewing: ${i + 1}/${Giveaways.length}`);
            } catch { ToRemove.push(Giveaway[i]); }
        }
        if (ToRemove.length != 0) RemoveGiveaways(message, ToRemove);
        if (!Embeds && !autocalled) return null;
        return Embeds;
    }
}
//#endregion

//#region After waiting methods
/**@param {Message} message
 * @param {Message} GiveawayMessage
 * @param {string} Prize
 * @param {MessageEmbed} embed
 * @param {GuildMember} GiveawayCreator
 * @param {NodeJS.Timeout} interval
 * @param {GuildMember} PreviousWinner*/
function ExecuteTimeOut(message, GiveawayMessage, Prize, embed, GiveawayCreator, interval, PreviousWinner) {
    clearInterval(interval);
    const pGuildGiveaway = GetPGuild(message).giveawayConfig,
        GiveawayWinnerRole = pGuildGiveaway.winnerRole;
    let Winner;

    // While there's no winner
    while (!Winner || PreviousWinner && isString(Winner) && PreviousWinner.id == Winner.id)
        Winner = FindWinner(message, GiveawayMessage);

    //Winner not found
    if (Winner == `A winner couldn't be found!`) {
        GiveawayMessage.edit(embed
            .setTitle(`Unable to find a winner for ${Prize}!`)
            .setDescription(`Winner not found!`)
            .setFooter(`Giveaway ended.`)
        );
        return message.channel.send(`A winner to "**${Prize}**" couldn't be found!`);
    }

    //Announce Winner
    GiveawayMessage.channel.send(`The winner of "**${Prize}**" is no other than ${Winner}! Congratulations!`)
        .then(sent => sent.react(sent.client.guilds.cache
            .find(guild => guild.id == '756383096646926376').emojis.cache
            .find(emote => emote.name == 'hypers')
        ));

    RemovePreviousWinners(message.guild.members.cache.filter(Member => Member.roles.cache.has(GiveawayWinnerRole.id)).array());

    message.guild.member(Winner).roles.add(GiveawayWinnerRole.id)
        .then(() => GiveawayCreator.user.send(`<@${Winner.id}> won your giveaway, "**${Prize}**" in **${message.guild.name}**!`))
        .catch(e => {
            if (e != `TypeError [INVALID_TYPE]: Supplied roles is not a Role, Snowflake or Array or Collection of Roles or Snowflakes.`)
                GiveawayCreator.user.send(`I couldn't give <@${Winner.id}> a Giveaway Winner role!\n` + e);
            //`Please give me a role above the Giveaway Winner role, or move my role above it!`
        });

    //Edit embed to winner
    GiveawayMessage.edit(embed
        .setTitle(`Winner of "${Prize}"!`)
        .setDescription(`Winner: ${Winner}\nHosted by: ${GiveawayCreator.user}`)
        .setFooter('Giveaway ended.')
    ).catch(error => message.channel.send(error));
    UpdatePGuildWinner(GiveawayMessage, Winner);
    console.log(`Winner of "${Prize}" (hosted by ${GiveawayCreator.user.username}) was won by ${Winner.username}`);

    /**@param {Message} message @param {Message} GiveawayMessage*/
    function FindWinner(message, GiveawayMessage) {
        const GiveawayWinnerRole = GetPGuild(message).giveawayConfig.winnerRole;
        let peopleReacted;
        try {
            peopleReacted = GiveawayMessage.reactions.cache.get('🤞').users.cache
                .filter(User => !message.guild.member(User).roles.cache.has(GiveawayWinnerRole)).array();
        } catch (error) { message.channel.send(error); }
        let Winner = SelectWinner(message, peopleReacted, GiveawayWinnerRole);

        if (Winner == `A winner couldn't be found!`) return Winner;

        if (!GiveawayWinnerRole)  // If PreviousWinner roles don't exist
            message.author.send(`I couldn't find a "Giveaway Winner(s)" role!\nI have selected a random winner from everyone`);
        else if (message.guild.member(Winner).roles.cache.has(GiveawayWinnerRole)) // If Winner is PreviousWinner
            Winner = null;
        return Winner;


        /**@param {Message} message @param {User[]} peopleReacted @param {Role} GiveawayWinnerRole*/
        function SelectWinner(message, peopleReacted, GiveawayWinnerRole) {
            let Winner = peopleReacted[Math.floor(Math.random() * peopleReacted.length)];

            if (Winner.id == message.client.user.id)
                return peopleReacted.length == 1 ? `A winner couldn't be found!` : null; // Are there other winners?
            else if (!GiveawayWinnerRole)
                return Winner;
            else if (message.guild.member(Winner).roles.cache.has(GiveawayWinnerRole))
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
    if (!args[1]) return message.author.send(`Giveaway message not found - please provide with a message ID`)
    let PreviousGiveaway;
    PreviousGiveaway = message.channel.messages.cache.find(premsg => premsg.id == parseInt(args[1]));
    if (!PreviousGiveaway) {
        PreviousGiveaway = message.channel.messages.cache.find(premsg => premsg.id == parseInt(args[1].split('/')[6]));
        if (!PreviousGiveaway)
            return message.author.send(`Unable to parse ${args[1]} as ID, or message can't be found!`);
        else if (!PreviousGiveaway.embeds[0])
            return message.author.send(`I couldn't find the giveaway embed from that message link!`);
    }

    const Giveaway = GetPGuild(message).giveawayConfig.giveaways.find(ga => ga.id == PreviousGiveaway.id);
    return ExecuteTimeOut(message, PreviousGiveaway, Giveaway.value, embed, message.guild.members.cache.find(GM => GM.id == Giveaway.author.id), null, Giveaway.winners[0].toGuildMember());
}
//#endregion

//#region pGuild Methods

//#region Specific
/**@param {Message} message @param {string} Prize @param {GuildMember} GiveawayCreator*/
function SaveGiveawayToPGuilds(message, Prize, GiveawayCreator) {
    const pGuilds = GetPGuilds();
    const pGuild = GetPGuild(message);
    pGuild.giveawayConfig.giveaways[pGuild.giveawayConfig.giveaways.length] = new Giveaway(Prize, message.id, new PGuildMember(GiveawayCreator));

    UpdatePGuildsJSON(message, pGuilds,
        `pGuild.Giveaways for "${message.guild.name}" was successfully updated with the new giveaway!`,
        `I encountered and error while saving a giveaway in ${message.guild.name}`
    );
}
/**@param {Message} message @param {User} Winner*/
function UpdatePGuildWinner(message, Winner) {
    const pGuilds = GetPGuilds(),
        pGuild = GetPGuild(message),
        Giveaway = pGuild.giveawayConfig.giveaways.find(giveaway => giveaway.id == message.id);
    Giveaway.winners[0] = new PGuildMember(message.guild.member(Winner));

    UpdatePGuildsJSON(message, pGuilds,
        `Successfully updated "${message.guild.name}"'s "${Giveaway.value}" giveaway winner in guilds.json!`,
        `I encountered an error while saving "${message.guild.name}"'s "${Giveaway.value}" giveaway winner in guilds.json!`
    );

}
/**@param {Message} message @param {string} GiveawayHostRole @param {Role | string} GiveawayWinnerRole @param {boolean} allowRepeatedWinners*/
async function SaveGiveawayRolesToPGuilds(message, GiveawayHostRole, GiveawayWinnerRole, allowRepeatedWinners) {
    const pGuilds = GetPGuilds();
    const pGuild = GetPGuild(message);

    if (isString(GiveawayHostRole))
        GiveawayHostRole = await CreateGiveawayRole(message.guild, GiveawayHostRole);
    if (isString(GiveawayWinnerRole))
        GiveawayWinnerRole = await CreateGiveawayRole(message.guild, GiveawayWinnerRole);

    if (!GiveawayHostRole) GiveawayHostRole = "undefined";
    if (!GiveawayWinnerRole) GiveawayWinnerRole = "undefined";

    pGuild.giveawayConfig = new GiveawayConfig({
        firstTimeExecuted: false,
        allowSameWinner = allowRepeatedWinners,
        giveaways: new Array(),
        hostRole: new PRole(GiveawayHostRole),
        winnerRole: new PRole(GiveawayWinnerRole)
    });

    UpdatePGuildsJSON(message, pGuilds,
        `Successfully saved "${message.guild.name}"'s Giveaway Host & Giveaway Winner to guild.json!`,
        `I encountered an error, while saving "${message.guild.name}"'s Giveaway Host & Giveaway Winner to guild.json!`
    );

    /**@param {Guild} Guild @param {string} RoleName*/
    function CreateGiveawayRole(Guild, RoleName) {
        return Guild.roles.create({
            data: { name: RoleName }
        })
            .catch(err => { return err; });
    }
}
/**@param {Message} message @param {Giveaway[]} giveaways*/
function RemoveGiveaways(message, giveaways) {
    const pGuilds = GetPGuilds(), newGiveaways = [];
    const pGuild = GetPGuild(message);
    var pGuildGiveaways = pGuild.giveawayConfig.giveaways;

    pGuildGiveaways.forEach(ga => {
        if (!giveaways.includes(ga))
            newGiveaways.push(ga);
    });
    pGuild.giveawayConfig.giveaways = newGiveaways;

    console.log('Giveaway Removed');

    UpdatePGuildsJSON(message, pGuilds,
        `Removed ${giveaways.length} giveaways from ${message.guild.name}'s giveaway list.`,
        `I encounted an error, while removing ${giveaways.id} (${giveaways.value}) from ${message.guild.name}'s giveaways list`
    );
}
//#endregion

//#region General
/**@param {Message} message @returns {PinguGuild[]}*/
function GetPGuilds() {
    return require('../../guilds.json');
}
/**@param {Message} message*/
function GetPGuild(message) {
    return GetPGuilds().find(pg => pg.guildID == message.guild.id);
}
/**@param {Message} message @param {PinguGuild[]} pGuilds @param {string} SuccMsg @param {string} ErrMsg*/
function UpdatePGuildsJSON(message, pGuilds, SuccMsg, ErrMsg) {
    fs.writeFile('guilds.json', '', err => {
        if (err) console.log(err);
        else fs.appendFile('guilds.json', JSON.stringify(pGuilds, null, 4), err => {
            message.client.guilds.cache.find(guild => guild.id == `460926327269359626`).owner.createDM().then(DanhoDM => {
                if (err) DanhoDM.send(`${ErrMsg}:\n\n${err}`);
                else console.log(SuccMsg);
            });
        });
    });
}
//#endregion

//#endregion