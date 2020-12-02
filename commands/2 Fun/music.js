const { Message, MessageEmbed, VoiceChannel, Permissions } = require('discord.js'),
    ytdl = require('ytdl-core');
const { PinguGuild, Queue, Song, PinguLibrary } = require('../../PinguPackage');
var MainActivity, MainNickname;

module.exports = {
    name: 'music',
    description: 'plays moives and videos',
    usage: `<play <link | search>> | volume [new volume] | move <posA> <posB> | stop | skip | nowplaying | queue | pause | resume>`,
    guildOnly: true,
    id: 2,
    example: ["play https://www.youtube.com/watch?v=dQw4w9WgXcQ",],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        const voiceChannel = message.member.voice.channel,
            PermCheck = PermissionCheck(message, voiceChannel);
        if (PermCheck != PinguLibrary.PermissionGranted) return message.channel.send(PermCheck);

        const command = args.shift().toLowerCase(),
            queue = PinguGuild.GetPGuild(message.guild).musicQueue;
        MainActivity = message.client.user.presence;

        if (command == 'play' || command == 'p')
            return HandlePlay(message, args, voiceChannel, queue);

        if (!queue) return message.channel.send('Nothing is playing!');

        switch (command) {
            case 'st': case 'stop': HandleStop(message, queue); break;
            case 'sk': case 'skip': HandleSkip(message, queue); break;
            case 'np': case 'nowplaying': HandleNowPlaying(message, queue); break;
            case 'vol': case 'volume': HandleVolume(message, args[0], queue); break;
            case 'q': case 'queue': HandleQueue(message, queue); break;
            case 'pause': case 'resume': HandlePauseResume(message, queue, command == 'pause'); break;
            case 'move': case 'mo': HandleMove(message, queue, args); break;
            default: return PinguLibrary.errorLog(message.client, "Ran default case", message.content);
        }
    },
};

/**@param {Message} message @param {VoiceChannel} voiceChannel*/
function PermissionCheck(message, voiceChannel) {
    var permCheck = PinguLibrary.PermissionCheck(message, [
        Permissions.FLAGS.SEND_MESSAGES,
        Permissions.FLAGS.SPEAK,
    ]);

    if (permCheck != PinguLibrary.PermissionGranted) return permCheck;

    if (!voiceChannel)
        return `Please join a **voice channel** before executing command ${message.author}!`;

    if (!voiceChannel.permissionsFor(message.guild.me).has(Permissions.FLAGS.CONNECT))
        return `I can't connect to your voice channel!`;

    return PinguLibrary.PermissionGranted;
}

//#region Command Handling
/**Executes when author sends *music play
 * @param {Message} message 
 * @param {string[]} args 
 * @param {VoiceChannel} voiceChannel
 * @param {Queue} queue*/
async function HandlePlay(message, args, voiceChannel, queue) {
    if (!args[0]) return message.channel.send(`You didn't give me something to play!`);

    var vInfo = await ytdl.getInfo(args[0].replace(/<(.+)>/g, '$1')).catch(async err => {
        await PinguLibrary.errorLog(message.client, `Unable to get video info`, message.content, err);
        var errMsg = `I ran into an error trying to get the video information! I've contacted my developers.`;
        if (message.channel != queue.logChannel)
            message.channel.send(errMsg);
        queue.logChannel.send(errMsg);
        return null;
    });

    const song = new Song(vInfo, message.author);

    if (!queue) {
        queue = new Queue(message.channel, voiceChannel, [song]);
        queue.connection = await voiceChannel.join();
        Play(message, queue.songs[0], queue);
    }
    else {
        if (!queue.playing) return HandlePauseResume(message, queue);
        queue.add(song);
        message.channel.send(`**${song.title}** was added to the queue.`);
    }
}
/**Executes when author sends *music stop
 * @param {Message} message
 * @param {Queue} queue*/
function HandleStop(message, queue) {
    announceMessage(message, queue,
        `Stopped!`, `${message.member.displayName} stopped the radio!`
    );

    queue.songs = [];
    queue.connection.dispatcher.end();
    if (message.guild.me.permissions.has("CHANGE_NICKNAME"))
        message.guild.me.setNickname(MainNickname);
    message.client.user.setActivity(MainActivity);
}
/**Executes when author sends *music skip
 * @param {Message} message
 * @param {Queue} queue*/
function HandleSkip(message, queue) {
    queue.connection.dispatcher.end();

    announceMessage(message, queue,
        "Skipped!",
        `Skipped, requested by **${message.guild.member(message.author).nickname}**.`
    );
}
/**Executes when author sends *music np
 * @param {Message} message
 * @param {Queue} queue*/
function HandleNowPlaying(message, queue) {
    message.channel.send(`Currently playing: **${queue.songs[0].title}**`);
}
/**Executes when author sends *music volume
 * @param {Message} message 
 * @param {string} newVolume
 * @param {Queue} queue*/
function HandleVolume(message, newVolume, queue) {
    if (!newVolume) return message.channel.send(`Volume is currently **${queue.volume}**`);

    queue.connection.dispatcher.setVolumeLogarithmic(newVolume / 5);
    const previousVolume = queue.volume;
    queue.volume = parseInt(newVolume);

    announceMessage(message, queue,
        `Volumed changed from **${previousVolume}** to **${newVolume}**.`,
        `Volumed changed from **${previousVolume}** to **${newVolume}** by ${message.member.displayName}`
    );
}
/**Executes when author sends *music queue
 * @param {Message} message
 * @param {Queue} queue*/
function HandleQueue(message, queue) {
    const embed = new MessageEmbed()
        .setTitle(`Queue for ${queue.voiceChannel.name}`)
        .setImage(message.client.user.avatarURL())
        .setColor(PinguGuild.GetPGuild(message.guild).embedColor);

    try { queue.songs.forEach(song => embed.addField(`[${queue.songs.indexOf(song) + 1}]: ${song.title}`, `Requested by: ${song.author} | Length: ${song.length}`)) }
    catch (err) {
        PinguLibrary.errorLog(message.client, `Tried to send queue for ${queue.voiceChannel.guild.name}`, message.content, err);
        return message.channel.send(`I ran into an error trying to get the queue, and sent a message to my developers!`);
    }

    return message.channel.send(embed);
}
/**Executes when author sends *music pause or *music resume
 * @param {Message} message
 * @param {Queue} queue
 * @param {boolean} pauseRequest*/
function HandlePauseResume(message, queue, pauseRequest) {
    if (!queue.playing && pauseRequest) return message.channel.send('Music is already paused!');
    else if (queue.playing && !pauseRequest) return message.channel.send(`I've already resumed the music again!`);

    if (pauseRequest) queue.connection.dispatcher.pause();
    else queue.connection.dispatcher.resume();

    queue.playing = !pauseRequest;
    const PauseOrResume = pauseRequest ? 'Paused' : 'Resumed';

    announceMessage(message, queue,
        `${PauseOrResume} music.`,
        `${PauseOrResume} by ${message.member.displayName}.`
    );
}
/**Executes when author sends *music move
 * @param {Message} message
 * @param {Queue} queue
 * @param {string[]} args*/
function HandleMove(message, queue, args) {
    message.channel.send(`That is not implemented yet!`);
}
//#endregion

/**@param {Message} message @param {Song} song @param {Queue} queue*/
async function Play(message, song, queue) {
    var pGuild = PinguGuild.GetPGuild(message.guild);
    pGuild.musicQueue = queue;

    if (!song) {
        queue.logChannel.send('Thank you for listening!');
        queue.voiceChannel.leave();
        PinguGuild.GetPGuild(message.guild).musicQueue = null;
        message.client.user.presence = MainActivity;
        return;
    }

    queue.connection.play(ytdl(song.link))
        .on('start', () => {
            if (message.guild.me.permissions.has("CHANGE_NICKNAME")) {
                MainNickname = message.guild.me.displayName;
                message.guild.me.setNickname(`[${message.member.displayName} Radio] ${MainNickname}`)
                    .catch(() => message.guild.me.setNickname(`[${message.author.username} Radio] ${MainNickname}`))
                    .catch(() => message.guild.me.setNickname(`[${message.client.user.username} Radio] ${MainNickname}`))
                    .catch(() => message.guild.me.setNickname(MainNickname));
            }

            message.client.user.setActivity(`${song.title} in ${queue.voiceChannel.name}`, 'PLAYING');
            queue.logChannel.send(`**Now playing:** ${song.title}`);

            //Am I saving too much?
            //PinguGuild.UpdatePGuildsJSONAsync(message.client, module.exports.name,
            //    `Saved Queue to pGuilds.json`,
            //    `Error while saving **${message.guild.name}**'s queue to pGuilds.json`
            //);
        })
        .on('error', err => {
            PinguLibrary.errorLog(message.client, "Voice connection error", message.content, err);
            announceMessage(message, queue, `I had a voice connection error! I've notified my developers.`)

            pGuild.musicQueue = null;
        })
        .on('end', () => {
            queue.songs.shift();
            Play(message, queue.songs[0], queue);
        })
        .on('finish', () => {
            queue.logChannel.send('Finished!')
        })
        .setVolumeLogarithmic(queue.volume);
}
/**@param {Message} message
 * @param {Queue} queue
 * @param {string} msg*/
function announceMessage(message, queue, senderMsg, logMsg) {
    if (message.channel != queue.logChannel)
        message.channel.send(senderMsg);
    return queue.logChannel((logMsg || senderMsg));
}