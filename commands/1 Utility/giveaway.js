const { Message, MessageEmbed, User, Guild, Role, GuildMember } = require('discord.js'),
    ms = require('ms'),
    fs = require('fs'),
    { Giveaway, PGuildMember, PinguGuild } = require('../../PinguPackage');
let GiveawayWinnerRole = new Role();

module.exports = {
    name: 'giveaway',
    cooldown: 5,
    description: 'Giveaway time!',
    usage: '<time> <prize>',
    guildOnly: true,
    id: 1,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        message.delete();

        // Test if all permissions are available & if all arguments are met
        let ReturnMessage = PermissionCheck(message, args);
        if (ReturnMessage != `Permission Granted`) return message.author.send(ReturnMessage);

        // Create variables
        const Time = args[0];
        if (args[0] != `reroll`) args[0] = null;

        let Prize = args.join(' '),
            GiveawayCreator = message.guild.member(message.author),
            Mention = message.mentions.members.first();
        Prize = Prize.substring(1, Prize.length);
        GiveawayWinnerRole = message.guild.roles.cache.find(role => role.name == 'Giveaway Winners' || role.name === 'Giveaway Winner');

        if (Prize.includes(`<@`))
            Prize = Prize.replace(/(<@!*[\d]{18}>)/, Mention.nickname || Mention.user.username ||
                Mention.displayName || Mention.user.username);

        const color = GetPGuild(message).embedColor;
        const EndsAt = new Date(Date.now() + ms(Time));

        let embed = new MessageEmbed()
            .setTitle(Prize)
            .setColor(color)
            .setDescription(`React with :fingers_crossed: to enter!\nHosted by ${GiveawayCreator.user}\n`)
            .setFooter(`Ends at: ${EndsAt.toTimeString()}, ${EndsAt.toDateString()}`);

        //reroll
        if (args[0] == `reroll`) return Reroll(message, args, embed);

        // Create Embed
        message.channel.send(`**Giveawayy woo**`);
        message.channel.send(embed)
            .then(GiveawayMessage => {
                GiveawayMessage.react('🤞');
                console.log(`${GiveawayCreator.user.username} hosted a giveaway in ${message.guild.name}, #${message.channel.name}, giving "${Prize}" away`);
                SaveToPGuilds(message, Prize, GiveawayCreator);

                setTimeout(() => ExecuteTimeOut(message, GiveawayMessage, Prize, embed, GiveawayCreator), ms(Time));
            });
    },
};

/**@param {Message} message @param {string[]} args*/
function PermissionCheck(message, args) {
    if (message.channel.type === 'dm') return `I execute this command in DMs.`;

    const PermissionCheck = message.channel.permissionsFor(message.client.user),
        PermArr = ["SEND_MESSAGES", "MANAGE_MESSAGES", "ADD_REACTIONS"];
    for (var Perm = 0; Perm < PermArr.length; Perm++)
        if (!PermissionCheck.has(PermArr[Perm]))
            return `Sorry, ${message.author}. It seems like I don't have the **${PermArr[Perm]}** permission.`;

    if (!args[0] || args[0] != `reroll` && !args[1]) return 'Hey! You didn\'t give me enough arguments!';
    else if (args[0] == `reroll`) return `Permission Granted`;

    if (!message.guild.member(message.author).roles.cache.find(role => role.name == 'Giveaways')) {
        if (!message.channel.permissionsFor(message.author).has('ADMINISTRATOR'))
            return `You don't have \`administrator\` permissions or a \`Giveaways\` role!`;
    }
    else if (args[0].endsWith('s')) {
        if (parseInt(args[0].substring(0, args[0].length - 1)) < 30)
            return 'Please specfify a time higher than 29s';
    }
    else if (!parseInt(args[0].substring(0, args[0].length - 1)))
        return 'Please provide a valid time!';
    return `Permission Granted`;
}

//#region After waiting methods
/**@param {Message} message
 * @param {Message} GiveawayMessage
 * @param {string} Prize
 * @param {MessageEmbed} embed
 * @param {GuildMember} GiveawayCreator*/
function ExecuteTimeOut(message, GiveawayMessage, Prize, embed, GiveawayCreator) {
    let Winner;
    GiveawayWinnerRole = message.guild.roles.cache.find(role => role.name === 'Giveaway Winners' || role.name === 'Giveaway Winner') ||
        CreateGiveawayWinnerRole(message.guild); //Recreate role incase it was just made

    // While there's no winner
    while (!Winner) Winner = FindWinner(message, GiveawayMessage);

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
    GiveawayMessage.channel.send(`**The winner of "${Prize}" has been found!**\nCongratulations ${Winner}\n\nContact ${GiveawayMessage.embeds[0].description.substring(41, GiveawayMessage.embeds[0].description.length)} to redeem your prize!`);

    RemovePreviousWinners(message.guild.members.cache.array()
        .filter(Member => Member.roles.cache.has(GiveawayWinnerRole)));

    message.guild.member(Winner).roles.add(GiveawayWinnerRole)
        .then(() => GiveawayCreator.user.send(`<@${Winner.id}> won your giveaway, "**${Prize}**" in **${message.guild.name}**!`))
        .catch(() => GiveawayCreator.user.send(
            `I couldn't give <@${Winner.id}> a Giveaway Winner role!\n` +
            `Please give me a role above the Giveaway Winner role, or move my role above it!`
        ));

    //Edit embed to winner
    GiveawayMessage.edit(embed
        .setTitle(`Winner of "${Prize}"!`)
        .setDescription(`Winner: ${Winner}\nHosted by: ${GiveawayCreator.user}`)
        .setFooter('Giveaway ended.')
    ).catch(error => message.channel.send(error));
    UpdatePGuildWinner(message, Winner);
    console.log(`Winner of "${Prize}" (hosted by ${GiveawayCreator.user.username}) was won by ${Winner.username}`);
}
/**@param {Message} message @param {Message} GiveawayMessage*/
function FindWinner(message, GiveawayMessage) {
    let peopleReacted;
    try {
        peopleReacted = GiveawayMessage.reactions.cache.get('🤞').users.cache.array()
            .filter(User => !message.guild.member(User).roles.cache.has(GiveawayWinnerRole));
    } catch (error) {
        message.channel.send(error);
    }
    let Winner = SelectWinner(message, peopleReacted);

    if (Winner == `A winner couldn't be found!`) return Winner;

    if (!GiveawayWinnerRole) { // If PreviousWinner roles don't exist
        let ReturnMessage = `I couldn't find a "Giveaway Winner(s)" role!\nI have selected a random winner from everyone`;

        ReturnMessage += (message.channel.permissionsFor(message.guild.client.user).has('MANAGE_ROLES')) ?
            CreateGiveawayWinnerRole(message.guild) :  // If permission, make GiveawayWinnerRole role
            `, and coudn't create one ;-;`; // Tell author, bot couldn't create GiveawayWinnerRole
        message.author.send(ReturnMessage); // Return whole message
    }
    else if (message.guild.member(Winner).roles.cache.has(GiveawayWinnerRole)) // If Winner is PreviousWinner
        Winner = null;
    return Winner;
}
/**@param {Message} message @param {User[]} peopleReacted*/
function SelectWinner(message, peopleReacted) {
    let Winner = peopleReacted[Math.floor(Math.random() * peopleReacted.length)];

    if (Winner.id == message.client.user.id) {
        if (peopleReacted.length === 1) // Are there other winners?
            return `A winner couldn't be found!`;
        else while (Winner.id == message.client.user.id)
            Winner = peopleReacted[Math.floor(Math.random() * peopleReacted.length)];
    }
    if (!message.guild.member(Winner).roles.cache.has(Role => Role == GiveawayWinnerRole))
        if (peopleReacted.length > 1)
            return Winner;
        else return `A winner couldn't be found!`;
    return null;
}
/**@param {Guild} Guild @returns {string}*/
function CreateGiveawayWinnerRole(Guild) {
    Guild.roles.create({
        name: 'Giveaway Winner',
        color: 14264160,
        hoist: true,
        mentionable: true
    })
        .then(Role => {
            GiveawayWinnerRole = Role;
            return ', and created a "Giveaway Winner" role.';
        })
        .catch(error => { return `, but it ran catch(): ${error.message}`; });
    return `, I even waited man`;
}
/**@param {GuildMember[]} WinnerArray*/
function RemovePreviousWinners(WinnerArray) {
    for (var x = 0; x < WinnerArray.length; x++)
        WinnerArray[x].roles.remove(GiveawayWinnerRole);
}
/**@param {Message} message @param {string[]} args  @param {MessageEmbed} embed*/
function Reroll(message, args, embed) {
    if (!args[1]) return message.channel.send(`Giveaway message not found - please provide with a message ID`)
    let PreviousGiveaway;
    PreviousGiveaway = message.channel.messages.cache.find(premsg => premsg.id == parseInt(args[1]));
    if (!PreviousGiveaway) {
        PreviousGiveaway = message.channel.messages.cache.find(premsg => premsg.id == parseInt(args[1].split('/')[6]));
        if (!PreviousGiveaway)
            return message.channel.send(`Unable to parse ${args[1]} as ID, or message can't be found!`);
        else if (!PreviousGiveaway.embeds[0])
            return message.channel.send(`I couldn't find the giveaway embed from that message link!`);
    }
    const Prize = PreviousGiveaway.embeds[0].title.substring(11, PreviousGiveaway.embeds[0].title.length - 2);
    const GiveawayCreator = PreviousGiveaway.embeds[0].description.substring(41, PreviousGiveaway.embeds[0].description.length)
    return ExecuteTimeOut(message, PreviousGiveaway, Prize, embed, GiveawayCreator);
}
//#endregion

//#region pGuild Methods
/**@param {Message} message @param {string} Prize @param {GuildMember} GiveawayCreator*/
function SaveToPGuilds(message, Prize, GiveawayCreator) {
    const pGuilds = GetPGuilds();
    const pGuild = GetPGuild(message);
    pGuild.giveaways[pGuild.giveaways.length] = new Giveaway(Prize, message.id, new PGuildMember(GiveawayCreator));

    //Update guilds.json
    fs.writeFile('guilds.json', '', err => {
        if (err) console.log(err);
        else fs.appendFile('guilds.json', JSON.stringify(pGuilds, null, 2), err => {
            message.client.guilds.cache.find(guild => guild.id == `460926327269359626`).owner.createDM().then(DanhoDM => {
                if (err) DanhoDM.send(`I encountered and error while saving a giveaway in ${message.guild.name}:\n\n${err}`);
                else console.log(`pGuild.Giveaways for "${message.guild.name}" was successfully updated with the new giveaway!`);
            });
        });
    })
}
/**@param {Message} message @param {User} Winner*/
function UpdatePGuildWinner(message, Winner) {
    const pGuilds = GetPGuilds();
    const pGuild = GetPGuild(message);
    pGuild.giveaways.find(giveaway => giveaway.id == message.id).winners[0] = new PGuildMember(message.guild.member(Winner));

    //Update guilds.json
    fs.writeFile('guilds.json', '', err => {
        if (err) console.log(err);
        else fs.appendFile('guilds.json', JSON.stringify(pGuilds, null, 2), err => {
            message.client.guilds.cache.find(guild => guild.id == `460926327269359626`).owner.createDM().then(DanhoDM => {
                if (err) DanhoDM.send(`I encountered and error while saving a giveaway in ${message.guild.name}:\n\n${err}`);
                else console.log(`pGuild.Giveaways for "${message.guild.name}" was successfully updated with ${Winner.tag} as winner!`);
            });
        });
    });
}

/**@param {Message} message @returns {PinguGuild[]}*/
function GetPGuilds() {
    const pGuilds = require('../../guilds.json');
    return pGuilds;
}
/**@param {Message} message*/
function GetPGuild(message) {
    return GetPGuilds().find(pg => pg.guildID == message.guild.id);
}
//#endregion