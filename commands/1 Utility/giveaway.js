const { Message, MessageEmbed, User, Guild, Role, GuildMember } = require('discord.js'),
    ms = require('ms');
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
            GiveawayCreator = message.author,
            Mention = message.mentions.members.first();
        GiveawayWinnerRole = message.guild.roles.cache.find(role => role.name === 'Giveaway Winners' || role.name === 'Giveaway Winner');

        if (Prize.includes(`<@`))
            Prize = Prize.replace(/(<@!*[\d]{18}>)/, Mention.nickname || Mention.user.username ||
                                                     Mention.displayName || Mention.user.username);

        const pGuilds = require('../../guilds.json');
        const color = pGuilds.find(pguild => pguild.guildID == message.guild.id).EmbedColor;

        let embed = new MessageEmbed()
            .setTitle(Prize = Prize.substring(0, Prize.length))
            .setColor(color)
            .setDescription(`React with :fingers_crossed: to enter!\nHosted by ${GiveawayCreator}\n`)
            .setFooter(`Giveaway time set to ${Time}`);

        //reroll
        if (args[0] == `reroll`) {
            if (!args[1]) return message.channel.send(`Giveaway message not found - please provide with a message ID`)
            let PreviousGiveaway;
            PreviousGiveaway = message.channel.messages.find(premsg => premsg.id == Number.parseInt(args[1]));
            if (PreviousGiveaway == null)
                return message.channel.send(`Unable to parse ${args[1]} as ID, or message can't be found!`);
            Prize = PreviousGiveaway.embeds[0].title.substring(11, PreviousGiveaway.embeds[0].title.length - 2);
            GiveawayCreator = PreviousGiveaway.embeds[0].description.substring(41, PreviousGiveaway.embeds[0].description.length)
            return ExecuteTimeOut(message, PreviousGiveaway, Prize, embed, GiveawayCreator);
        }

        // Create Embed
        message.channel.send(`**Giveawayy woo**`);
        message.channel.send(embed)
            .then(GiveawayMessage => {
                GiveawayMessage.react('🤞');
                console.log(`${GiveawayCreator.username} hosted a giveaway in ${message.guild.name}, #${message.channel.name}, giving "${Prize}" away`);

                setTimeout(() => ExecuteTimeOut(message, GiveawayMessage, Prize, embed, GiveawayCreator), ms(Time));
            });
    },
};

/**@param {Message} message @param {string[]} args*/
function PermissionCheck(message, args) {
    if (message.channel.type === 'dm') return `I execute this command in DMs.`;

    const PermissionCheck = message.channel.permissionsFor(message.client.user),
        PermArr = ["SEND_MESSAGES", "MANAGE_MESSAGES", "ADD_REACTIONS", "MENTION_EVERYONE"];
    for (var Perm = 0; Perm < PermArr.length; Perm++)
        if (!PermissionCheck.has(PermArr[Perm]))
            return `Sorry, ${message.author}. It seems like I don't have the **${PermArr[Perm]}** permission.`;

    if (!args[0] || !args[1]) return 'Hey! You didn\'t give me enough arguments!';
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

/**@param {Message} message
 * @param {Message} GiveawayMessage
 * @param {string} Prize
 * @param {MessageEmbed} embed
 * @param {User} GiveawayCreator*/
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
    message.channel.send(`**The winner of "${Prize.substring(1, Prize.length)}" has been found!**\nCongratulations ${Winner}\n\nContact ${GiveawayMessage.embeds[0].description.substring(41, GiveawayMessage.embeds[0].description.length)} to redeem your prize!`);

    RemovePreviousWinners(message.guild.members.cache.array()
        .filter(Member => Member.roles.cache
            .find(role => role === GiveawayWinnerRole)));

    message.guild.member(Winner).roles.add(GiveawayWinnerRole)
        .then(() => {
            if (!message.guild.member(Winner).roles.cache.find(role => role === GiveawayWinnerRole))
                GiveawayCreator.send(`I couldn't give ${Winner.username} (${Winner.tag}) a Giveaway Winner role!`);
        });

    //Edit embed to winner
    GiveawayMessage.edit(embed
        .setTitle(`Winner of "${Prize}"!`)
        .setDescription(`Winner: ${Winner}\nHosted by: ${GiveawayCreator}`)
        .setFooter('Giveaway ended.')
    ).catch(error => message.channel.send(error));
    console.log(`Winner of "${Prize}" (hosted by ${GiveawayCreator.username}) was won by ${Winner.username}`);
}
/**@param {Message} message @param {Message} GiveawayMessage*/
function FindWinner(message, GiveawayMessage) {
    let Winner = SelectWinner(message, GiveawayMessage.reactions.cache.get('🤞').users.cache.array()
        .filter(User => User.id != message.client.user.id && message.guild.member(User).roles.cache.find(GiveawayWinnerRole) == null));

    if (Winner == `A winner couldn't be found!`) return Winner;

    if (!GiveawayWinnerRole) { // If PreviousWinner roles don't exist
        let ReturnMessage = `I couldn't find a "Giveaway Winner(s)" role!\nI have selected a random winner from everyone`;

        ReturnMessage += (message.channel.permissionsFor(message.guild.client.user).has('MANAGE_ROLES')) ?
            CreateGiveawayWinnerRole(message.guild) :  // If permission, make GiveawayWinnerRole role
            `, and coudn't create one ;-;`; // Tell author, bot couldn't create GiveawayWinnerRole
        message.author.send(ReturnMessage); // Return whole message
    }
    else if (message.guild.member(Winner).roles.cache.find(GiveawayWinnerRole)) // If Winner is PreviousWinner
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
    if (message.guild.members.cache.find(Winner).roles.cache.find(Role => Role == GiveawayWinnerRole) != null)
        if (peopleReacted.length > 2)
            return Winner;
        else return `A winner couldn't be found!`;
    return null;
}
/**@param {Guild} Guild @returns {string}*/
function CreateGiveawayWinnerRole(Guild) {
    Guild.createRole(new Role(Guild, {
        name: 'Giveaway Winner',
        color: 14264160,
        hoist: true,
        mentionable: true
    }))
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