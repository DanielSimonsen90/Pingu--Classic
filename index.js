//Construction variables
const fs = require('fs'),
    Discord = require('discord.js'),
    { token } = require('./config.json'),
    SecondaryPrefix = '<@562176550674366464>',
    client = new Discord.Client(),
    commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Discord.Collection();

//Does individual command work?
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


//Am I ready to launch?
client.once('ready', () => {
    console.log(`\nIt's alive!\n`);
    client.user.setActivity('your screams for *help', { type: 'LISTENING' });
})

let PreviousMessages = [],
    PreMsgCount = 0;

//Message response
client.on('message', message => {
    let Prefix = '*';
    const args = message.content.slice(Prefix.length).split(/ +/) ||
                 message.content.slice('@562176550674366464').split(/ +/);
    let commandName = args.shift().toLowerCase();

    //If mentioned without prefix
    if (message.content === SecondaryPrefix)
        return message.channel.send(`My prefix is \`${Prefix}\``);

    //If interacted via @
    TestTagInteraction(commandName, args);

    //Attempt "command" assignment
    let command = AssignCommand(commandName, args, client);
    if (command == null) return;

    

    //If I'm not interacted with don't do anything
    if (!message.content.startsWith(Prefix) || message.author.bot)
        if (!message.content.startsWith(SecondaryPrefix))
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

})

client.login(token);

function TestTagInteraction(commandName, args) {
    if (commandName === '@562176550674366464>') {
        commandName = args[0].toLowerCase();
        args[0] = null;

        try {
            for (var i = 0; i < args.length; i++) {
                var j = i + 1;
                if (!args[j])
                    args[i] = args[j];
            }
        } catch { }
    }
}
function AssignCommand(commandName, args, client) {
    command = client.commands.get(commandName);

    //If command assignment failed, assign command
    if (!command) {
        try {
            let number = 0;
            do {
                number += 1;
                commandName = args[number].toLowerCase();
                command = client.command.get(commandName);
            } while (!command);
        } catch { return; }
    }
    return command;
}
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
function ExecuteAndLogCommand(message, args, Prefix, commandName, command) {
    //if (commandName === 'giveaway') console.clear();
   
    let ConsoleLog = `User "${message.author.username}" executed command "${Prefix}${commandName}", from `;
    if (!message.guild) ConsoleLog += `DMs and `;
    else ConsoleLog += `"${message.guild}", #${message.channel.name}, and `;

    //Attempt execution of command
    try {
        command.execute(message, args);
        ConsoleLog += `succeeded!`;
    } catch (error) {
        ConsoleLog += `failed! Error: ${error}`;
        message.author.send(`There was an error trying to execute that command! \n Error being: ${error}`);
    }
    console.log(ConsoleLog);
}