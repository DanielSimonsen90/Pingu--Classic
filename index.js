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
client.once('ready', () => HandleEvent('onready', { user: client.user })); //Bot is ready to be (ab)used
client.on('error', err => PinguLibrary.errorLog(client, `Called from client.on('error')`, null, err));


//#region Guild Events
const Guild = `guild`;
client.on('guildCreate', guild => HandleEvent(`${Guild}/${Guild}Create`, { guild })); //First time joining a guild
client.on('guildUpdate', (preGuild, guild) => HandleEvent(`${Guild}/${Guild}Update`, { preGuild, guild })); //Guild was updated with new data
client.on('guildDelete', guild => HandleEvent(`${Guild}/${Guild}Delete`, { guild })); //Leaving a guild
//#endregion

//#region Guild Member Events
const guildMember = `guildMember`;
client.on('guildMemberAdd', member => HandleEvent(`${guildMember}/${guildMember}Add`, { member })); //New guild member
client.on('guildMemberUpdate', (preMember, member) => HandleEvent(`${guildMember}/${guildMember}Update`, { preMember, member })); //Member changed
client.on('guildMemberRemove', member => HandleEvent(`${guildMember}/${guildMember}Remove`, { member })); //Guild member left
//#endregion

//#region Message
const Message = `message`;
client.on('message', message => HandleEvent(`${Message}/${Message}`, { message })); //Message was sent by anyone 
client.on('messageDelete', message => HandleEvent(`${Message}/${Message}Delete`, { message })); //Message was deleted

//#region Message Reaction
const messageReaction = `${Message}Reaction`;
client.on('messageReactionAdd', (reaction, user) => HandleEvent(`${Message}/${messageReaction}/${messageReaction}Add`, { reaction, user })) //User reacted to message
client.on('messageReactionRemove', (reaction, user) => HandleEvent(`${Message}/${messageReaction}/${messageReaction}Remove`, { reaction, user })) //User unreacted to message
client.on('messageReactionRemoveEmoji', reaction => HandleEvent(`${Message}/${messageReaction}/${messageReaction}RemoveEmoji`, { reaction })) //All reactions to an emoji was removed
client.on('messageReactionRemoveAll', message => HandleEvent(`${Message}/${messageReaction}/${messageReaction}RemoveAll`, { message })) //ALl reactions were removed from message
//#endregion

//#endregion

/**@param {string} path
 * @param {{}} parameters*/
async function HandleEvent(path, parameters) {
    let pathArr = path.split('/');
    let eventName = pathArr[pathArr.length - 1];

    try {
        var event = require(`./events/${path}`);
        event.execute(client, parameters);
        SendToLog();
    }
    catch (err) { await PinguLibrary.errorLog(client, `${eventName} error`, null, new Error(err)); }

    function SendToLog() {
        let emitter = parameters.guild ? parameters.guild.name : parameters.message ? parameters.message.author.tag : parameters.member ? parameters.member.user.tag :
            parameters.user ? parameters.user.tag : parameters.reaction ? parameters.reaction.users.cache.last().tag : "Not recognized";

        let emitterType = parameters.guild ? 'guild' : 'user';

        //if (emitter == client.user.tag && event.name == 'events: message') console.log(parameters.message.content);

        if (emitter == 'Not recognized') PinguLibrary.errorLog(client, `Event parameter not recognized!`);
        if (parameters.message && ['event-log', 'ping-log', 'console-log'].includes(parameters.message.channel.name)) return;
        PinguLibrary.eventLog(client, event.name, emitter, emitterType);
    }
}

client.login(token);