const { Message } = require("discord.js");
const { PinguLibrary, PinguGuild, DiscordPermissions, Error, PClient } = require("../../PinguPackage");

module.exports = {
    name: 'update',
    description: 'Reloads a command',
    usage: '<script/command>',
    id: 4,
    CategoryNames: ["", "Utility", "Fun", "Support", "DevOnly"],
    /**@param {{message: Message, args: string[], pGuildClient: PClient}}*/
    execute({ message, args, pGuildClient }) {
        if (!args.length) return message.channel.send(`What am I supposed to update, ${message.author}?`);

        let script = args[0],
            command = message.client.commands.get(script) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(script));
        if (!command) var event = message.client.events.get(script);

        if (!command && !event) return message.channel.send(`Unable to find file \`${script}.js\`!`);

        if (command) delete require.cache[require.resolve(`../../${command.path}`)];
        else delete require.cache[require.resolve(`../../${event.path}`)];

        try {
            if (command) {
                const newCommand = require(`../../${command.path}`);
                message.client.commands.set(newCommand.name, newCommand);
            }
            else {
                const newEvent = require(`../../${event.path}`);
                newEvent.path = event.path;
                newEvent.name = event.name;
                message.client.events.set(newEvent.name, newEvent);
            }
        } catch (error) {
            PinguLibrary.errorLog(message.client, `Error creating updated version of ${script}`, message.content, new Error(error));
            return message.channel.send(`There was an error while updating \`${script}\`!\n\n\`${error.message}\``);
        }
        if (message.channel.type != 'dm') {
            var permCheck = PinguLibrary.PermissionCheck(message, [DiscordPermissions.SEND_MESSAGES]);
            if (permCheck != PinguLibrary.PermissionGranted) return message.author.send(`${permCheck}\nBut I have updated ${script}!`)
        }
        message.channel.send(`\`${script}\` was updated!`);
    },
};