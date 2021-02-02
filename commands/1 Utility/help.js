const { PinguGuild, PinguLibrary, PClient } = require('../../PinguPackage');

const { MessageEmbed, Message } = require('discord.js'),
    { CategoryNames } = require('../4 DevOnly/update');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    usage: '[category | command]',
    id: 1,
    examples: ["", "giveaway", "activity"],
    /**@param {{message: Message, args: string[], pGuild: PinguGuild, pGuildClient: PClient}}*/
    async execute({ message, args, pGuild, pGuildClient }) {
        //#region Create variables
        let color, prefix;

        if (message.channel.type != 'dm') {
            color = pGuildClient.embedColor;
            prefix = pGuildClient.prefix;
        }
        if (!color) color = PinguLibrary.DefaultEmbedColor;
        if (!prefix) prefix = PinguLibrary.DefaultPrefix;

        let embed = new MessageEmbed()
            .setColor(color)
            .setThumbnail(message.client.user.avatarURL());
        //#endregion

        switch (args.length) {
            case 0: return DefaultHelp(message, embed, prefix); //If no argument was provided, send default help menu
            case 1: return CategoryOrSpecificHelp(message, args, embed, prefix); //If 1 argument is provided || if args[0] exists
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
        embed.addField(`**__${Prefix}${CategoryNames[x]}__**`, `\`${Prefix}help ${CategoryNames[x]}\``, true);

    //Return embed
    return message.channel.send(embed)
        .catch(err => {
            PinguLibrary.errorLog(message.client, `Unable to send help DM to ${message.author.tag}.`, message.content, err);
            message.reply(`It seems like I can't DM you! Do you have DMs disabled?`);
        });
}
/**Category help menu
 * @param {Message} message
 * @param {string[]} args
 * @param {MessageEmbed} embed
 * @param {string} Prefix*/
function CategoryOrSpecificHelp(message, args, embed, Prefix) {
    args[0] = args[0].toLowerCase();

    //Find category
    switch (args[0]) {
        case '1': case 'utility': args[0] = 1; break;
        case '2': case 'fun':     args[0] = 2; break;
        case '3': case 'support': args[0] = 3; break;
        case '4': case 'devonly': args[0] = 4; break;
        default:
            //Argument is specific command?
            if (message.client.commands.has(args[0]))
                return SpecificHelp(message, args, embed, Prefix);
            return message.channel.send(`I couldn't find what you were looking for!`);
    }

    //If "DevOnly" / "Banned" was used
    if (args[0] == 4 && !PinguLibrary.isPinguDev(message.author))
        //If not, user cannot perform this help
        return message.channel.send(`Sorry ${message.author}, but you're not cool enough to use that!`);

    //Write all data into embed, if id matches the index of args[0] in CategoryNames
    let data = [];
    data.push(message.client.commands.map(command => {
        if (command.id == args[0]) {
            let FieldContent = `${command.description} \n\`${Prefix}${command.name}`;
            if (command.usage) FieldContent += ` ${command.usage}`;
            embed.addField(`**${Prefix}${command.name}**`, `${FieldContent}\``);
        }
    }));

    //Create footer
    let Footer = `Keep in mind that I'm still learning and will eventually have new features!\n` +
        `You are now viewing page ${args[0]}, being the help page of ${CategoryNames[args[0]]}.\n`;
    //If message.author is viewing page 3 (*help Support)
    if (args[0] <= 3)
        //Update Footer
        Footer += `Try my other help commands!\n${Prefix}help to view them!`;
    //Update embed's Footer with Footer
    embed.setFooter(Footer)
        .setDescription(`All of my nooty commands in **${CategoryNames[args[0]]}** (")>`)
        .setTitle(`Pingu Commands: ${CategoryNames[args[0]]}`);

    //Return embed
    return message.channel.send(embed)
        .catch(err => {
            PinguLibrary.errorLog(message.client, `Could not send help DM to ${message.author.tag}.`, message.content, err);
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