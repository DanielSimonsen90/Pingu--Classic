const { Message } = require("discord.js");

module.exports = {
    name: 'update',
    description: 'Reloads a command',
    usage: '<script/command>',
    id: 4,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        if (!args.length)
            return message.channel.send(`You didn't pass any command to update, ${message.author}!`);

        const commandName = args[0].toLowerCase(),
            command = message.client.commands.get(commandName) ||
                message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

        delete require.cache[require.resolve(`./${commandName}.js`)];

        try {
            const newCommand = require(`./${commandName}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        } catch (error) {
            console.log(error);
            message.channel.send(`There was an error while updating \`${commandName}\`!\n\`${error.message}\``);
        }
        if (message.channel.type !== 'dm' && !message.channel.permissionsFor(message.guild.client.user).has('SEND_MESSAGES'))
            return message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!\nBut I have reloaded your command!`);

        message.channel.send(`Command \`${commandName}\` was updated!`);
    },
};