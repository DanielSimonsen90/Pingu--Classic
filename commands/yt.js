const { Util, Message } = require('discord.js'),
    { api_key } = require('../config.json'),
    YouTube = require('simple-youtube-api'),
    ytdl = require('ytdl-core'),
    youtube = new YouTube(api_key),
    queue = new Map();
let serverQueue, voiceChannel;

module.exports = {
    name: 'yt',
    cooldown: 5,
    description: 'Plays stuff from Youtube',
    usage: '<action> [args[1]]',
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        const PermCheck = PermissionCheck(message);
        if (PermCheck != `Permission Granted`) return message.channel.send(PermCheck);

        serverQueue = queue.get(message.guild.id);
        voiceChannel = message.member.voice.channel;
        const command = args.shift();

        if (command === 'p' || command === 'play') return playCommand(message, args);
        else if (command === 'skip') return skipCommand(message);
        else if (command === 'stop') return stopCommand(message);
        else if (command === 'volume' || command === 'vol') return volumeCommand(message, args);
        else if (command === 'np') return message.channel.send(!serverQueue ? 'There is nothing playing.' : `🎶 Now playing: **${serverQueue.songs[0].title}**`);
        else if (command === 'queue' || command === 'q') return message.channel.send(!serverQueue ? 'There is nothing playing.' : `__**Song queue:**__${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}**Now playing:** ${serverQueue.songs[0].title}`);
        else if (command === 'pause') return pauseCommand(message);
        else if (command === 'resume') return resumeCommand(message);
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

//#region Command Handlers
/**@param {Message} message @param {string[]} args*/
function playCommand(message, args) {
    const searchString = args.slice(2).join(' '),
        url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';

    if (!voiceChannel)
        return message.channel.send(`You need to be in a voice channel to play music!`);
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        var playlist;
        youtube.getPlaylist(url).then(Playlist => {
            playlist = Playlist;
            playlist.getVideos().then(videos => {
                for (const video of Object.values(videos))
                    youtube.getVideoByID(video.id).then(video2 => handleVideo(video2, message, voiceChannel, true));
            });
        });
        return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
    }

    try {
        var video;
        youtube.getVideo(url).then((Video) => { video = Video });
    } catch (error) {
        try {
            var videos;
            youtube.searchVideos(searchString, 10).then((Video) => { videos = Video });
            let index = 0;
            message.channel.send(`__**Song selection:**__${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}Please provide a value to select one of the search results ranging from 1-10.`);
            try {
                var response;
                message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                    maxMatches: 1,
                    time: 10000,
                    errors: ['time']
                }).then(Response => response = Response);
            } catch (err) {
                console.error(err);
                return message.channel.send('No or invalid value entered, cancelling video selection.');
            }
            const videoIndex = parseInt(response.first().content);
            var video;
            youtube.getVideoByID(videos[videoIndex - 1].id).then(Video => video = Video);
        } catch (err) {
            console.error(err);
            return message.channel.send('🆘 I could not obtain any search results.');
        }

        return handleVideo(video, message, voiceChannel);
    }
}
/** @param {Message} message*/
function skipCommand(message) {
    if (!voiceChannel)
        return message.channel.send('You are not in a voice channel!');
    else if (!serverQueue)
        return message.channel.send('There is nothing playing that I could skip for you.');

    serverQueue.connection.dispatcher.end('Skip command has been used!');
}
/**@param {Message} message*/
function stopCommand(message) {
    if (!voiceChannel)
        return message.channel.send('You are not in a voice channel!');
    else if (!serverQueue)
        return message.channel.send('There is nothing playing that I could stop for you.');

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end('Stop command has been used!');
}
/** @param {Message} message @param {string[]} args*/
function volumeCommand(message, args) {
    if (!voiceChannel)
        return message.channel.send('You are not in a voice channel!');
    else if (!serverQueue)
        return message.channel.send('There is nothing playing.');
    else if (!args[0])
        return message.channel.send(`The current volume is: **${serverQueue.volume}**`);

    serverQueue.volume = args[0];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
    return message.channel.send(`I set the volume to: **${args[0]}**`);
}
/**@param {Message} message*/
function pauseCommand(message) {
    if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        return message.channel.send(':pause_button: Paused the music for you!');
    }
    return message.channel.send('There is nothing playing.');
}
/**@param {Message} message*/
function resumeCommand(message) {
    if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return message.channel.send(':arrow_forward: Resumed the music for you!');
    }
    return message.channel.send('There is nothing playing.');
}
//#endregion

//#region Sub-functions
async function handleVideo(video, message, voiceChannel, playlist = false) {
    const serverQueue = queue.get(message.guild.id);
    console.log(video);
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(message.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            var connection;
            voiceChannel.join().then((Con) => { connection = Con });
            queueConstruct.connection = connection;
            playCommand(message.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            queue.delete(message.guild.id);
            return message.channel.send(`I could not join the voice channel: ${error}`);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        if (playlist)
            return undefined;
        else return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
    }
    return undefined;
}
function playCommand(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        return queue.delete(guild.id);
    }
    console.log(serverQueue.songs);

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', reason => {
            (reason === 'Stream is not generating quickly enough.') ?
                console.log('Song ended.') :
                console.log(reason);
            serverQueue.songs.shift();
            playCommand(guild, serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
}
//#endregion