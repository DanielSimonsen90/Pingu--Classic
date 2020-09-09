const { Util, Message, VoiceConnection } = require('discord.js'),
    { api_key } = require('../../config.json'),
    YouTube = require('simple-youtube-api'),
    ytdl = require('ytdl-core'),
    youtube = new YouTube(api_key);
let serverQueue, servers = [];

module.exports = {
    name: 'yt',
    cooldown: 5,
    description: 'Plays stuff from Youtube',
    usage: '<action> [args[1]]',
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        const PermCheck = PermissionCheck(message);
        if (PermCheck != `Permission Granted`) return message.channel.send(PermCheck);

        switch (args.shift()) {
            case "play": playCommand(message, args); return;
            case "skip": skipCommand(message); return;
            case "stop": stopCommand(message); return;
            default: message.channel.send(`Invalid argument!`); return;
        }

    },
};

/**@param {Message} message*/
function PermissionCheck(message) {
    if (message.channel.type == 'dm')
        return `I can't play music for you in DMs..?`;

    const PermissionCheck = message.channel.permissionsFor(message.client.user),
        PermArr = ["SEND_MESSAGES", "CONNECT", "SPEAK", "EMBED_LINKS"];
    for (var Perm = 0; Perm < PermArr.length; Perm++)
        if (!PermissionCheck.has(PermArr[Perm]))
            return `Sorry, ${message.author}. It seems like I don't have the **${PermArr[Perm]}** permission.`;
    return `Permission Granted`;
}

//#region CommandHanlders
/** @param {Message} message @param {string[]} args */
function playCommand(message, args) {
    if (!args[0])
        return message.channel.send(`You need to provide a link!`);
    else if (!message.member.voice.channel)
        return message.channel.send(`You need to connect to a voice channel, so I can play for you!`);
    else if (!servers[message.guild.id.substring(0, 5)])
        servers[message.guild.id.substring(0, 5)] = { queue: [] }

    let server = servers[message.guild.id.substring(0, 5)];
    server.queue.push(args[0]);

    if (!message.guild.voice)
        message.member.voice.channel.join().then(conn => play(conn, message, server))
}

/**@param {Message} message*/
function skipCommand(message) {
    let server = servers[message.guild.id.substring(0, 5)];
    if (server.dispatcher) server.dispatcher.end();
}

/**@param {Message} message*/
function stopCommand(message) {
    let server = servers[message.guild.id.substring(0, 5)];
    if (message.guild.voice) {
        try {
            for (var x = server.queue.length - 1; x >= 0; x--)
                server.queue.splice(x, 1);
            server.dispatcher.end();
        }
        catch {
            //console.log('Unable to find queue in ' + message.guild.voice.channel.name)
            try { message.guild.voice.channel.leave(); }
            catch {message.guild.voice.channel.join().then(conn => conn.disconnect())}
        }
        console.log(`Stopped queue in VC: ${message.guild.voice.channel.name} from ${message.guild.name}.`);
    }
    if (message.guild.voice) message.guild.voice.connection.disconnect();
}
//#endregion

//#region Misc Functions
/**@param {VoiceConnection} conn @param {Message} message @param {any} server*/
function play(conn, message, server) {
    server.dispatcher = conn.play(ytdl(server.queue[0], { filter: "audioonly" }));
    server.queue.shift();

    server.dispatcher.on('end', () => {
        if (server.queue[0]) play(conn, message);
        else conn.disconnect();
    });
}
//#endregion