//Construction variables
//#region Variables
const fs = require('fs'),
    Discord = require('discord.js'),
    { token } = require('./config.json'),
    SecondaryPrefix = '562176550674366464',
    ScriptsCategorized = ["", "Utility", "Fun", "Support", "DevOnly"],
    client = new Discord.Client();
const { PinguGuild, PinguLibrary } = require('./PinguPackage');
const { musicCommands } = require('./commands/2 Fun/music');
client.commands = new Discord.Collection();

let LastToUseTell,
    LastToBeTold,
    updatingPGuilds = false;
//#endregion

//Does individual command work?
for (var x = 1; x < ScriptsCategorized.length; x++)
    SetCommand(`${x} ${ScriptsCategorized[x]}`);

//#region client.once()
//Am I ready to launch?
client.once('ready', () => {
    PinguLibrary.outages(client, `\nI'm back online!\n`);
    //client.user.setActivity('your screams for *help', { type: 'LISTENING' });
    PinguLibrary.setActivity(client);
});
//First time joining a guild
client.once('guildCreate', guild => {
    //Get Pingu Guilds from guilds.json
    const pGuilds = PinguGuild.GetPGuilds();

    //Insert new PinguGuild into pGuilds
    pGuilds[pGuilds.length] = new PinguGuild(guild);

    //Update guilds.json with new guild
    PinguGuild.UpdatePGuildsJSON(client, "Index: guildCreate"
        `Successfully joined "**${guild.name}**", owned by <@${guild.owner.user.id}>`,
        `I encountered and error while joining ${guild.name}:\n${err}`
    );

    //Thank guild owner for adding Pingu
    guild.owner.user.createDM()
        .then(OwnerDM => OwnerDM.send(
            `Hi, <@${guild.owner.user.id}>!\n` +
            `I've successfully joined your server, "**${guild.name}**"!\n\n` +

            `Thank you for adding me!\n` +
            `Use \`*help\`, if you don't know how I work!`
        ).then(() => console.log(`Sent ${guild.owner.user.tag} my "thank you" message.`))
            .catch(err => PinguLibrary.errorLog(client, `Creating DM to server owner for adding me`, err)));
});
//Leaving a guild
client.once('guildDelete', guild => {
    const pGuilds = PinguGuild.GetPGuilds();
    const pGuild = PinguGuild.GetPGuild(guild);
    let arr = [];
    pGuilds.forEach(pg => {
        if (pg != pGuild)
            arr.push(pg);
    });

    //Update guilds.json
    PinguGuild.UpdatePGuildsJSON(client, "Index: guildDelete"
        `Successfully left "**${guild.name}**", owned by <@${guild.owner.user.id}>`,
        `I encountered and error while updating guild.json from leaving ${guild.name}:\n\n${err}`
    );
})
//#endregion

//Message response
client.on('message', message => {
    //Find pGuilds in guilds.json
    try {
        PinguGuild.GetPGuilds()
        if (updatingPGuilds)
            updatingPGuilds = false;
    }
    catch {
        if (updatingPGuilds) return;
        updatingPGuilds = true;
        PinguLibrary.errorLog(client, `guilds.json was empty! Running updatepguilds.js...\n<@&756383446871310399>`)
        AssignCommand('updatepguilds', null).execute(message, null);
    }

    //Find prefix in pGuild
    let Prefix = message.channel.type == 'dm' ? '*' : null;
    try {
        var pGuild = PinguGuild.GetPGuild(message.guild);
        if (!pGuild) {
            PinguLibrary.errorLog(client, `Unable to find pGuild from ${message.guild.id}!`)
                .then(() => message.channel.send('I had an error trying to find your pGuild! I have already notified my developers.'));
        }
        Prefix = pGuild.botPrefix;
        CheckRoleChange(message.guild, pGuild);
    } catch (err) {
        if (err.message != `Cannot read property 'id' of null`)
            PinguLibrary.errorLog(client, `Ran catch block in index, trying to assign Prefix.`, message.content, err);
        Prefix = '*';
    }

    //Split prefix from message content
    const args = message.content.slice(Prefix.length).split(/ +/) ||
        message.content.slice(SecondaryPrefix).split(/ +/);

    //Get commandName
    let commandName = args.shift().toLowerCase();

    //If mentioned without prefix
    if (message.content.includes(SecondaryPrefix) && args.length == 0 && !message.author.bot)
        return message.channel.send(`My prefix is \`${Prefix}\``);

    //If interacted via @
    commandName = TestTagInteraction(commandName, args);

    //If I'm not interacted with don't do anything
    if (message.channel.type == 'dm' && ([LastToBeTold, LastToUseTell].includes(message.author)) && commandName == "tell") {
        try { return ExecuteTellReply(message); }
        catch (err) { return PinguLibrary.errorLog(client, `Failed to execute tell reply`, message.content, err); }
    }

    if ((!message.content.startsWith(Prefix) && !message.author.bot) && !message.content.includes(SecondaryPrefix)) return;

    //Attempt "command" assignment
    if (musicCommands.find(cmd => [cmd.name, cmd.alias].includes(commandName))) {
        commandName = `music`;
        args.unshift(commandName);
    }
    let command = AssignCommand(commandName, args);

    if (!command) return;

    //If I'm not interacted with don't do anything
    if ((!message.content.startsWith(Prefix) || message.author.bot) && !message.content.includes(SecondaryPrefix)) return;

    //If guildOnly
    if (command.guildOnly && message.channel.type != 'text')
        return message.reply(`I can't execute that command inside DMs!`);

    //If DevOnly
    if (command.id == 4 && !PinguLibrary.isPinguDev(message.author))
        return message.reply(`Who do you think you are exactly?`);

    //Execute command and log it
    ExecuteAndLogCommand(message, args, Prefix, commandName, command);

});
client.on('error', err => PinguLibrary.errorLog(client, `Called from client.on('error')`, null, err));

client.login(token);

//#region OnMessage Methods
/**@param {string} commandName @param {string[]} args*/
function TestTagInteraction(commandName, args) {
    if (commandName.includes(SecondaryPrefix))
        commandName = args.shift();
    return commandName;
}
/**@param {string} commandName 
 * @param {string[]} args
 * @returns {Discord.Command}}*/
function AssignCommand(commandName, args) {
    command = client.commands.get(commandName);

    //If command assignment failed, assign command
    if (!command) {
        try {
            for (var number = 1; number < args.length || command; number++) {
                number += 1;
                commandName = args[number].toLowerCase();
                command = client.commands.get(commandName);
            }
        } catch { return; }
    }
    return command;
}
/**@param {Discord.Message} message @param {string[]} args @param {string} Prefix @param {string} commandName @param {any} command*/
function ExecuteAndLogCommand(message, args, Prefix, commandName, command) {
    let ConsoleLog = `User "${message.author.username}" executed command "${Prefix}${commandName}", from ${(!message.guild ? `DMs and ` : `"${message.guild}", #${message.channel.name}, and `)}`;

    //Attempt execution of command
    try {
        if (commandName == "tell") {
            if (args[0] == 'unset') {
                PinguLibrary.tellLog(
                    client,
                    LastToUseTell == message.author ? LastToUseTell : LastToBeTold,
                    LastToUseTell != message.author ? LastToUseTell : LastToBeTold,
                    new Discord.MessageEmbed()
                        .setTitle(`Link between ${LastToUseTell.username} & ${LastToBeTold.username} was unset.`)
                        .setColor(PinguGuild.GetPGuild(PinguLibrary.SavedServers.PinguSupport(client)).embedColor)
                        .setDescription(`${message.author} unset the link.`)
                        .setThumbnail(message.author.avatarURL())
                        .setFooter(new Date(Date.now()).toLocaleTimeString())
                );

                LastToUseTell = LastToBeTold = null;

                console.log(ConsoleLog += `successfully unset LastToUseTell & LastToBeTold.`);

                message.author.send(`Successfully unset LastToUseTell & LastToBeTold.`);
                return;
            }
            let Mention = args[0];
            while (Mention.includes('_')) Mention = Mention.replace('_', ' ');
            LastToBeTold = GetMention(message, Mention);
            LastToUseTell = message.author;
        }

        command.execute(message, args);
        ConsoleLog += `succeeded!\n`;
    } catch (err) {
        ConsoleLog += `failed!\nError: ${err}`;
        PinguLibrary.errorLog(client, `Trying to execute "\`${command.name}\`"!`, message.content, err);

        if (commandName == "tell") {
            LastToBeTold = LastToUseTell = null;
        }
    }
    console.log(ConsoleLog);
}
// #endregion

// #region Tell command related
/**@param {Discord.Message} message*/
function ExecuteTellReply(message) {
    if (message.author.id == client.user.id) return;

    try { PinguLibrary.tellLog(client, message.author, LastToBeTold.username == message.author.username ? LastToUseTell : LastToBeTold, message); }
    catch (err) { PinguLibrary.errorLog(client, 'Tell reply failed', message.content, err); }

    /*try {
        for (var x = 0; x < TellArray.length; x++) {
            if (TellArray[x].Message == GetMessageContent(message))
                return TellArray[x].Giver.dmChannel.send(`${TellArray[x].Reciever.username} replied: \n"${message.content}"`)
        }
    } catch (error) {
        console.log(`Attempted to run ExecuteTellReply(message), but ran into an error:\n ${error}`)
    }*/

    if (message.author == LastToUseTell) {
        if (message.content && message.attachments)
            LastToBeTold.dmChannel.send(message.content, message.attachments.array());
        else if (message.content)
            LastToBeTold.dmChannel.send(message.content);
        else if (message.attachments)
            LastToBeTold.dmChannel.send(message.attachments.array());
        else PinguLibrary.errorLog(client, `${LastToUseTell} => ${LastToBeTold} used else statement from ExecuteTellReply, Index`);
        message.react('✅');
    }
    else if (LastToUseTell != null) {
        LastToUseTell.dmChannel.send(`${message.author} replied:\n${(message.content ? `${message.content}` : message.attachments.array())}`, message.content ? message.attachments.array() : null);
    }
    else return;
}
/**@param {Discord.Message} message*/
function GetMessageContent(message) {
    message.channel.fetchMessages({ limit: 20 }).then(MessageCollection => {
        for (var x = 0; x < MessageCollection.array().length; x++) {
            if (MessageCollection.array()[x].author == message.client.user)
                return MessageContent = MessageCollection.array()[x].content;
        }
    });
    return `Unable to find message content`;
}
/**@param {Discord.Message} message @param {string} UserMention*/
function GetMention(message, UserMention) {
    if (message.mentions.users.first() == null) {
        for (var Guild of message.client.guilds.cache.array())
            for (var Member of Guild.members.cache.array())
                if ([Member.user.username, Member.nickname, Member.id].includes(UserMention))
                    return Member.user;
        return null;
    }
    return message.mentions.users.first();
}
// #endregion

//#region Misc Methods
/**@param {string} path*/
function SetCommand(path) {
    const ScriptCollection = fs.readdirSync(`./commands/${path}/`).filter(file => file.endsWith('.js'));

    for (const file of ScriptCollection) {
        try {
            const command = require(`./commands/${path}/${file}`);
            client.commands.set(command.name, command);;
        } catch (error) {
            PinguLibrary.DanhoDM(client, `"${file}" threw an exception:\n${error.message}\n${error.stack}\n`)
        }
    }
}
/**Checks if role color was changed, to update embed colors 
 * @param {Discord.Guild} guild
 * @param {PinguGuild} pGuild*/
function CheckRoleChange(guild, pGuild) {
    const pGuilds = PinguGuild.GetPGuilds();

    //Get the color of the Pingu role in message.guild
    const guildRoleColor = guild.me.roles.cache.find(botRoles => botRoles.managed).color;

    //If color didn't change
    if (guildRoleColor == pGuild.embedColor) return;

    //Save Index of pGuild & log the change
    const pGuildIndex = pGuilds.indexOf(pGuild);
    console.log(`Embedcolor updated from ${pGuild.embedColor} to ${guildRoleColor}`);

    //Update pGuild.EmbedColor with guild's Pingu role color & put pGuild back into pGuilds
    pGuild.embedColor = guildRoleColor;
    pGuilds[pGuildIndex] = pGuild;

    //Update guilds.json
    PinguGuild.UpdatePGuildsJSON(client, "Index: CheckRoleChange",
        `Successfully updated role color from "${guild.name}"`,
        `I encountered and error while updating my role color in "${guild.name}"`
    );
}
//#endregion