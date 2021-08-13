const { MessageEmbed } = require('discord.js');
const { PinguCommand } = require('PinguPackage');
const fs = require('fs');

module.exports = new PinguCommand('help', 'Utility', 'List all of my commands or info about a specific command.', {
    usage: '[category | command]',
    examples: ["", "giveaway", "Fun"]
}, async ({ client, message, args, pAuthor, pGuildClient }) => {
    let color = pGuildClient?.embedColor || client.DefaultEmbedColor;
    let prefix = pGuildClient?.prefix || client.DefaultPrefix;
    let embed = new MessageEmbed({ color, thumbnail: { url: client.user.avatarURL() } })

    switch (args.length) {
        case 0: return CategoryHelp(getCommandsPath()); //If no argument was provided, send default help menu
        default: return CategoryOrSpecificHelp(message, args, embed, prefix, pAuthor); //If 1 argument is provided || if args[0] exists
    }

    function CategoryOrSpecificHelp() {
        const search = args.join(' ').toLowerCase();

        /**@param {SubCategory[]} arr
         * @returns {SubCategory}*/
        const getCategory = (arr) => {
            if (!arr) return null;
            let result = arr.find(c => c.name.toLowerCase() == search);

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
                return CommandHelp();
            }
            return message.channel.send(`I couldn't find what you were looking for!`);
        }

        return CategoryHelp(category.path);
    }
    /*** @param {string} path*/
    async function CategoryHelp(path) {
        let pathFolder = new Category(path); //Path folder
        let categories = pathFolder.subCategories.length && pathFolder.subCategories.map(category => new Category(category.path)) || [pathFolder] //Get path's sub categories to category classes

        if (!isNaN(parseInt(pathFolder.name[0])))
            pathFolder.name = pathFolder.name.split(' ')[1];

        /**@param {PinguCommand} cmd*/
        function viewFilter(cmd) {
            return !(cmd.category == 'DevOnly' && !client.developers.isPinguDev(message.author) ||
                cmd.category == 'GuildSpecific' && !pAuthor.sharedServers.map(pg => pg._id).includes(cmd.specificGuildID))
        }

        let description = categories.map(category => {
            //Don't include sub category, if it only consists of DevOnly & GuildSpecific categories && author isn't authorized to view them
            //This applies to category.subCategories & category.scripts
            category.subCategories = category.subCategories
                .map(sub => new Category(sub.path))
                .filter(sub => sub.scripts.filter(viewFilter).length)
                .map(cat => new SubCategory(cat.name, cat.path));

            category.scripts = category.scripts.filter(viewFilter);

            let hasSubCategories = category.subCategories?.length > 0;
            let hasScripts = category.scripts?.length > 0;

            return hasSubCategories || hasScripts ? `**__${category.name}__**\n` +
                //Category has sub categories
                `${(hasSubCategories ? `**Subcategories**\n` + "```\n" +
                    (category.subCategories.map(sub => `${prefix}help ${sub.name}`).join('\n') + '\n```') :
                    "")}` +

                //Category has commands
                `${(hasScripts ? `**Commands**\n` + "```\n" +
                    (category.scripts.map(cmd => `${prefix}help ${cmd.name}`).join('\n') + '\n```\n') :
                    "")}`
                : "";
        }).join('\n');
        //Folder was found but author isn't authorized to see what's inside the folder
        if (!description) return message.channel.send("I couldn't find what you were looking for!");

        embed.setTitle('Pingu Help Menu! - ' + Uppercased(pathFolder.name))
            .setDescription(`**Use these arguments to get more help!**\n\n${description}`)
            .setFooter(`Developed by Simonsen Techs`);

        //Return embed
        return message.channel.sendEmbeds(embed).catch(err => {
            client.log('error', `Unable to send help DM to ${message.author.tag}.`, message.content, err, {
                params: { message, embed, prefix, path },
                additional: { pathFolder, categories }
            });
            return message.reply(`It seems like I can't DM you! Do you have DMs disabled?`);
        })
    }
    function CommandHelp() {
        //Create variables to find the specific command message.author is looking for
        const command = client.commands.get(args.first.toLowerCase());
        if (!command) return message.channel.send(`Command not recognized!`);
        else if (command.category == 'DevOnly' && !client.developers.isPinguDev(message.author)) return message.channel.send("This is a developer command. No dev, no help.");
        else if (command.category == 'GuildSpecific' && !pAuthor.sharedServers.map(pg => pg._id).includes(command.specificGuildID)) return message.channel.send("You're not in the required guild to see that command!");

        //Update embed
        embed.setTitle(prefix + command.name)
            .setDescription(
                "**Description**\n" +
                command.description + "\n" +
                "\n**Usage**\n" +
                "```\n" + `${prefix}${command.name} ${command.usage}\n` + "```" +
                (command.aliases?.length ?
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
        return message.channel.sendEmbeds(embed);
    }

    function getCommandsPath() {
        return 'commands';
    }
    function getMainCategories() {
        return new Category(getCommandsPath()).subCategories;
    }
    /**@param {string} item*/
    function Uppercased(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1).toLowerCase();
    }
});




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
        this.path = path;
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