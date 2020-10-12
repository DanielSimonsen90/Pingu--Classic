//Construction variables
//#region Variables
const fs = require('fs'),
    Discord = require('discord.js'),
    { token } = require('./config.json'),
    SecondaryPrefix = '562176550674366464',
    ScriptsCategorized = ["", "Utility", "Fun", "Support", "DevOnly"],
    client = new Discord.Client();
const { PinguGuilds, PinguGuild } = require('./PinguPackage');
client.commands = new Discord.Collection();

let PreviousMessages = [],
    PreMsgCount = 0,
    LastToUseTell,
    LastToBeTold,
    updatingPGuilds = false;
//#endregion

//Does individual command work?
for (var x = 1; x < ScriptsCategorized.length; x++)
    SetCommand(`${x} ${ScriptsCategorized[x]}`);

//#region client.once()
//Am I ready to launch?
client.once('ready', () => {
    console.log(`\nIt's alive!\n`);
    client.user.setActivity('your screams for *help', { type: 'LISTENING' });
})
//First time joining a guild
client.once('guildCreate', guild => {
    //Get Pingu Guilds from guilds.json
    const pGuilds = GetPGuilds();

    //Insert new PinguGuild into pGuilds
    pGuilds[pGuilds.length] = new PinguGuild(guild);

    //Update guilds.json
    fs.writeFile('guilds.json', '', err => {
        if (err) console.log(err);
        else fs.appendFile('guilds.json', JSON.stringify(pGuilds, null, 2), err => {
            client.guilds.cache.find(guild => guild.id == `460926327269359626`).owner.createDM().then(DanhoDM => {
                if (err) DanhoDM.send(`I encountered and error while joining ${guild.name}:\n\n${err}`);
                else DanhoDM.send(`Successfully joined "**${guild.name}**", owned by <@${guild.owner.user.id}>`)
            });

        });
    })

    //Thank guild owner for adding Pingu
    guild.owner.user.createDM().then(OwnerDM =>
        OwnerDM.send(
            `Hi, <@${guild.owner.user.id}>!\n` +
            `I've successfully joined your server, "**${guild.name}**"!\n\n` +

            `Thank you for adding me!\n` +
            `Use \`*help\`, if you don't know how I work!`));
});
//Leaving a guild
client.once('guildDelete', guild => {
    const pGuilds = GetPGuilds();
    const pGuild = pGuilds.find(pg => pg.guildID == guild.id);
    let arr = [];
    pGuilds.forEach(pg => {
        if (pg != pGuild)
            arr.push(pg);
    });

    //Update guilds.json
    fs.writeFile('guilds.json', '', err => {
        if (err) console.log(err);
        else fs.appendFile('guilds.json', JSON.stringify(arr, null, 2), err => {
            client.guilds.cache.find(guild => guild.id == `460926327269359626`).owner.createDM().then(DanhoDM => {
                if (err) DanhoDM.send(`I encountered and error while updating guild.json from leaving ${guild.name}:\n\n${err}`);
                else DanhoDM.send(`Successfully left "**${guild.name}**", owned by <@${guild.owner.user.id}>`)
            });

        });
    })
})
//#endregion

//Message response
client.on('message', message => {
    //Find pGuilds in guilds.json
    let pGuilds;
    try {
        pGuilds = GetPGuilds()
        if (updatingPGuilds)
            updatingPGuilds = false;
    }
    catch {
        if (updatingPGuilds)
            return;
        updatingPGuilds = true;
        console.log(`guilds.json was empty! Running updatepguilds.js...`);
        AssignCommand('updatepguilds', null).execute(message, null);
    }

    //Find prefix in pGuild
    let Prefix;
    try {
        Prefix = pGuilds.find(pguild => pguild.guildID == message.guild.id).botPrefix;
        CheckRoleChange(message);
    } catch { Prefix = '*'; }

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

    if (!message.content.startsWith(Prefix) && !message.author.bot)
        if (!message.content.includes(SecondaryPrefix))
            return (message.channel.type == 'dm') ? ExecuteTellReply(message) : null;

    //Attempt "command" assignment
    let command = AssignCommand(commandName, args);
    if (command == null) return;



    //If I'm not interacted with don't do anything
    if (!message.content.startsWith(Prefix) || message.author.bot)
        if (!message.content.includes(SecondaryPrefix))
            return;

    //If guildOnly
    if (command.guildOnly && message.channel.type !== 'text')
        return message.reply(`I can't execute that command inside DMs!`);

    //If DevOnly
    if (command.id === 4 && message.author.id !== "245572699894710272")
        return message.reply(`Who do you think you are exactly?`);

    //Is User trying to change my prefix?
    TestForPrefixChange(message, commandName);

    //If not enough arguments are found
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage)
            reply += `\nThe proper usage would be: \`${Prefix}${command.name} ${command.usage}\``

        return message.channel.send(reply);
    }

    //If command on cooldown
    TestForCooldown(message, command);

    //Execute command and log it
    ExecuteAndLogCommand(message, args, Prefix, commandName, command);

});

client.login(token);

//#region OnMessage Methods
/**@param {string} commandName @param {string[]} args*/
function TestTagInteraction(commandName, args) {
    if (commandName.includes(SecondaryPrefix))
        commandName = args.shift();
    return commandName;
}
/**@param {string} commandName @param {string[]} args*/
function AssignCommand(commandName, args) {
    command = client.commands.get(commandName);

    //If command assignment failed, assign command
    if (!command) {
        try {
            let number = 0;
            do {
                number += 1;
                commandName = args[number].toLowerCase();
                command = client.commands.get(commandName);
            } while (!command);
        } catch { return; }
    }
    return command;
}
/**@param {Discord.Message} message @param {string} commandName*/
function TestForPrefixChange(message, commandName) {
    if (commandName === 'prefix')
        return message.channel.send(`Successfully changed my prefix to \`${prefix = args[0]}\`!`);
    else if (commandName === 'chatlog' ||
        commandName === 'cl') {
        var Embed = new Discord.RichEmbed()
            .setTitle('Previous logged messages')
            .setColor(0xfb8927)
            .setThumbnail(message.client.user.avatarURL)
            .setFooter(`I swear I don't mean to stalk you!`);

        if (PreviousMessages.length >= 10)
            for (var Message = 0; Message <= 10; Message++)
                Embed.addField(`Message #${Message++}: ${PreviousMessages[Message].author}`, PreviousMessages[Message].content);
        else
            for (var Message in PreviousMessages)
                Embed.addField(`Message #${Message++}: ${PreviousMessages[Message].author}`, PreviousMessages[Message].content)
        message.channel.send(Embed);
    }
    else {
        PreviousMessages[PreMsgCount] = message;
        PreMsgCount++;
    }
}
/**@param {Discord.Message} message @param {any} command*/
function TestForCooldown(message, command) {
    const cooldowns = new Discord.Collection();

    if (!cooldowns.has(command.name))
        cooldowns.set(command.name, new Discord.Collection());

    const now = Date.now(),
        timestamps = cooldowns.get(command.name),
        cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }

        timestamps.set(message.autothor.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
}
/**@param {Discord.Message} message @param {string[]} args @param {string} Prefix @param {string} commandName @param {any} command*/
function ExecuteAndLogCommand(message, args, Prefix, commandName, command) {
    let ConsoleLog = `User "${message.author.username}" executed command "${Prefix}${commandName}", from `;
    ConsoleLog += !message.guild ? `DMs and ` : `"${message.guild}", #${message.channel.name}, and `;

    //Attempt execution of command
    try {
        if (commandName == "tell") {
            if (args[0] == 'unset') {
                LastToUseTell = null;
                LastToBeTold = null;

                ConsoleLog += `successfully unset LastToUseTell & LastToBeTold.`;
                console.log(ConsoleLog);
                message.author.send(`Successfully unset LastToUseTell & LastToBeTold.`);
                return;
            }
            let Mention = args[0];
            while (Mention.includes('_')) Mention = Mention.replace('_', ' ');
            LastToBeTold = GetMention(message, Mention).user;
            LastToUseTell = message.author;
        }

        command.execute(message, args);
        ConsoleLog += `succeeded!\n`;
    } catch (error) {
        ConsoleLog += `failed! Error: ${error}`;
        message.author.send(`There was an error trying to execute that command! \n Error being: ${error}\n`);
    }
    console.log(ConsoleLog);
}
// #endregion

// #region Tell command related
/**@param {Discord.Message} message*/
function ExecuteTellReply(message) {
    let ConsoleLog = `${message.author.username} sent "${message.content}" to me in PMs.`
    if (LastToBeTold)
        ConsoleLog += ` Forwarded message to ${LastToBeTold}.`;
    console.log(ConsoleLog);

    /*try {
        for (var x = 0; x < TellArray.length; x++) {
            if (TellArray[x].Message == GetMessageContent(message))
                return TellArray[x].Giver.dmChannel.send(`${TellArray[x].Reciever.username} replied: \n"${message.content}"`)
        }
    } catch (error) {
        console.log(`Attempted to run ExecuteTellReply(message), but ran into an error:\n ${error}`)
    }*/

    if (message.author == LastToUseTell) {
        LastToBeTold.dmChannel.send(message.content);
        message.react('✅');
    }
    else if (LastToUseTell != null)
        LastToUseTell.dmChannel.send(`${message.author} replied: \n"${message.content}"`);
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
                if (Member.user.username == UserMention || Member.nickname == UserMention)
                    return Member;
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
            client.commands.set(command.name, command);
        } catch (error) {
            console.log(`"${file}" threw an exception:\n${error.message}\n`);
        }
    }
}
/**Checks if role color was changed, to update embed colors 
 * @param {Discord.Message} message*/
function CheckRoleChange(message) {
    //Get pGuild for message.guild
    const pGuilds = require('./guilds.json');
    const pGuild = pGuilds.find(pguild => pguild.guildID == message.guild.id);

    //Get the color of the Pingu role in message.guild
    const guildRoleColor = message.guild.me.roles.cache.find(botRoles => botRoles.managed).color;


    if (guildRoleColor == pGuild.embedColor)
        return;

    //Save Index of pGuild & log the change
    const pGuildIndex = pGuilds.indexOf(pGuild);
    console.log(`Embedcolor updated from ${pGuild.embedColor} to ${guildRoleColor}`);

    //Update pGuild.EmbedColor with guild's Pingu role color & put pGuild back into pGuilds
    pGuild.embedColor = guildRoleColor;
    pGuilds[pGuildIndex] = pGuild;

    //Update guilds.json
    fs.writeFile('guilds.json', '', err => {
        if (err) console.log(err);
        else fs.appendFile('guilds.json', JSON.stringify(pGuilds, null, 2), err => {
            client.guilds.cache.find(guild => guild.id == `460926327269359626`).owner.createDM().then(DanhoDM => {
                if (err) DanhoDM.send(`I encountered and error while updating my role color in "${message.guild.name}":\n\n${err}`);
                else console.log(`Successfully updated role color from "${message.guild.name}"`);
            });
        });
    })

}
/**@returns {PinguGuild[]} */
function GetPGuilds() {
    return require('./guilds.json');
}
//#endregion