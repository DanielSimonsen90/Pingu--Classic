const { Prefix } = require('../../config.json'),
    { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    usage: '[command]',
    id: 1,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        //Create variables
        const data = [], //data for embed
            { commands } = message.client; //Bot's commands
        let embed = new MessageEmbed() //embed 
            .setColor(0xfb8927)
            .setThumbnail(message.client.user.avatarURL),
            ScriptsCategorized = ["", "Utility", "Fun", "Support", "DevOnly"];

        //If no argument was provided
        if (args.length === 0) {
            //Edit embed to default help menu
            embed.setTitle('Pingu Help Menu!')
                .setDescription('Use these arguments to see what commands I have in a specific category!')
                .setFooter(`Developed by Simonsen Techs`);

            //Insert data for help menu
            for (var x = 1; x < 4; x++)
                embed.addField(`**__${Prefix}${ScriptsCategorized[x]}__**`, `\`${Prefix}help ${ScriptsCategorized[x]}\``, true);

            //Return embed
            return message.author.send(embed)
                .then(() => {
                    if (message.channel.type == 'dm') return;
                    message.reply(`I've sent you a DM with all my commands!`);
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply(`It seems like I can't DM you! Do you have DMs disabled?`);
                });
        }

        //If 1 argument is provided || if args[0] exists
        else if (args.length === 1) {
            //Set all from ScriptsCategorized to lowercase
            for (var x = 0; x < ScriptsCategorized.length; x++)
                ScriptsCategorized[x] = ScriptsCategorized[x].toLowerCase();

            //If args[0] is a number, set number to text
            switch (args[0]) {
                case '1': args[0] = ScriptsCategorized[1]; break;
                case '2': args[0] = ScriptsCategorized[2]; break;
                case '3': args[0] = ScriptsCategorized[3]; break;
                case '4': args[0] = ScriptsCategorized[4]; break;
                default: break;
            }

            //Set args[0] to lowercase
            args[0] = args[0].toLowerCase();

            //If Pingu doesn't have args[0] as a command, and ScriptsCategorized doesn't contain it either
            if (!commands.has(args[0]) && !ScriptsCategorized.includes(args[0]))
                //Treat as unknown argument, and set to Utility
                args[0] = "utility";

            //If ScriptsCategorized has args[0] || If message.author isn't executing *help <script command>, but *help <category>
            if (ScriptsCategorized.includes(args[0])) {
                //If "DevOnly" / "Banned" was used
                if (args[0] === "devonly" || args[0] === "banned")
                    //Is message.author Danho?
                    if (message.author.id !== "245572699894710272")
                        //If not, user cannot perform this help
                        return message.channel.send(`Sorry ${message.author}, but you're not cool enough to use that!`)
                    else args[0] = 'devonly';

                //Write all data into embed, if id matches the index of args[0] in ScriptsCategorized
                data.push(commands.map((command) => {
                    if (command.id === ScriptsCategorized.indexOf(args[0])) {
                        let FieldContent = `"${command.description}" \n\`${Prefix}${command.name}`;
                        if (command.usage) FieldContent += ` ${command.usage}`;
                        embed.addField(`**__${prefi}${command.name}__**`,`${FieldContent}\``);
                    }
                }));

                //Create footer
                let Footer = `Keep in mind that I'm still learning and will eventually have new features!\nYou are now viewing page ${ScriptsCategorized.indexOf(args[0])}, being the help page of ${args[0]}.`;
                //If message.author is viewing page 3 (*help Support)
                if (ScriptsCategorized.indexOf(args[0]) <= 3)
                    //Update Footer
                    Footer += `Try my other help commands!\n${Prefix}help to view them!`;
                //Update embed's Footer with Footer
                embed.setFooter(Footer)
                    .setDescription(`All of my nooty commands in **${args[0]}** (")>`)
                    .setTitle(`Pingu Commands: ${args[0]}`);

                //Return embed
                return message.author.send(embed)
                    .then(() => {
                        if (message.channel.type == 'dm') return;
                        message.reply(`I've sent you a DM with all my commands!`);
                    })
                    .catch(error => {
                        console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                        message.reply(`It seems like I can't DM you! Do you have DMs disabled?`);
                    });
            }
        }

        //Create variables to find the specific command message.author is looking for
        const commandName = args[0].toLowerCase(),
            command = message.client.commands.get(commandName);
                //|| commands.find(c => c.aliases && c.aliases.includes(commandName));

        //Update embed
        embed.setTitle(Prefix + command.name)
            .addField('Description', `"${command.description}"`)
            .addField('Usage', `${Prefix}${command.name} ${command.usage}`)
            .setColor(0xfb8927)
            .setFooter('Developed by Simonsen Techs');

        //Send embed
        message.channel.send(embed);
    },
};