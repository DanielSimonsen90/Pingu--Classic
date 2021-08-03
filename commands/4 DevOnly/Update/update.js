const { PinguCommand } = require("PinguPackage");

module.exports = new PinguCommand('update', 'DevOnly', 'Reloads a script', {
    usage: '<script/command>',
}, async ({ client, message, args }) => {
    if (!args.length) return message.channel.send(`What am I supposed to update, ${message.author}?`);

    let script = args[0],
        command = client.commands.find(cmd => [cmd.name, ...(cmd.aliases || [])].includes(script));
    if (!command) var event = client.events.get(script);

    if (!command && !event) return message.channel.send(`Unable to find file \`${script}.js\`!`);

    if (command) delete require.cache[require.resolve(`${getPath()}${command.path}`)];
    else delete require.cache[require.resolve(`${getPath()}${event.path}`)];

    try {
        if (command) {
            const newCommand = require(`${getPath()}${command.path}`);
            newCommand.path = command.path;
            client.commands.set(newCommand.name, newCommand);
        }
        else {
            const newEvent = require(`${getPath()}${event.path}`);
            newEvent.path = event.path;
            newEvent.name = event.name;
            client.events.set(newEvent.name, newEvent);
        }
    } catch (error) {
        client.log('error', `Error creating updated version of ${script}`, message.content, error, {
            params: { message, args },
            command, event, script, path: getPath(),
        });
        return message.channel.send(`There was an error while updating \`${script}\`!\n\n\`${error.message}\``);
    }
    if (message.channel.type != 'dm') {
        var permCheck = client.permissions.checkFor(message, 'SEND_MESSAGES');
        if (permCheck != client.permissions.PermissionGranted) return message.author.send(`${permCheck}\nBut I have updated ${script}!`)
    }
    return message.channel.send(`\`${script}\` was updated!`);
});

/**@returns {string} */
function getPath() {
    if (!module.exports.path) return "";

    let split = module.exports.path.split('/');
    split.shift();
    split.pop();
    return split.map(() => '../').join('');
}