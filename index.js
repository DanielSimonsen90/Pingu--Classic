//Construction variables
//#region Variables
const fs = require('fs'),
    Discord = require('discord.js'),
    { token } = require('./config.json'),
    SecondaryPrefix = '562176550674366464',
    ScriptsCategorized = ["", "Utility", "Fun", "Support", "DevOnly"],
    client = new Discord.Client();
client.commands = new Discord.Collection();

let PreviousMessages = [],
    PreMsgCount = 0,
    LastToUseTell,
    LastToBeTold;
//#endregion

//Does individual command work?
for (var x = 1; x < ScriptsCategorized.length; x++)
    SetCommand(`${x} ${ScriptsCategorized[x]}`);

//Am I ready to launch?
client.once('ready', () => {
    console.log(`\nIt's alive!\n`);
    client.user.setActivity('your screams for *help', { type: 'LISTENING' });
})

//Message response
client.on('message', message => {
    const { Prefix } = require('./config.json');
    const args = message.content.slice(Prefix.length).split(/ +/) ||
        message.content.slice(SecondaryPrefix).split(/ +/);
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
        ConsoleLog += `succeeded!`;
    } catch (error) {
        ConsoleLog += `failed! Error: ${error}`;
        message.author.send(`There was an error trying to execute that command! \n Error being: ${error}`);
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