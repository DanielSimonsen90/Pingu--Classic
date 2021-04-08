const { MessageEmbed, Message } = require('discord.js');
const { PinguLibrary, PinguCommand, PinguClient, PinguUser } = require('PinguPackage');
const fs = require('fs');

module.exports = new PinguCommand('help', 'Utility', 'List all of my commands or info about a specific command.', {
    usage: '[category | command]',
    examples: ["", "giveaway", "Fun"]
}, async ({ client, message, args, pAuthor, pGuildClient }) => {
    //#region Create variables
        let color = pGuildClient && pGuildClient.embedColor || client.DefaultEmbedColor;
        let prefix = pGuildClient && pGuildClient.prefix || client.DefaultPrefix;

    let embed = new MessageEmbed()
        .setColor(color)
        .setThumbnail(client.user.avatarURL());
    //#endregion

    switch (args.length) {
        case 0: return CategoryHelp(message, embed, prefix, getCommandsPath(), pAuthor); //If no argument was provided, send default help menu
        default: return CategoryOrSpecificHelp(message, args, embed, prefix, 'DevOnly', pAuthor); //If 1 argument is provided || if args[0] exists
    }
});

/**@param {Message} message
 * @param {string[]} args
 * @param {MessageEmbed} embed
 * @param {string} prefix
 * @param {import('PinguPackage').CommandCategories devOnlyType
 * @param {PinguUser} pAuthor*/
function CategoryOrSpecificHelp(message, args, embed, prefix, devOnlyType, pAuthor) {
    args[0] = args[0].toLowerCase();
    let client = PinguClient.ToPinguClient(message.client);

    /**@param {SubCategory[]} arr
     * @returns {SubCategory}*/
    let getCategory = (arr) => {
        if (!arr) return null;
        let result = arr.find(c => c.name.toLowerCase().includes(args[0]));

        if (!result)
            for (var subCategory of arr) {
                result = getCategory(new Category(subCategory.path).subCategories);
                if (result) return result;
            }
        return result;
    }

    let category = getCategory(getMainCategories());

    //Find category
    if (!category) {
        let command = client.commands.find(cmd => [...cmd.aliases || [], cmd.name].includes(args[0]));
        if (command) {
            args[0] = command.name.toLowerCase();
            return CommandHelp(message, args, embed, prefix);
        }
        return message.channel.send(`I couldn't find what you were looking for!`);
    }

    //If "DevOnly" was used
    if (args[0] == devOnlyType && !PinguLibrary.isPinguDev(message.author))
        //If not, user cannot perform this help
        return message.channel.send(`Sorry ${message.author}, but you're not cool enough to use that!`);

    return CategoryHelp(message, embed, prefix, category.path, pAuthor);
}
/**@param {Message} message
 * @param {MessageEmbed} embed
 * @param {string} prefix
 * @param {string} path
 * @param {PinguUser} pAuthor*/
function CategoryHelp(message, embed, prefix, path, pAuthor) {
    let pathFolder = new Category(path); //Path folder
    let categories = pathFolder.subCategories.length && pathFolder.subCategories.map(category => new Category(category.path)) || [pathFolder] //Get path's sub categories to category classes
        .filter(cat => !cat.scripts.map(cmd => cmd.category).includes('DevOnly') || PinguLibrary.isPinguDev(message.author)) //If a category has a DevOnly command && author isn't PinguDev, don't include it
        .filter(cat => !cat.scripts.map(cmd => cmd.category).includes('GuildSpecific') || cat.scripts.filter(cmd => pAuthor.sharedServers.map(pg => pg._id).includes(cmd.specificGuildID))) //If a category has a GuildSpecific command && author isn't in that guild, don't include it

    if (!isNaN(parseInt(pathFolder.name[0])))
        pathFolder.name = pathFolder.name.split(' ')[1];


    embed.setTitle('Pingu Help Menu! - ' + Uppercased(pathFolder.name))
        .setDescription(`**Use these arguments to get more help!**\n\n` + categories.map(category =>
            `**__${category.name}__**\n` +

            //Category has sub categories
            `${(category.subCategories && category.subCategories.length ? `**Subcategories**\n` + "```\n" +
                (category.subCategories.map(sub => `${prefix}help ${sub.name}`).join('\n') + '\n```') :
                "")}` +

            //Category has commands
            `${(category.scripts && category.scripts.length ? `**Commands**\n` + "```\n" +
                (category.scripts.map(cmd => `${prefix}help ${cmd.name}`).join('\n') + '\n```\n') :
                "")}`
        ).join('\n'))
        .setFooter(`Developed by Simonsen Techs`);

    //Return embed
    return message.channel.send(embed)
        .catch(err => {
            PinguLibrary.errorLog(message.client, `Unable to send help DM to ${message.author.tag}.`, message.content, err, {
                params: { message, embed, prefix, path },
                additional: { pathFolder, categories }
            });
            return message.reply(`It seems like I can't DM you! Do you have DMs disabled?`);
        });
}
/**@param {Message} message
 * @param {string[]} args
 * @param {MessageEmbed} embed
 * @param {string} prefix*/
function CommandHelp(message, args, embed, prefix) {
    let client = PinguClient.ToPinguClient(message.client);

    //Create variables to find the specific command message.author is looking for
    const command = client.commands.get(args[0].toLowerCase());
    if (!command) return message.channel.send(`Command not recognized!`);

    //Update embed
    embed.setTitle(prefix + command.name)
        .setDescription(
            "**Description**\n" +
            command.description + "\n" +
            "\n**Usage**\n" +
            "```\n" + `${prefix}${command.name} ${command.usage}\n` + "```" +
            (command.aliases && command.aliases.length ?
                "\n**Aliases**\n" +
                "```\n" +
                command.aliases.map(alias => `${prefix}${alias} ${command.usage}`).join('\n') +
                "\n```"
                : "") +
            (command.examples.length ?
                "\n**Examples**\n" +
                "```\n" +
                command.examples.map(example => `${prefix}${command.name} ${example}`).join('\n') +
                "\n```"
                : "")
        ).setFooter('Developed by Simonsen Techs');

    //Send embed
    return message.channel.send(embed);
}

function getCommandsPath() {
    return 'commands';
}
function getMainCategories() {
    return new Category(getCommandsPath()).subCategories;
}
/**@param {string} item*/
function Uppercased(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1, item.length).toLowerCase();
}


class SubCategory {
    /**@param {string} name
     * @param {string} path*/
    constructor(name, path) {
        this.name = name;
        this.path = path;
    }
}
class Category {
    /**@param {string} path*/
    constructor(path) {
        let splitPath = path.split('/');
        this.name = splitPath[splitPath.length - 1];

        let folder = fs.readdirSync(`./${path}`);
        this.scripts = GetScripts();
        this.subCategories = folder
            .filter(file => !file.toLowerCase().includes('archived') && !file.includes('.'))
            .map(file => new SubCategory(file, `${path}/${file}`));

        /**@returns {PinguCommand[]} */
        function GetScripts() {
            let value = folder.filter(file => file.endsWith('.js')).map(script => require(`../../../${path}/${script}`));
            return value;
        }
    }
}