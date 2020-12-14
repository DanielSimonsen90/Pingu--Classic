const { Message, Guild, MessageEmbed, VoiceChannel } = require('discord.js'),
    ytdl = require('ytdl-core'),
    YouTube = require('simple-youtube-api'),
    { youtube_api } = require('../../config.json');
const { PinguGuild, Queue, Song, PinguLibrary, PQueue, PClient, DiscordPermissions } = require('../../PinguPackage');
var youTube = new YouTube(youtube_api), commandName = "";


module.exports = {
    name: 'music',
    description: 'plays moives and videos',
    usage: `<play <link | search>> | volume [new volume] | move <posA> <posB> | stop | skip | nowplaying | queue | pause | resume>`,
    guildOnly: true,
    id: 2,
    example: ["play https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    musicCommands: [
        { name: "join", alias: "summon", cmdHandler: HandleJoin },
        { name: "disconnect", alias: "dc", cmdHandler: HandleDisconnect },
        { name: "play", alias: "p", cmdHandler: HandlePlay },
        { name: "playskip", alias: "ps", cmdHandler: HandlePlaySkip },
        { name: "remove", alias: "yeet", cmdHandler: HandleRemove },
        { name: "stop", alias: "st", cmdHandler: HandleStop },
        { name: "skip", alias: "sk", cmdHandler: HandleSkip },
        { name: "nowplaying", alias: "np", cmdHandler: HandleNowPlaying },
        { name: "volume", alias: "vol", cmdHandler: HandleVolume },
        { name: "queue", alias: "q", cmdHandler: HandleQueue },
        { name: "pause", alias: "stfu", cmdHandler: HandlePauseResume },
        { name: "resume", alias: "speak", cmdHandler: HandlePauseResume },
        { name: "move", alias: "mo", cmdHandler: HandleMove },
        { name: "loop", alias: "repeat", cmdHandler: HandleLoop }
    ],
    permissions: [DiscordPermissions.SEND_MESSAGES, DiscordPermissions.SPEAK],
    /**@param {Message} message @param {string[]} args*/
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel,
            PermCheck = PermissionCheck(message, voiceChannel);
        if (PermCheck != PinguLibrary.PermissionGranted) return message.channel.send(PermCheck);

        commandName = args.shift().toLowerCase();
        var queue = await GetQueueElements(message.guild, PinguGuild.GetPGuild(message.guild).musicQueue);

        switch (commandName) {
            case "join": case "summon": return HandleJoin(message, args.join(' '));
            case "disconnect": case "dc": return HandleDisconnect(message, queue);
            case "play": case "p": return HandlePlay(message, args, voiceChannel, queue);
            case "playskip": case "ps": return queue ?
                HandlePlaySkip(message, queue, args) :
                HandlePlay(message, args, voiceChannel, queue); 
        }

        if (!queue) return message.channel.send('Nothing is playing!');

        var command = this.musicCommands.find(cmd => [cmd.name, cmd.alias].includes(commandName))
        if (!command) return message.channel.send(`I didn't recognize that command!`);

        if (["pause", "stfu", "resume", "speak"].includes(commandName))
            HandlePauseResume(message, queue, ["pause", "stfu"].includes(commandName));
        else if (['vol', 'volume'].includes(commandName))
            HandleVolume(message, queue, args[0]);
        else command.cmdHandler(message, queue, args);
    },
};

/**@param {Message} message @param {VoiceChannel} voiceChannel*/
function PermissionCheck(message, voiceChannel) {
    if (!voiceChannel)
        return `Please join a **voice channel** ${message.author}!`;

    if (!voiceChannel.permissionsFor(message.guild.me).has(DiscordPermissions.CONNECT))
        return `I can't connect to your voice channel!`;

    return PinguLibrary.PermissionGranted;
}

//#region Command Handling
/**@param {Message} message 
 * @param {string} channelData*/
async function HandleJoin(message, channelData) {
    var channel = channelData && message.guild.channels.cache.find(c =>
        c.type == 'voice' && ([c.id, c.name.toLowerCase()].includes(channelData.toLowerCase()))
    ) || message.member.voice.channel;
    return channel.join();
}
/**@param {Message} message 
 * @param {Queue} queue*/
async function HandleDisconnect(message, queue) {
    if (!message.guild.me.voice.connection) return message.channel.send(`I'm not in a voice chat!`);
    else if (!message.member.voice.channel == message.guild.me.voice.channel) return message.channel.send(`You're not in my voice channel, so you can't disconnect me!`);

    message.guild.me.voice.connection.disconnect();
    AnnounceMessage(message, queue, `Disconnected!`, `**${message.member.displayName}** disconnected me!`);

    queue.playing = false;

    return await UpdateQueue(message, queue, "HandleDisconnect",
        `Disconnected from ${queue.voiceChannel.name}`,
        `Error while disconnecting from ${queue.voiceChannel.name}`
    );
}
/**Executes when author sends *music play
 * @param {Message} message 
 * @param {string[]} args 
 * @param {VoiceChannel} voiceChannel
 * @param {Queue} queue*/
async function HandlePlay(message, args, voiceChannel, queue) {
    if (!args[0] && !queue.songs[0]) return message.channel.send(`You didn't give me something to play!`);

    var searchType = 'video';
    if (args[0] && args[0].toLowerCase() == 'playlist')
        searchType = args.shift();
    var url = args.join(' ');

    try {
        var video = await youTube.getVideo(url)
    } catch (convErr) {
        if (!convErr.message.includes(`No video ID found in URL:`))
            PinguLibrary.errorLog(message.client, `URL failed`, message.content, convErr);

        try {
            if (searchType == 'video') {
                var searchResultVideos = await youTube.searchVideos(`"${url}"`, 1);
                video = await youTube.getVideoByID(searchResultVideos[0].id);
            }
            else {
                var searchResultVideos = await youTube.searchPlaylists(`"${url}"`, 1, { type: 'playlist' })
                var playlist = await youTube.getPlaylistByID(searchResultVideos[0].id);
                var playlistVideos = await playlist.getVideos();
                var ytdlCoreVideos = playlistVideos.map(v => ytdl.getInfo(v.url));

                let songs = [];
                for (var i = 0; i < ytdlCoreVideos.length; i++) {
                    let song = new Song(await ytdlCoreVideos[i], message.author);
                    songs.push(song);
                }

                if (queue) {
                    queue.add(songs);

                    await UpdateQueue(message, queue, "HandlePlay",
                        `Playlist was added to queue`,
                        `Unable to update queue with playlist videos`
                    );

                    return AnnounceMessage(message, queue,
                        `Added **${playlist.title}** to the queue!`,
                        `${message.author.username} added **${playlist.title}** (playlist) to the queue.`
                    );
                }
                else {
                    queue = new Queue(new PClient(message.client, message.guild), message.channel, voiceChannel, songs);
                    queue.connection = await voiceChannel.join();
                    return Play(message, queue.songs[0], queue);
                }
            }
        } catch (err) {
            if (err.message == "Cannot read property 'id' of undefined")
                return message.channel.send(`I couldn't find that!`);

            return PinguLibrary.errorLog(message.client, `Search failed`, message.content, err);
        }
    }

    var vInfo = await ytdl.getInfo((video.url || queue.songs[0].link)).catch(async err => {
        await PinguLibrary.errorLog(message.client, `Unable to get video info`, message.content, err);
        AnnounceMessage(message, queue, `I ran into an error trying to get the video information! I've contacted my developers.`)
        return null;
    });

    let song = new Song(message.author, vInfo.videoDetails);
    if (!song) return message.channel.send(`I couldn't get that song!`);
    else if (!song.link) song = new Song(message.author, vInfo.videoDetails);

    if (!queue) {
        queue = new Queue(new PClient(message.client, message.guild), message.channel, voiceChannel, [song]);
        queue.connection = await voiceChannel.join();
        Play(message, queue.songs[0], queue);
    }
    else if (!args[0]) {
        queue.connection = await queue.voiceChannel.join();
        queue.connection.dispatcher.resume();
    }
    else {
        if (!queue.playing) return HandlePauseResume(message, queue);
        if (message.content.includes("playskip")) {
            queue.addFirst(song);
        }
        else {
            queue.add(song);
            message.channel.send(`**${song.title}** ${(song.author ? `from ${song.author}` : "")} was added to the queue.`);
        }

        UpdateQueue(message, queue, "HandlePlay",
            `${song.title} was added to queue`,
            `Unable to update queue, after adding <${song.link}> to queue!`
        );
    }
}
/**@param {Message} message
 * @param {Queue} queue
 * @param {string[]} args*/
async function HandlePlaySkip(message, queue, args) {
    var skippingSong = queue.songs[0];
    await HandlePlay(message, args, queue.voiceChannel, queue);
    await HandleSkip(message, queue);

    AnnounceMessage(message, queue,
        `Skipped ${skippingSong.title} to play ${queue.songs[0].title}`,
        `${message.member.displayName} skipped ${skippingSong.title} to play ${queue.songs[0].title}.`
    );
}
/**@param {Message} message
 * @param {Queue} queue
 * @param {string[]} args*/
async function HandleRemove(message, queue, args) {
    if (!queue) return message.channel.send(`There's no queue!`);
    if (message.member.voice.channel.id != queue.voiceChannel.id) return message.channel.send(`You must join us to remove a song!`);

    var item = args[0], songToRemove;
    if (isNan(item)) {
        var index = parseInt(item);

        if (queue.songs.length < index || index < 0) return message.channel.send(`That number is too ${(index < 0 ? 'low' : 'high')}!`);
        songToRemove = queue.songs[index];
        queue.remove(songToRemove);
    }
    else {
        item = args.join(' ');
        if (!queue.includes(item)) return message.channel.send(`I couldn't find a match!`);
        songToRemove = queue.find(item);
        queue.remove(songToRemove);
    }
    UpdateQueue(message, queue, "HandleRemove",
        `Removed ${songToRemove.title} from **${message.guild.name}**'s queue.`,
        `Failed to remove song from queue`
    );

    return AnnounceMessage(message, queue,
        `Removed ${songToRemove.title} from queue.`,
        `${message.author.username} removed ${songToRemove.title} from queue.`
    );
}

/**Executes when author sends *music stop
 * @param {Message} message
 * @param {Queue} queue*/
async function HandleStop(message, queue) {
    if (!queue.playing) return message.channel.send(`The music is already stopped!`);

    await AnnounceMessage(message, queue,
        `Stopped!`, `${message.member.displayName} stopped the radio!`
    );

    try { queue.connection.dispatcher.end(); }
    catch (err) {
        if (!["Cannot read property 'dispatcher' of null", "Cannot read property 'end' of null"].includes(err.message))
            PinguLibrary.errorLog(message.client, "Dispatcher error in music, HandleStop", message.content, err);
    }

    await ResetClient(message, queue);

    return await UpdateQueue(message, queue = null, "HandleStop",
        `Reset queue for **${message.guild.name}**.`,
        `Unable to reset queue for **${message.guild.name}**.`
    );
}
/**Executes when author sends *music skip
 * @param {Message} message
 * @param {Queue} queue*/
async function HandleSkip(message, queue) {
    queue.connection.dispatcher.end();

    if (!message.content.includes("playskip") && !message.content.includes("ps"))
        AnnounceMessage(message, queue,
            "Skipped!",
            `Skipped, requested by **${message.guild.member(message.author).displayName}**.`
        );

    return await UpdateQueue(message, queue, "HandleSkip",
        `Updated queue after ${message.author.username} skipped.`,
        `Error while updating queue after skip!`
    );
}
/**Executes when author sends *music np
 * @param {Message} message
 * @param {Queue} queue*/
function HandleNowPlaying(message, queue) {
    return message.channel.send(`Currently playing: **${queue.songs[0].title}**`);
}
/**Executes when author sends *music volume
 * @param {Message} message 
 * @param {Queue} queue
 * @param {string} newVolume*/
function HandleVolume(message, queue, newVolume) {
    if (!newVolume) return message.channel.send(`Volume is currently **${PinguGuild.GetPGuild(message.guild).musicQueue.volume}**`);

    queue.connection.dispatcher.setVolumeLogarithmic(newVolume / 5);
    const previousVolume = PinguGuild.GetPGuild(message.guild).musicQueue.volume;
    queue.volume = parseInt(newVolume);

    AnnounceMessage(message, queue,
        `Volumed changed from **${previousVolume}** to **${newVolume}**.`,
        `Volumed changed from **${previousVolume}** to **${newVolume}** by ${message.member.displayName}`
    );

    UpdateQueue(message, queue, "HandleVolume",
        `Updated queue volume for **${message.guild.name}**.`,
        `Unable to update queue volume for **${message.guild.name}**.`
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

    try {
        for (var i = queue.index; i < queue.songs.length || i < 10 && queue.songs.length > 10; i++) {
            let indexSong = queue.songs[i];

            if (!indexSong.endsAt)
                indexSong.endsAt = new Date(queue.songs[i - 1].endsAt + indexSong.lengthMS);

            let timeLeft = indexSong.getTimeLeft();
            let songLength = {
                hours: parseInt(indexSong.length.split('.')[0]),
                minutes: parseInt(indexSong.length.split('.')[1]),
                seconds: parseInt(indexSong.length.split('.')[2]),
            };

            if (timeLeft.hours > songLength.hours) {
                console.log(
                    `Continue: ${timeLeft.hours} > ${songLength.hours}`,
                    `(${timeLeft.hours}.${timeLeft.minutes}.${timeLeft.seconds}/`,
                    `${ songLength.hours }.${ songLength.minutes }.${ songLength.seconds })`);
                continue;
            }
            else if (timeLeft.minutes > songLength.minutes && songLength.hours == 0) {
                console.log(
                    `Continue: ${timeLeft.hours} > ${songLength.hours}`,
                    `(${timeLeft.hours}.${timeLeft.minutes}.${timeLeft.seconds}/`,
                    `${songLength.hours}.${songLength.minutes}.${songLength.seconds})`);
                continue;
            }
            else if (timeLeft.seconds > songLength.seconds && songLength.minutes == 0 && songLength.hours == 0) {
                console.log(
                    `Continue: ${timeLeft.hours} > ${songLength.hours}`,
                    `(${timeLeft.hours}.${timeLeft.minutes}.${timeLeft.seconds}/`,
                    `${songLength.hours}.${songLength.minutes}.${songLength.seconds})`);
                continue;
            }

            embed.addField(
                `[${i + 1}]: ${indexSong.title}`,
                `Requested by: <@${indexSong.requestedBy.id}> | Time left: ${timeLeft}/${indexSong.length}`
            );
            if (i != queue.index)
                indexSong.endsAt = null;
        }
    }
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

    queue.playing = !queue.playing;
    const PauseOrResume = pauseRequest ? 'Paused' : 'Resumed';

    AnnounceMessage(message, queue,
        `${PauseOrResume} music.`,
        `${PauseOrResume} by ${message.member.displayName}.`
    );

    UpdateQueue(message, queue, "HandlePauseResume",
        `${(queue.playing ? "Resumed" : "Paused")} **${message.guild.name}**'s queue.`,
        `Unable to update queue for **${message.guild.name}**.`
    );
}
/**Executes when author sends *music move
 * @param {Message} message
 * @param {Queue} queue
 * @param {string[]} args*/
function HandleMove(message, queue, args) {
    try {
        var songIndexToMove = parseInt(args.shift());
        var newSongPosition = parseInt(args.shift());
    }
    catch (err) { return message.channel.send(err); }

    UpdateQueue(message, queue.move(songIndexToMove, newSongPosition), "HandleMove",
        `Updated **${message.guild.name}**'s music queue positions.`,
        `Error while updating positions for **${message.guild.name}**'s music queue`
    );
}
/**@param {Message} message
 * @param {Queue} queue
 * @param {string[]} args*/
async function HandleLoop(message, queue, args) {
    var loopType = args[0] && args[0] == 'song' ? 'song' : 'queue';
    var looping = loopType == 'queue' ? !queue.loop : !queue.currentSong.loop;

    if (loopType == 'queue') queue.loop = !queue.loop;
    else queue.currentSong.loop = !queue.currentSong.loop;

    message.channel.send(`${(looping ? `Looping` : `Unlooped`)} ${loopType}!`);

    await UpdateQueue(message, queue, "HandleLoop",
        `Updated loop (${looping}) for ${loopType}`,
        `Unable to loop ${loopType}`
    );
}
//#endregion

/**@param {Message} message 
 * @param {Song} song 
 * @param {Queue} queue*/
async function Play(message, song, queue) {
    var pGuild = PinguGuild.GetPGuild(message.guild);
    pGuild.musicQueue = new PQueue(queue);

    if (!song) {
        await ResetClient(message, queue);
        queue.logChannel.send('Thank you for listening!');
        queue.voiceChannel.leave();

        return await UpdateQueue(message, queue = null, "Play",
            `Queue finished - reset & saved to pGuilds.json`,
            `Error while resetting **${message.guild.name}**'s queue to pGuilds.json`
        );
    }

    var streamItem = ytdl(song.link, { filter: 'audioonly' });

    queue.connection.play(streamItem)
        .on('start', async () => {
            song.play();

            //Deafen yourself
            if (!message.guild.me.voice.selfDeaf)
                message.guild.me.voice.setSelfDeaf(true);

            console.log("Song Start");

            var requestedBy = message.guild.members.cache.find(m => m.id == song.requestedBy.id);

            //Change nickname to [<name> Radio] Pingu
            if (message.guild.me.permissions.has("CHANGE_NICKNAME")) {
                message.guild.me.setNickname(`[${requestedBy.displayName} Radio] ${queue.client.displayName}`) //[Nickname Radio] Pingu
                    .catch(() => message.guild.me.setNickname(`[${requestedBy.username} Radio] ${queue.client.displayName}`) //[Username Radio] Pingu
                        .catch(() => message.guild.me.setNickname(`[${message.guild.me.displayName} Radio] ${queue.client.displayName}`) //[Pingu Radio] Pingu
                            .catch(() => message.guild.me.setNickname(queue.client.displayName)))); //Pingu
            }

            //Set activity to match the song you're playing, and where you're playing it
            //message.client.user.setActivity(`${song.title} in ${queue.voiceChannel.name}`, 'PLAYING');
            message.client.user.setActivity(`${song.title} in ${queue.voiceChannel.name}`, { type: 'STREAMING', url: song.link })

            //Send now plating message in logChannel
            var nowPlayingMessage = `**Now playing:** ${song.title}\n**Requested by:** `;
            queue.logChannel.send(nowPlayingMessage + `${requestedBy.displayName}`)
                .then(sent => sent.edit(nowPlayingMessage + `<@${song.requestedBy.id}>`));

            //Update pGuilds queue
            UpdateQueue(message, queue, "play.on",
                `Saved Queue to pGuilds.json`,
                `Error while saving **${message.guild.name}**'s queue to pGuilds.json`
            );
        })
        .on('error', err => {
            console.log("Song Error");

            PinguLibrary.errorLog(message.client, "Voice connection error", message.content, err);
            AnnounceMessage(message, queue, `I had a voice connection error! I've notified my developers.`)

            pGuild.musicQueue = null;
        })
        .on('end', () => console.log("Song End"))
        .on('finish', async () => {
            console.log("Song Finished");

            var pinguName = queue.client.displayName;
            queue = await GetQueueElements(message.guild, PinguGuild.GetPGuild(message.guild).musicQueue);
            queue.client.displayName = pinguName;

            if (!queue.currentSong.loop) queue.index++;
            if (queue.index == queue.songs.length && queue.loop) queue.index = 0;

            if (!["stop", "st"].includes(commandName))
                Play(message, queue.currentSong, queue);
        })
        .setVolumeLogarithmic(queue.volume / 5);
}
/**@param {Message} message
 * @param {Queue} queue
 * @param {string} senderMsg
 * @param {string} logMsg*/
function AnnounceMessage(message, queue, senderMsg, logMsg) {
    if (!queue.logChannel) return message.channel.send(senderMsg);

    if (message.channel != queue.logChannel) {
        message.channel.send(senderMsg);
        return queue.logChannel.send(logMsg);
    }
    return queue.logChannel.send(senderMsg);
}
/**@param {Guild} guild
 * @param {PQueue} pqueue*/
async function GetQueueElements(guild, pqueue) {
    var queue = pqueue ? new Queue(
        new PClient(guild.me, guild),   
        guild.channels.cache.find(c => c.id == pqueue.logChannel.id),
        guild.channels.cache.find(c => c.id == pqueue.voiceChannel.id),
        pqueue.songs || [],
        pqueue.playing
    ) : null;

    if (queue) {
        if (guild.me.voice.channel)
            queue.connection = await guild.me.voice.channel.join();
        queue.client.displayName = pqueue.client.displayName;
        queue.volume = pqueue.volume;
        queue.loop = pqueue.loop;
    }

    return queue;
}
/**@param {Message} message
 * @param {Queue} queue*/
async function ResetClient(message, queue) {
    if (message.guild.me.permissions.has("CHANGE_NICKNAME"))
        await message.guild.me.setNickname(queue.client.displayName);

    await PinguLibrary.setActivity(message.client);
}
/**@param {Message} message
 * @param {Queue} queue
 * @param {string} commandName
 * @param {string} succMsg
 * @param {string} errMsg
 * @returns {Promise<void>}*/
async function UpdateQueue(message, queue, commandName, succMsg, errMsg) {
    var clientDisplayName = PinguGuild.GetPGuild(message.guild).musicQueue.client.displayName;
    var pQueue = PinguGuild.GetPGuild(message.guild).musicQueue = queue ? new PQueue(queue) : null;
    if (pQueue) pQueue.client.displayName = clientDisplayName;

    return await PinguGuild.UpdatePGuildJSONAsync(message.client, message.guild, module.exports.name,
        `{**${commandName}**}: ${succMsg}`,
        `{**${commandName}**}: ${errMsg}`
    );
}