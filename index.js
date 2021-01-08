//#region Variables
const { Client, Collection } = require('discord.js'),
    { token } = require('./config.json'),
    { CategoryNames } = require('./commands/4 DevOnly/update'),
    { PinguLibrary, Error } = require('./PinguPackage'),
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
        } catch (err) {
            PinguLibrary.DanhoDM(client, `"${file}" threw an exception:\n${err.message}\n${err.stack}\n`)
        }
    }
}

//Am I ready to launch?
client.once('ready', () => HandleEvent('ready', {})); //Bot is ready to be (ab)used
client.on('error', err => PinguLibrary.errorLog(client, `Called from client.on('error')`, null, err));

//Message response
client.on('message', message => {
    HandleEvent('message', { message });
    //try { require('./events/message').execute(client, message); }
    //catch (err) { PinguLibrary.errorLog(client, 'message event error', message.content, new Error(err)); }
}); //Message was sent by anyone 

//#region Guild Events
client.on('guildCreate', guild => HandleEvent('guild/guildCreate', { guild })); //First time joining a guild
client.on('guildUpdate', (from, to) => HandleEvent('guild/guildUpdate', { from, to })); //Guild was updated with new data
client.on('guildDelete', guild => HandleEvent('guild/guildDelete', { guild })); //Leaving a guild

client.on('guildMemberAdd', member => HandleEvent('guildMember/guildMemberAdd', { member })); //New guild member
client.on('guildMemberUpdate', (from, to) => {
    HandleEvent('guildMember/guildMemberUpdate', { from, to });

    //let event = require('./events/guildMember/guildMemberUpdate');
    //try { event.execute(client, from, to); }
    //catch (err) { PinguLibrary.errorLog(client, `${event.name} error`, null, new Error(err)); }
}); //Member changed
client.on('guildMemberRemove', member => {
    HandleEvent('guildMember/guildMemberRemove', { member });

    //let event = require('./events/guildMember/guildMemberRemove');
    //try { event.execute(client, member); }
    //catch (err) { PinguLibrary.errorLog(client, `${event.name} error`, null, new Error(err)); }
}); //Guild member left
//#endregion

/**@param {string} path
 * @param {{}} parameters*/
async function HandleEvent(path, parameters) {
    let pathArr = path.split('/');
    let eventName = pathArr[pathArr.length - 1];

    try {
        var event = require(`./events/${path}`);
        event.execute(client, parameters);
    }
    catch (err) { await PinguLibrary.errorLog(client, `${eventName} error`, null, new Error(err)); }
}

client.login(token);