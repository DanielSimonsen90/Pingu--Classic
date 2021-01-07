const { Message } = require("discord.js");
const { PinguLibrary, PinguGuild, DiscordPermissions, Error } = require("../../PinguPackage");
const { Prefix } = require('../../config');

module.exports = {
    name: 'update',
    description: 'Reloads a command',
    usage: '<script/command>',
    id: 4,
    CategoryNames: ["", "Utility", "Fun", "Support", "DevOnly"],
    /**@param {{message: Message, args: string[], pGuild: PinguGuild}}*/
    execute({ message, args, pGuild }) {
        if (!args.length) return message.channel.send(`What am I supposed to update, ${message.author}?`);

        const commandName = args[0].toLowerCase(),
            command = message.client.commands.get(commandName) ||
                message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

        delete require.cache[require.resolve(`../${command.id} ${this.CategoryNames[command.id]}/${commandName}.js`)];

        try {
            const newCommand = require(`../${command.id} ${this.CategoryNames[command.id]}/${commandName}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        } catch (error) {
            PinguLibrary.errorLog(message.client, `Error creating updated version of ${commandName}`, message.content, new Error(error));
            return message.channel.send(`There was an error while updating \`${commandName}\`!\n\n\`${error.message}\``);
        }
        if (message.channel.type != 'dm') {
            var permCheck = PinguLibrary.PermissionCheck(message, [DiscordPermissions.SEND_MESSAGES]);
            if (permCheck != PinguLibrary.PermissionGranted) return message.author.send(`${permCheck}\nBut I have updated my command!`)
        }
        message.channel.send(`\`${message.guild && pGuild.botPrefix || Prefix}${commandName}\` was updated!`);
    },
};