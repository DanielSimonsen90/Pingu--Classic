const { PinguCommand } = require("PinguPackage");

module.exports = new PinguCommand('update', 'DevOnly', 'Reloads a script', {
    usage: '<script/command>',
}, async ({ client, message, args }) => {
    if (!args.length) return message.channel.send(`What am I supposed to update, ${message.author}?`);

    const script = args.first;
    const command = client.commands.find(cmd => [cmd.name].includes(script));
    const event = client.events.get(script);

    if (!command && !event) return message.channel.send(`Unable to find \`${script}.js\`!`);

    delete require.cache[require.resolve(command?.path || event.path)]

    try {
        const updated = require(command?.path || event.path);
        (command ? client.commands : client.events).set(updated.name, {...updated, path: command?.path || event.path });
    } catch (error) {
        client.log('error', `Error creating updated version of ${script}`, message.content, error, {
            params: { message, args },
            command, event, script,
        });
        return message.channel.send(`There was an error while updating \`${script}\`!\n\n\`${error.message}\``);
    }
    if (message.channel.type != 'dm') {
        var permCheck = client.permissions.checkFor(message, 'SEND_MESSAGES');
        if (permCheck != client.permissions.PermissionGranted) return message.author.send(`${permCheck}\nBut I have updated ${script}!`)
    }
    return message.channel.send(`\`${script}\` was updated!`);
});