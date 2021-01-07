//#region Variables
const { Client, Collection } = require('discord.js'),
    { token } = require('./config.json'),
    { CategoryNames } = require('./commands/4 DevOnly/update'),
    { PinguLibrary } = require('./PinguPackage'),
    fs = require('fs'),
    client = new Client();
client.commands = new Collection();
//#endregion

//Does individual command work?
for (var x = 1; x < CategoryNames.length; x++) {
    let path = `${x} ${CategoryNames[x]}`;

    const ScriptCollection = fs.readdirSync(`./commands/${path}/`).filter(file => file.endsWith('.js'));

    for (const file of ScriptCollection) {
        try {
            const command = require(`./commands/${path}/${file}`);
            client.commands.set(command.name, command);
        } catch (err) { PinguLibrary.DanhoDM(client, `"${file}" threw an exception:\n${err.message}\n${err.stack}\n`) }
    }
}

//Am I ready to launch?
client.once('ready', () => require('./events/ready').execute(client)); //Bot is ready to be (ab)used
client.on('error', err => PinguLibrary.errorLog(client, `Called from client.on('error')`, null, err));

//Message response
client.on('message', message => require('./events/message').execute(client, message)); //Message was sent by anyone

//#region Guild Events
client.on('guildCreate', guild => require('./events/guild/guildCreate').execute(client, guild)); //First time joining a guild
client.on('guildUpdate', (from, to) => require('./events/guild/guildUpdate').execute(client, from, to)); //Guild was updated with new data
client.on('guildDelete', guild => require('./events/guild/guildDelete').execute(client, guild)); //Leaving a guild

client.on('guildMemberAdd', member => require('./events/guildMember/guildMemberAdd').execute(client, member)); //New guild member
client.on('guildMemberUpdate', (from, to) => require('./events/guildMember/guildMemberUpdate').execute(client, from, to)); //Member changed
client.on('guildMemberRemove', member => require('./events/guildMember/guildMemberRemove').execute(client, member)); //Guild member left
//#endregion

client.login(token);