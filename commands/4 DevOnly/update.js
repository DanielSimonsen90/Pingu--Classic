const { Message } = require("discord.js");
const { PinguLibrary, PinguGuild, DiscordPermissions } = require("../../PinguPackage");

module.exports = {
    name: 'update',
    description: 'Reloads a command',
    usage: '<script/command>',
    id: 4,
    CategoryNames: ["", "Utility", "Fun", "Support", "DevOnly"],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        if (!args.length) return message.channel.send(`What am I supposed to update, ${message.author}?`);

        const commandName = args[0].toLowerCase(),
            command = message.client.commands.get(commandName) ||
                message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

        delete require.cache[require.resolve(`../${command.id} ${CategoryNames[command.id]}/${commandName}.js`)];

        try {
            const newCommand = require(`../${command.id} ${CategoryNames[command.id]}/${commandName}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        } catch (error) {
            console.error(error);
            return message.channel.send(`There was an error while updating \`${commandName}\`!\n\n\`${error.message}\``);
        }
        if (message.channel.type != 'dm') {
            var permCheck = PinguLibrary.PermissionCheck(message, [DiscordPermissions.SEND_MESSAGES]);
            if (permCheck != PinguLibrary.PermissionGranted) return message.author.send(`${permCheck}\nBut I have updated my command!`)
        }
        message.channel.send(`\`${PinguGuild.GetPGuild(message.guild).botPrefix || '*'}${commandName}\` was updated!`);
    },
};