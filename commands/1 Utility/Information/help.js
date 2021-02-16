const { MessageEmbed, Message } = require('discord.js');
const { PinguGuild, PinguLibrary, PClient, CommandIDs } = require('PinguPackage');
const fs = require('fs');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    usage: '[category | command]',
    id: 1,
    examples: ["", "giveaway", "activity"],
    /**@param {{message: Message, args: string[], pGuild: PinguGuild, pGuildClient: PClient}}*/
    async execute({ message, args, pGuild, pGuildClient }) {
        //#region Create variables
        let color = pGuildClient && pGuildClient.embedColor || PinguLibrary.DefaultEmbedColor;
        let prefix = pGuildClient && pGuildClient.prefix || PinguLibrary.DefaultPrefix(message.client);

        let embed = new MessageEmbed()
            .setColor(color)
            .setThumbnail(message.client.user.avatarURL());
        //#endregion

        switch (args.length) {
            case 0: return CategoryHelp(message, embed, prefix, getCommandsPath(message)); //If no argument was provided, send default help menu
            default: return CategoryOrSpecificHelp(message, args, embed, prefix); //If 1 argument is provided || if args[0] exists
        }
    },
};

/**@param {Message} message
 * @param {string[]} args
 * @param {MessageEmbed} embed
 * @param {string} prefix*/
function CategoryOrSpecificHelp(message, args, embed, prefix) {
    args[0] = args[0].toLowerCase();
    let mainCategories = getMainCategories(message);
    let category = mainCategories.find(c => c.name.includes(args[0]));
    category.name = category.name.split(' ')[1];

    //Find category
    if (!category)
        return message.client.commands.find(cmd => [cmd.name, ...cmd.aliases].includes(args[0])) ?
            CommandHelp(message, args, embed, prefix) :
            message.channel.send(`I couldn't find what you were looking for!`);

    //If "DevOnly" was used
    if (args[0] == CommandIDs.DevOnly.toString() && !PinguLibrary.isPinguDev(message.author))
        //If not, user cannot perform this help
        return message.channel.send(`Sorry ${message.author}, but you're not cool enough to use that!`);

    return CategoryHelp(message, embed, prefix, category.path);

    //Write all data into embed, if id matches the index of args[0] in CategoryNames
    message.client.commands
        .filter(cmd => cmd.id == args[0])
        .forEach(command =>
            embed.addField(
                `**${prefix}${command.name}**`,
                `${(`${command.description} \n\`${prefix}${command.name}` +
                    (command.usage ? ` ${command.usage}` : "")
                )}\``
            )
        );

    //Create footer
    let footer = args[0] <= 3 ?
        `Try my other help commands! — ${prefix}help to view them!` :
        `You are now viewing page ${args[0]}, being the help page of ${category.name}.\n`;

    //Update embed's Footer with Footer
    embed.setFooter(footer)
        .setDescription(`All of my nooty commands in **${CategoryNames[args[0]]}** (")>`)
        .setTitle(`Pingu Commands: ${category.name}`);

    //Return embed
    return message.channel.send(embed)
        .catch(err => {
            PinguLibrary.errorLog(message.client, `Could not send help DM to ${message.author.tag}.`, message.content, err);
            message.reply(`It seems like I can't DM you! Do you have DMs disabled?`);
        });
}
/**@param {Message} message
 * @param {MessageEmbed} embed
 * @param {string} prefix
 * @param {string} path*/
function CategoryHelp(message, embed, prefix, path) {
    embed.setTitle('Pingu Help Menu!')
        .setFooter(`Developed by Simonsen Techs`);

    let pathFolder = new Category(path); //Path folder
    let categories = pathFolder.subCategories.map(category => new Category(category.path)) //Get path's sub categories to category classes
        .filter(cat => !cat.scripts.map(cmd => cmd.id).includes(CommandIDs.DevOnly) || PinguLibrary.isPinguDev(message.author)); //If a category has a DevOnly command && author isn't PinguDev, don't include it

    embed.setDescription(`**Use these arguments to get more help!**\n\n` + categories.map(category =>
        `**${category.name}**\n` +

        //Category has sub categories
        `${(category.subCategories.length ? `__Subcategories__\n` : ``)}` +
        category.subCategories.map(sub => `${prefix}help ${sub.name}`).join('\n') +

        //Category has commands
        `${(category.scripts.lastIndexOf ? `__Commands__\n` : ``)}` +
        category.scripts.map(cmd => `${prefix}help ${cmd.name}`).join('\n')
    ).join('\n'));

    //Return embed
    return message.channel.send(embed)
        .catch(err => {
            PinguLibrary.errorLog(message.client, `Unable to send help DM to ${message.author.tag}.`, message.content, err);
            message.reply(`It seems like I can't DM you! Do you have DMs disabled?`);
        });
}
/**@param {Message} message
 * @param {string[]} args
 * @param {MessageEmbed} embed
 * @param {string} prefix*/
function CommandHelp(message, args, embed, prefix) {
    //Create variables to find the specific command message.author is looking for
    const command = message.client.commands.get(args[0].toLowerCase());
    if (!command) return message.channel.send(`Command not recognized!`);

    //Update embed
    embed.setTitle(prefix + command.name)
        .setDescription(
            "**Description**\n" +
            "```\n" + command.description + "\n```\n" +
            "\n**Usage**\n" +
            `${prefix}${command.name} ${command.usage}\n` +
            (command.aliases.length ?
                "\n**Aliases**\n" +
                command.aliases.forEach(alias => `${prefix}${alias} ${command.usage}\n`)
                : "") +
            (command.examples.length ?
                "\n**Examples**\n" +
                command.examples.forEach(example => `${prefix}${command.name} ${example}\n`)
                : "")
        ).setFooter('Developed by Simonsen Techs');

    //Send embed
    return message.channel.send(embed);
}

/**@param {Message} message*/
function getCommandsPath(message) {
    let pathSplit = message.client.commands.get(module.exports.name).path.split('/');
    pathSplit.shift();
    pathSplit.pop();
    return pathSplit.map(() => '../').join('');
}
/**@param {Message} message*/
function getMainCategories(message) {
    return new Category(getCommandsPath(message)).subCategories;
}

class Category {
    /**@param {string} path*/
    constructor(path) {
        let splitPath = path.split('/');
        this.name = splitPath[splitPath.length - 1];

        let folder = fs.readdirSync(path);
        this.subCategories = folder.filter(file => !file.toLowerCase().includes('archived') && !file.includes('.')).map(file => { return { name: file, path: `${path}/${file}` } });
        this.scripts = GetScripts();

        /**@returns {import('pingu-discord.js-addons').PinguCommand[]} */
        function GetScripts() {
            return folder.filter(file => file.endsWith('.js')).map(script => require(`${path}/${script}`));
        }
    }
}