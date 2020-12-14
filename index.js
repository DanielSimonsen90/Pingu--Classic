//Construction variables
//#region Variables
const fs = require('fs'),
    Discord = require('discord.js'),
    { token, Prefix } = require('./config.json'),
    SecondaryPrefix = '562176550674366464',
    ScriptsCategorized = ["", "Utility", "Fun", "Support", "DevOnly"],
    client = new Discord.Client();
const { PinguGuild, PinguLibrary, DiscordPermissions } = require('./PinguPackage');
const { musicCommands } = require('./commands/2 Fun/music');
client.commands = new Discord.Collection();

let LastToUseTell,
    LastToBeTold,
    updatingPGuild = false;
//#endregion

//Does individual command work?
for (var x = 1; x < ScriptsCategorized.length; x++)
    SetCommand(`${x} ${ScriptsCategorized[x]}`);

//Am I ready to launch?
client.once('ready', () => {
    //PinguLibrary.outages(client, `\nI'm back online!\n`);
    console.log(`\nI'm back online!\n`);
    PinguLibrary.setActivity(client);
});

//Message response
client.on('message', message => {
    try { PinguLibrary.LatencyCheck(message); }
    catch (err) { PinguLibrary.errorLog(client, `LatencyCheck error`, message.content, err); }

    let prefix = Prefix;

    if (message.guild) {
        //Find pGuild in servers folder
        if (updatingPGuild) updatingPGuild = false;

        let pGuild = PinguGuild.GetPGuild(message.guild);

        //If pGuild wasn't found, create pGuild
        if (!pGuild) {
            if (updatingPGuild) return;
            updatingPGuild = true;
            PinguLibrary.pGuildLog(client, `on('message')`, `Unable to find pGuild for **${message.guild.name}**! Running updatepguilds.js...\n<@&756383446871310399>`)
            return PinguGuild.WritePGuild(message.guild, PinguLibrary.pGuildLog(client, `on('message')`, `Created pGuild for **${message.guild.name}**`));
        }

        prefix = pGuild.botPrefix;
        CheckRoleChange(message.guild, pGuild);
    }

    //Split prefix from message content
    const args = message.content.slice(prefix.length).split(/ +/) ||
        message.content.slice(SecondaryPrefix).split(/ +/);

    //Get commandName
    let commandName = args.shift().toLowerCase();

    //If mentioned without prefix
    if (message.content.includes(SecondaryPrefix) && args.length == 0 && !message.author.bot)
        return message.channel.send(`My prefix is \`${prefix}\``);

    //If interacted via @
    commandName = TestTagInteraction(commandName, args);

    var startsWithPrefix = () => (message.content.startsWith(prefix) && !message.author.bot) || message.content.includes(SecondaryPrefix);

    //If I'm not interacted with don't do anything
    if (message.channel.type == 'dm' && ([LastToBeTold, LastToUseTell].includes(message.author)) && !startsWithPrefix()) {
        try { return ExecuteTellReply(message); }
        catch (err) { return PinguLibrary.errorLog(client, `Failed to execute tell reply`, message.content, err); }
    }

    if (!startsWithPrefix()) return;

    //Attempt "command" assignment
    if (musicCommands.find(cmd => [cmd.name, cmd.alias].includes(commandName))) {
        args.unshift(commandName);
        commandName = `music`;
    }
    let command = AssignCommand(commandName, args);
    if (!command) return;

    //If I'm not interacted with don't do anything
    if ((!message.content.startsWith(prefix) || message.author.bot) && !message.content.includes(SecondaryPrefix)) return;

    //If guildOnly
    if (command.guildOnly && message.channel.type != 'text')
        return message.reply(`I can't execute that command inside DMs!`);

    //If DevOnly
    if (command.id == 4 && !PinguLibrary.isPinguDev(message.author))
        return message.reply(`Who do you think you are exactly?`);

    if (command.permissions) {
        let permCheck = PinguLibrary.PermissionCheck(message, command.permissions);
        if (permCheck != PinguLibrary.PermissionGranted)
            return PinguLibrary.PermissionCheck(message, DiscordPermissions.SEND_MESSAGES) != PinguLibrary.PermissionGranted ?
                message.channel.send(permCheck) : message.author.send(permCheck);
    }

    //Execute command and log it
    ExecuteAndLogCommand(message, args, prefix, commandName, command);

});
client.on('error', err => PinguLibrary.errorLog(client, `Called from client.on('error')`, null, err));

//First time joining a guild
client.on('guildCreate', async guild => {
    PinguGuild.WritePGuild(guild, async () => await PinguLibrary.pGuildLog(client, "index: guildCreate", `Successfully joined "**${guild.name}**", owned by <@${guild.owner.user.id}>`));

    //Thank guild owner for adding Pingu
    let OwnerDM = await guild.owner.user.createDM();
    if (!OwnerDM) return PinguLibrary.errorLog(client, `Unable to create DM to <@${guild.owner.id}>!`);

    OwnerDM.send(
        `Hi, <@${guild.owner.user.id}>!\n` +
        `I've successfully joined your server, "**${guild.name}**"!\n\n` +

        `Thank you for adding me!\n` +
        `Use \`*help\`, if you don't know how I work!`)
        .catch(err => PinguLibrary.errorLog(client, `Failed to send <@${guild.owner.id}> a DM`, null, err)).then(console.log(`Sent ${guild.owner.user.tag} my "thank you" message.`));
});
//Guild was updated with new data
client.on('guildUpdate', (from, to) => {
    try {
        if (from.name != to.name) throw 'Cannot find module';
        PinguGuild.UpdatePGuildJSON(client, to, "index: guildUpdate",
            `Successfully updated **${to.name}**'s ${(from.name != to.name ? `(${from.name})` : "")} Pingu Guild.`,
            `Unable to update **${to.name}**'s ${(from.name != to.name ? `(${from.name})` : "")} Pingu Guild.`
        );
    }
    catch (err) {
        if (err.message.includes('Cannot find module'))
            return PinguGuild.DeletePGuild(from, () => PinguGuild.WritePGuild(to, () => PinguLibrary.pGuildLog(client,
                `index: guildUpdate`, `Renamed **${from.name}**'s pGuild name to **${to.name}**.`)));

        PinguLibrary.errorLog(client, "Unable to update pGuild", null, err);
    }
});
//Leaving a guild
client.on('guildDelete', guild => {
    PinguGuild.DeletePGuild(guild, () =>
        PinguLibrary.pGuildLog(client, "index: guildDelete", `Successfully left "**${guild.name}**", owned by <@${guild.owner.user.id}>`));
});

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
    let ConsoleLog = `[${new Date(Date.now()).toLocaleTimeString()}] User "${message.author.username}" executed command "${commandName}", from ${(!message.guild ? `DMs and ` : `"${message.guild}", #${message.channel.name}, and `)}`;

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

    var cantMessage = async (err) => {
        if (err.message == 'Cannot send messages to this user')
            return message.channel.send(`Unable to send message to ${Mention.username}, as they have \`Allow direct messages from server members\` disabled!`);

        await PinguLibrary.errorLog(message.client, `${message.author} attempted to *tell ${Mention}`, message.content, err)
        message.channel.send(`Attempted to message ${Mention.username} but couldn't.. I've contacted my developers.`);
    }

    if (message.author == LastToUseTell) {
        if (message.content && message.attachments) LastToBeTold.dmChannel.send(message.content, message.attachments.array()).catch(async err => cantMessage(err));
        else if (message.content) LastToBeTold.dmChannel.send(message.content).catch(async err => cantMessage(err));
        else if (message.attachments) LastToBeTold.dmChannel.send(message.attachments.array()).catch(async err => cantMessage(err));
        else PinguLibrary.errorLog(client, `${LastToUseTell} => ${LastToBeTold} used else statement from ExecuteTellReply, Index`, message.content);
        message.react('✅');
    }
    else if (LastToUseTell != null) {
        LastToUseTell.dmChannel.send(`${message.author} replied:\n${(message.content ? `${message.content}` : message.attachments.array())}`, message.content ? message.attachments.array() : null);
    }
    else return;
}
/**@param {Discord.Message} message @param {string} UserMention*/
function GetMention(message, UserMention) {
    if (message.mentions.users.first() == null) {
        for (var Guild of message.client.guilds.cache.array())
            for (var Member of Guild.members.cache.array())
                if ([Member.user.username.toLowerCase(), Member.nickname && Member.nickname.toLowerCase(), Member.id].includes(UserMention.toLowerCase()))
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
    PinguGuild.UpdatePGuildJSON(client, "Index: CheckRoleChange",
        `Successfully updated role color from "${guild.name}"`,
        `I encountered and error while updating my role color in "${guild.name}"`
    );
}
//#endregion