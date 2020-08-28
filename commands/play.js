const { Message, MessageEmbed } = require('discord.js'),
    { prefix } = require('../config.json'),
    fs = require('fs');

module.exports = {
    name: 'play',
    description: 'plays moives and videos',
    usage: `<start | stop> [music | link]`,
    //id: 2,
    guildOnly: true,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        const PermCheck = PermissionCheck(message);
        if (PermCheck != `Permission Granted`) message.channel.send(PermCheck);

        const MainActivity = message.client.user.presence,
            embed = new MessageEmbed(),
            { voiceChannel } = message.member;

        message.delete();

        if (args[0] == "start" && args[1]) {
            voiceChannel.join().then(connection => {
                message.client.user.setActivity(`${args[1]} in ${voiceChannel.name}, ${message.guild.name}`, { type: 'PLAYING' });
                const dispatcher = connection.playFile(`./play/files/${args[1]}.mp4`, { seek: args[2] }) ||
                    connection.playFile(`./play/files/${args[1]}.mp3`, { seek: args[2] }) ||
                    connection.playStream(args[1]);

                embed.setTitle(`:play_pause: Now watching ${arge[1]}!`)
                    .setDescription(`I am now playing ${args[1]} in ${voiceChannel.name}.\nCome and listen!`)
                    .attachFiles([`./play/thumbnails/${args[1]}.png`])
                    .setImage(`attachment://${args[1]}.png`)
                    .setColor(0x4ECD03);

                message.channel.send(embed);

                dispatcher.on('end', () => {
                    embed.setTitle(`:stop_button: ${args[1]} has finished playing!`)
                        .setDescription('Thank you for all participating! \nAnd if you missed it, better luck next time :pensive:')
                        .attachFiles([`./play/thumbnails/${args[1]}.png`])
                        .setImage(`attachment://${args[1]}.png`)
                        .setColor(0xFF0000);
                    message.channel.send(embed)

                    message.client.user.setActivity(MainActivity);
                    connection.channel.leave();
                });

                dispatcher.on('error', e => { console.log(e); });
                dispatcher.setVolume(1);
            });
        }
        else if (args[0] == "stop") {
            voiceChannel.join()
                .then(connection => {
                    message.client.user.setActivity(MainActivity);
                    connection.channel.leave();
                });
        }
        else if (args[0] == "list") {
            embed.setTitle("List of files")
                //.attachFiles([`./play/thumbnails/movie.png`])
                //.setThumbnail(`attachment://movie.png`)
                .setColor(0xf7afff);

            const files = fs.readdirSync("./play/files/");
            for (var file in files) {
                const fileName = files[file].substring(0, files[file].length - 4);
                embed.addField(`__${fileName}__`, `\`${prefix}${this.name} ${fileName}\``)
            }

            message.author.send(embed);
        }
        else {
            embed.setTitle("Argument not recognized!")
                .setDescription(`Your input "${args[1]}" was not recognized! Try:\n ${prefix}${this.name} ${this.usage}.`)
                .setColor(0xfb8927);
            message.author.send(embed);
        }
    },
};

/**@param {Message} message*/
function PermissionCheck(message) {
    if (message.channel.type == 'dm')
        return message.author.send(`I execute this command in DMs.`);

    const PermissionCheck = message.channel.permissionsFor(message.guild.client.user),
        PermArr = ["SEND_MESSAGES", "MANAGE_MESSAGES", "CONNECT", "SPEAK"];
    for (var Perm = 0; Perm < PermArr.length; Perm++)
        if (!PermissionCheck.has(PermArr[Perm]))
            return `Sorry, ${message.author}. It seems like I don't have the **${PermArr[Perm]}** permission.`
    if (!voiceChannel)
        return `Please join a **voice channel** before executing command ${message.author}!`;
    return `Permission Granted`;
}