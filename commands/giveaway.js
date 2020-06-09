const Discord = require('discord.js'),
    ms = require('ms');
module.exports = {
    name: 'giveaway',
    cooldown: 5,
    description: 'Giveaway time!',
    usage: '<time> <prize>',
    guildOnly: true,
    id: 1,
    execute(message, args) {
        message.delete();

        // Test if all permissions are available & if all arguments are met
        let ReturnMessage = PermissionCheck(message, args);
        if (ReturnMessage !== null)
            return message.author.send(ReturnMessage);

        // Create variables
        const Time = args[0];
        if (args[0] != `reroll`) args[0] = null;
        const GiveawayCreator = message.author,
            PreviousWinnerRole = message.guild.roles.find(role => role.name === 'Giveaway Winners' || role.name === 'Giveaway Winner'); // Create "PreviousWinner"

        let Prize = args.join(' '),
            Mention = message.mentions.members.first();
        if (Prize.includes(`<@`)) 
            Prize = Prize.replace(/(<@!*[\d]{18}>)/, Mention.nickname || Mention.user.username || 
                                                     Mention.displayName || Mention.user.username);

        let embed = new Discord.RichEmbed()
            .setTitle(Prize = Prize.substring(0, Prize.length))
            .setColor(0xfeff00)
            .setDescription(`React with :fingers_crossed: to enter!\nHosted by ${GiveawayCreator}\n`)
            .setFooter(`Crazy giveaway wow - set to ${Time}`);

        //reroll
        if (args[0] == `reroll`) {
            if (!args[1]) return message.channel.send(`Giveaway message not found - please provide with a message ID`)
            let PreviousGiveaway;
            try { PreviousGiveaway = message.channel.messages.find(premsg => premsg.id == Number.parseInt(args[1])); }
            catch { return message.channel.send(`Unable to parse ${args[1]} as ID!`) }
            Prize = PreviousGiveaway.embeds[0].title.substring(11, PreviousGiveaway.embeds[0].title.length - 2);
            return ExecuteTimeOut(message, PreviousGiveaway, PreviousWinnerRole, Prize, embed, GiveawayCreator);
        }

        // Create Embed
        message.channel.send(`**Giveawayy woo**`);
        message.channel.send(embed)
            .then(GiveawayMessage => {
                GiveawayMessage.react('🤞');

                setTimeout(() => {
                    ExecuteTimeOut(message, GiveawayMessage, PreviousWinnerRole, Prize, embed, GiveawayCreator)
                }, ms(Time));
            });
    },
};

function PermissionCheck(message, args) {
    if (message.channel.type === 'dm') return `I execute this command in DMs.`;
        
    const PermissionCheck = message.channel.memberPermissions(message.guild.client.user),
        PermArr = ["SEND_MESSAGES", "MANAGE_MESSAGES", "ADD_REACTIONS", "MENTION_EVERYONE"];
    for (var Perm = 0; Perm < PermArr.length; Perm++)
        if (!PermissionCheck.has(PermArr[Perm]))
            return `Sorry, ${message.author}. It seems like I don't have the **${PermArr[Perm]}** permission.`;

    if (!args[0] || !args[1]) return 'Hey! You didn\'t give me enough arguments!';
    else if (args[0] == `reroll`) return null;

    if (!message.guild.member(message.author).roles.find(role => role.name == 'Giveaways')) {
        if (!message.channel.memberPermissions(message.author).has('ADMINISTRATOR'))
            return `You don't have \`administrator\` permissions or a \`Giveaways\` role!`;
    }
    else if (args[0].endsWith('s')) {
        if (parseInt(args[0].substring(0, args[0].length - 1)) < 30)
            return 'Please specfify a time higher than 29s';
    }
    else if (!parseInt(args[0].substring(0, args[0].length - 1)))
        return 'Please provide a valid time!';
    return null;
    
}

function ExecuteTimeOut(message, GiveawayMessage, PreviousWinnerRole, Prize, embed, GiveawayCreator) {
    let Winner;

    // While there's no winner
    while (!Winner) Winner = FindWinner(message, GiveawayMessage, PreviousWinnerRole);

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
    message.channel.send(`**The winner of "${Prize.substring(1, Prize.length)}" has been found!**\nCongratulations ${Winner}\n\nContact ${GiveawayMessage.embeds[0].description} to redeem your prize!`);
    RemovePreviousWinners(message, Winner, PreviousWinnerRole);
    message.guild.member(Winner).addRole(PreviousWinnerRole).then(() => {
        if (!message.guild.member(Winner).roles.find(role => role === PreviousWinnerRole))
            GiveawayCreator.send(`I couldn't give ${Winner.username} (${Winner.tag}) a Giveaway Winner role!`);
    });

    //Edit embed to winner
    GiveawayMessage.edit(embed
        .setTitle(`Winner of "${Prize}"!`)
        .setDescription(`Winner: ${Winner}`)
        .setFooter('Giveaway ended.')
    ).catch(error => { message.channel.send(error); });
}
function FindWinner(message, GiveawayMessage, PreviousWinnerRole) {
    let Winner = SelectWinner(message, GiveawayMessage.reactions.get('🤞').users.array());

    if (Winner == `A winner couldn't be found!`) return Winner;

    if (!PreviousWinnerRole) { // If PreviousWinner roles don't exist
        let ReturnMessage = `I couldn't find a "Giveaway Winner(s)" role!\nI have selected a random winner from everyone`;

        ReturnMessage += (message.channel.memberPermissions(message.guild.client.user).has('MANAGE_ROLES')) ?
            CreatePreviousWinnerRole(message) :  // If permission, make PreviousWinner role
            `, and coudn't create one ;-;`; // Tell author, bot couldn't create PreviousWinner
        message.author.send(ReturnMessage); // Return whole message
    }
    else if (message.guild.member(Winner).roles.find('name', PreviousWinnerRole)) // If Winner is PreviousWinner
        Winner = null;
    return Winner;
}
function SelectWinner(message, peopleReacted) {
    let Winner = peopleReacted[Math.floor(Math.random() * peopleReacted.length)];

    if (Winner.id == message.client.user.id) {
        if (peopleReacted.length === 1) // Are there other winners?
            return `A winner couldn't be found!`;
        else while (Winner.id == message.client.user.id)
            Winner = peopleReacted[Math.floor(Math.random() * peopleReacted.length)];
    }
    return Winner;
}
function CreatePreviousWinnerRole(message) {
    message.guild.createRole(
        new Discord.Role(message.guild, {
            name: 'Giveaway Winner',
            hoist: true,
            mentionable: true
        })
    );
    return ', and created a "Giveaway Winner" role.';
}

function RemovePreviousWinners(message, Winner, PreviousWinnerRole) {
    var WinnerArray = message.guild.members.array()
        .filter(Member => Member.roles
            .find(role => role === PreviousWinnerRole))

    for (var x = 0; x < WinnerArray.length; x++)
        WinnerArray[x].removeRole(PreviousWinnerRole);
}