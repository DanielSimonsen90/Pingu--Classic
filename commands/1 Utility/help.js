const { PinguGuild } = require('../../PinguPackage');

const { MessageEmbed, Message, Collection } = require('discord.js'),
    ScriptsCategorized = ["", "Utility", "Fun", "Support", "DevOnly"];


module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    usage: '[command]',
    id: 1,
    examples: ["", "giveaway", "activity"],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        //#region Create variables
        //#region Get data from guilds.json
        let color, Prefix;
        if (message.channel.type != 'dm') {
            const pGuild = GetPGuild(message);
            color = pGuild.embedColor;
            Prefix = pGuild.botPrefix;
        }
        else {
            color = 15527148;
            Prefix = "*";
        }
        //#endregion

        let embed = new MessageEmbed() //embed 
            .setColor(color)
            .setThumbnail(message.client.user.avatarURL());
        //#endregion

        switch (args.length) {
            case 0: return DefaultHelp(message, embed, Prefix); //If no argument was provided, send default help menu
            case 1: return CategoryOrSpecificHelp(message, args, message.client.commands, [], embed, Prefix); //If 1 argument is provided || if args[0] exists
            default: return message.channel.send(`Help arguments not recognized!`);
        }
    },
};

/**Default help menu
 * @param {Message} message
 * @param {MessageEmbed} embed
 * @param {string} Prefix*/
function DefaultHelp(message, embed, Prefix) {
    embed.setTitle('Pingu Help Menu!')
        .setDescription('Use these arguments to see what commands I have in a specific category!')
        .setFooter(`Developed by Simonsen Techs`);

    //Insert data for help menu
    for (var x = 1; x < 4; x++)
        embed.addField(`**__${Prefix}${ScriptsCategorized[x]}__**`, `\`${Prefix}help ${ScriptsCategorized[x]}\``, true);

    //Return embed
    return message.author.send(embed)
        .then(() => {
            if (message.channel.type == 'dm') return;
            message.reply(`I've sent you a DM with all my commands!`);
        })
        .catch(error => {
            console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
            message.reply(`It seems like I can't DM you! Do you have DMs disabled?`);
        });
}
/**Category help menu
 * @param {Message} message
 * @param {string[]} args
 * @param {Collection} commands
 * @param {any[]} data
 * @param {MessageEmbed} embed
 * @param {string} Prefix*/
function CategoryOrSpecificHelp(message, args, commands, data, embed, Prefix) {
    //If args[0] is a number, set number to text
    switch (args[0]) {
        case '1': args[0] = ScriptsCategorized[1]; break;
        case '2': args[0] = ScriptsCategorized[2]; break;
        case '3': args[0] = ScriptsCategorized[3]; break;
        case '4': args[0] = ScriptsCategorized[4]; break;
        default: break;
    }

    //Set args[0] to lowercase
    args[0] = args[0].toLowerCase();
    //Set all from ScriptsCategorized to lowercase
    for (var x = 0; x < ScriptsCategorized.length; x++)
        ScriptsCategorized[x] = ScriptsCategorized[x].toLowerCase();

    //If Pingu doesn't have args[0] as a command, and ScriptsCategorized doesn't contain it either
    if (!commands.has(args[0]) && !ScriptsCategorized.includes(args[0]))
        //Treat as unknown argument, and set to Utility
        args[0] = "utility";

    //If ScriptsCategorized has args[0] || If message.author isn't executing *help <script command>, but *help <category>
    if (!ScriptsCategorized.includes(args[0]))
        return SpecificHelp(message, args, embed, Prefix);

    //If "DevOnly" / "Banned" was used
    if (args[0] == "devonly" || args[0] == "banned")
        //Is message.author Danho?
        if (message.author.id != "245572699894710272")
            //If not, user cannot perform this help
            return message.channel.send(`Sorry ${message.author}, but you're not cool enough to use that!`)
        else args[0] = 'devonly';

    //Write all data into embed, if id matches the index of args[0] in ScriptsCategorized
    data.push(commands.map(command => {
        if (command.id == ScriptsCategorized.indexOf(args[0])) {
            let FieldContent = `"${command.description}" \n\`${Prefix}${command.name}`;
            if (command.usage) FieldContent += ` ${command.usage}`;
            embed.addField(`**__${Prefix}${command.name}__**`, `${FieldContent}\``);
        }
    }));

    //Create footer
    let Footer = `Keep in mind that I'm still learning and will eventually have new features!\nYou are now viewing page ${ScriptsCategorized.indexOf(args[0])}, being the help page of ${args[0]}.`;
    //If message.author is viewing page 3 (*help Support)
    if (ScriptsCategorized.indexOf(args[0]) <= 3)
        //Update Footer
        Footer += `Try my other help commands!\n${Prefix}help to view them!`;
    //Update embed's Footer with Footer
    embed.setFooter(Footer)
        .setDescription(`All of my nooty commands in **${args[0]}** (")>`)
        .setTitle(`Pingu Commands: ${args[0]}`);

    //Return embed
    return message.author.send(embed)
        .then(() => {
            if (message.channel.type == 'dm') return;
            message.reply(`I've sent you a DM with all my commands!`);
        })
        .catch(error => {
            console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
            message.reply(`It seems like I can't DM you! Do you have DMs disabled?`);
        });
}
/** Specific help menu
 * @param {Message} message
 * @param {string[]} args
 * @param {MessageEmbed} embed
 * @param {string} Prefix*/
function SpecificHelp(message, args, embed, Prefix) {
    //Create variables to find the specific command message.author is looking for
    const command = message.client.commands.get(args[0].toLowerCase());

    //Update embed
    embed.setTitle(Prefix + command.name)
        .setDescription(command.description)
        .addField('Usage', `${Prefix}${command.name} ${command.usage}`)
        .setFooter('Developed by Simonsen Techs');

    //Send embed
    return message.channel.send(embed);
}

/**@returns {PinguGuild} */
function GetPGuild(message) {
    const pGuilds = require('../../guilds.json');
    const pGuild = pGuilds.find(pguild => pguild.guildID == message.guild.id);
    return pGuild;
}