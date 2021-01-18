const { Message, MessageEmbed, VoiceChannel } = require('discord.js'),
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
        { name: "loop", alias: "repeat", cmdHandler: HandleLoop },
        { name: "restart", alias: "previous", cmdHandler: HandleRestart },
        { name: "shuffle", alias: "", cmdHandler: HandleShuffle }
    ],
    permissions: [DiscordPermissions.SEND_MESSAGES, DiscordPermissions.SPEAK],
    /**@param {{message: Message, args: string[], pGuild: PinguGuild}}*/
    async execute({ message, args, pGuild }) {
        const voiceChannel = message.member.voice.channel,
            PermCheck = PermissionCheck(message, voiceChannel);
        if (PermCheck != PinguLibrary.PermissionGranted) return message.channel.send(PermCheck);

        commandName = args.shift().toLowerCase();
        let pQueue = pGuild.musicQueue;
        var queue = pQueue ? await pQueue.ToQueue(message.guild) : null;

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

    return PinguLibrary.PermissionCheck({
        author: message.author,
        channel: voiceChannel,
        client: message.client,
        content: message.content
    }, [DiscordPermissions.VIEW_CHANNEL, DiscordPermissions.SPEAK])
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
    else if (message.member.voice.channel != message.guild.me.voice.channel) return message.channel.send(`You're not in my voice channel, so you can't disconnect me!`);

    message.guild.me.voice.connection.disconnect();
    await AnnounceMessage(message, queue, `Disconnected!`, `**${message.member.displayName}** disconnected me!`);

    if (!PinguGuild.GetPGuild(message.guild).musicQueue) return;

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
                var searchResultVideos = await youTube.searchVideos(url, 1);
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

    ytdl.getInfo((video.url || queue.songs[0].link))
        .catch(async err => {
            await PinguLibrary.errorLog(message.client, `Unable to get video info`, message.content, err);
            AnnounceMessage(message, queue, `I ran into an error trying to get the video information! I've contacted my developers.`)
            return null;
        })
        .then(async vInfo => {
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
                try { queue.connection.dispatcher.resume(); }
                catch (err) {
                    if (err.message == `Cannot read property 'resume' of null`)
                        return Play(message, queue.songs[queue.index], queue);
                    PinguLibrary.errorLog(message.client, `Unable to resume dispatcher`, message.content, err);
                }
            }
            else {
                if (!queue.playing) return HandlePauseResume(message, queue, queue.playing);
                else {
                    queue.add(song);
                    message.channel.send(`**${song.title}** ${(song.author ? `from ${song.author}` : "")} was added to the queue.`);
                }

                UpdateQueue(message, queue, "HandlePlay",
                    `${song.title} was added to **${message.guild.name}**'s queue`,
                    `Unable to update queue, after adding <${song.link}> to queue!`
                );
            }
        });
}
/**@param {Message} message
 * @param {Queue} queue
 * @param {string[]} args*/
async function HandlePlaySkip(message, queue, args) {
    var skippingSong = queue.currentSong;

    await HandlePlay(message, args, queue.voiceChannel, queue);
    await HandleMove(message, queue, [queue.songs.length - 1, queue.index + 1]);
    await HandleSkip(message, queue);

    return AnnounceMessage(message, queue,
        `Skipped **${skippingSong.title}** to play **${queue.currentSong.title}**`,
        `${message.member.displayName} skipped **${skippingSong.title}** to play **${queue.songs[0].title}**.`
    );
}
/**@param {Message} message
 * @param {Queue} queue
 * @param {string[]} args*/
async function HandleRemove(message, queue, args) {
    if (!queue) return message.channel.send(`There's no queue!`);
    if (message.member.voice.channel.id != queue.voiceChannel.id) return message.channel.send(`You must join us to remove a song!`);

    var item = args[0], songToRemove;
    if (isNaN(parseInt(item))) {
        var index = parseInt(item) + 1;

        if (queue.songs.length < index || index < 0) return message.channel.send(`That number is too ${(index < 0 ? 'low' : 'high')}!`);
        songToRemove = queue.songs[index];
    }
    else {
        item = args.join(' ');
        if (!queue.includes(item)) return message.channel.send(`I couldn't find a match!`);
        songToRemove = queue.find(item);
    }
    queue.remove(songToRemove);

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

    queue.songs = [];
    await UpdateQueue(message, queue, "HandleStop",
        `Reset queue's songs for **${message.guild.name}**`,
        `Unable to reset queue's songs for **${message.guild.name}**`
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
async function HandleVolume(message, queue, newVolume) {
    let { currentSong } = queue;

    if (!newVolume) return message.channel.send(`Volume is currently **${currentSong.volume}**`);

    queue.connection.dispatcher.setVolumeLogarithmic(newVolume / 5);
    const previousVolume = currentSong.volume;
    currentSong.volume = parseFloat(newVolume);

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
        .setThumbnail(message.client.user.avatarURL())
        .setColor(PinguGuild.GetPGuild(message.guild).embedColor)
        .setImage(queue.currentSong.thumbnail);

    try {
        for (var i = queue.index; i < queue.songs.length || i < 10 && queue.songs.length > 10; i++) {
            let indexSong = queue.songs[i];

            if (!indexSong.endsAt)
                indexSong.endsAt = new Date(queue.songs[i - 1].endsAt.getTime() + indexSong.lengthMS);

            let timeLeft = indexSong.getTimeLeft();
            let songLength = {
                hours: parseInt(indexSong.length.split('.')[0]),
                minutes: parseInt(indexSong.length.split('.')[1]),
                seconds: parseInt(indexSong.length.split('.')[2]),
            };

            let formatTime = () => {
                return [timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map(number =>
                    number < 10 ? `0${number}` : number.toString()).join('.');
            }

            embed.addField(
                `[${i + 1}]: ${indexSong.title}`,
                `Requested by: <@${indexSong.requestedBy.id}> | Time left: **${formatTime()}**${(indexSong == queue.currentSong ? `/**${indexSong.length}**` : "")}`
            );
        }
    }
    catch (err) {
        PinguLibrary.errorLog(message.client, `Tried to send queue for ${message.guild.name}`, message.content, err);
        return message.channel.send(`I ran into an error trying to get the queue, and sent a message to my developers!`);
    }

    for (var i = queue.index + 1; i < queue.songs.length || i < 10 && queue.songs.length > 10; i++) {
        queue.songs[i].endsAt = null;
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
async function HandleMove(message, queue, args) {
    try {
        var songIndexToMove = parseInt(args.shift());
        var newSongPosition = parseInt(args.shift());
    }
    catch (err) { return message.channel.send(err); }

    if (songIndexToMove < 1 || newSongPosition < 0) return message.channel.send(`I can't move something that's already playing!`);
    else if (songIndexToMove > queue.songs.length) return message.channel.sendd(`You didn't select a song! Please select from 2 - ${queue.songs.length - queue.index}!`);
    else if (newSongPosition > queue.songs.length) newSongPosition = queue.songs.length;

    if (!message.content.includes('playskip'))
        AnnounceMessage(message, queue,
            `Moved **${queue.songs[songIndexToMove - 1].title}** from position **${songIndexToMove - 1}** to **${newSongPosition - 1}**.`,
            `**${message.author.tag}** moved **${queue.songs[songIndexToMove - 1].title}** from position **${songIndexToMove - 1}** to **${newSongPosition - 1}**.`
        );

    return UpdateQueue(message, queue.move(songIndexToMove, newSongPosition), "HandleMove",
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
/**@param {Message} message
 * @param {Queue} queue
 * @param {string[]} args*/
async function HandleRestart(message, queue, args) {
    let restartType = args[0] && args[0] == 'queue' ? 'queue' : 'song';
    message.channel.send(`Restarting ${restartType}!`)
    queue.index = restartType == 'queue' ? 0 : queue.index;

    await UpdateQueue(message, queue, `HandleRestart`,
        `Successfully saved new indexes for restarting`,
        `Failed saving new indexes for restarting`
    );

    return Play(message, queue.currentSong, queue);
}
/**@param {Message} message
 * @param {Queue} queue
 * @param {string[]} args*/
function HandleShuffle(message, queue, args) {
    let queueSongs = queue.songs.map(v => v.id != queue.currentSong.id && v);

    for (var i = 0; i < Math.round(Math.random() * queue.songs.length); i++) {
        queueSongs.sort(() => Math.round(Math.random() * 2) == 1 ? 1 : -1);
    }

    queue.songs = [queue.currentSong];
    queue.songs.push(queueSongs);

    UpdateQueue(message, queue, "HandleShuffle",
        `Successfully shuffled **${queue.voiceChannel.name}**'s queue`,
        `Failed shuffling **${queue.voiceChannel.name}**'s queue!`
    );

    return AnnounceMessage(message, queue
        `Shuffled!`,
        `**${message.author.tag}** shuffled the queue!`
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
            `Queue finished - reset & saved to **${message.guild.name}**'s pGuild`,
            `Error while resetting **${message.guild.name}**'s queue to pGuilds!`
        );
    }

    var streamItem = ytdl(song.link, { filter: 'audioonly' });

    queue.logChannel = message.guild.channels.cache.get(queue.logChannel.id);
    let previousMessage = queue.logChannel.messages.cache.find(msg => msg.author.id == message.client.user.id && msg.content.startsWith(`**Now playing:**`));
    let lastChannelMessage = queue.logChannel.messages.cache.last();

    queue.connection.play(streamItem)
        .on('start', async () => {
            if (song.volume == -1) song.volume = queue.volume;
            queue.volume = song.volume;

            song.play();

            //Deafen yourself
            if (!message.guild.me.voice.selfDeaf)
                message.guild.me.voice.setSelfDeaf(true);

            PinguLibrary.ConsoleLog(`Start: ${song.title}`);

            var requestedBy = message.guild.members.cache.find(m => m.id == song.requestedBy.id);

            //Change nickname to [<name> Radio] Pingu
            if (message.guild.me.permissions.has("CHANGE_NICKNAME")) {
                message.guild.me.setNickname(`[${requestedBy.displayName} Radio] ${queue.client.displayName}`) //[Nickname Radio] Pingu
                    .catch(() => message.guild.me.setNickname(`[${requestedBy.username} Radio] ${queue.client.displayName}`) //[Username Radio] Pingu
                        .catch(() => message.guild.me.setNickname(`[${message.guild.me.displayName} Radio] ${queue.client.displayName}`) //[Pingu Radio] Pingu
                            .catch(() => message.guild.me.setNickname(queue.client.displayName)))); //Pingu
            }

            //Set activity to match the song you're playing, and where you're playing it
            message.client.user.setActivity(`${song.title} in ${queue.voiceChannel.name}`, { type: 'STREAMING', url: song.link })

            //Send now plating message in logChannel
            var nowPlayingMessage = `**Now playing:** ${song.title}\n**Requested by:** `;

            if (previousMessage && lastChannelMessage && lastChannelMessage.id == previousMessage.id)
                previousMessage.edit(nowPlayingMessage + `<@${song.requestedBy.id}>`);
            else 
                queue.logChannel.send(nowPlayingMessage + `${requestedBy.displayName}`)
                    .then(sent => sent.edit(nowPlayingMessage + `<@${song.requestedBy.id}>`));


            //Update pGuilds queue
            UpdateQueue(message, queue, "play.on",
                `Saved Queue to **${message.guild.name}.json**`,
                `Error while saving **${message.guild.name}**'s queue to **${message.guild.name}.json**`
            );
        })
        .on('error', err => {
            PinguLibrary.ConsoleLog(`Error: ${song.title}`);

            PinguLibrary.errorLog(message.client, "Voice connection error", message.content, err);
            AnnounceMessage(message, queue, `I had a voice connection error! I've notified my developers.`)

            pGuild.musicQueue = null;
        })
        .on('end', () => PinguLibrary.ConsoleLog(`End: ${song.title}`))
        .on('finish', async () => {
            PinguLibrary.ConsoleLog(`Finish: ${song.title}`);

            song.stop();

            var pinguName = queue.client.displayName;
            queue = await PinguGuild.GetPGuild(message.guild).musicQueue.ToQueue(message.guild);
            queue.client.displayName = pinguName;

            if (queue.currentSong && !queue.currentSong.loop) queue.index++;
            if (queue.index == queue.songs.length && queue.loop) queue.index = 0;

            if (!["stop", "st"].includes(commandName))
                Play(message, queue.currentSong, queue);
        })
        .setVolumeLogarithmic(song.volume == -1 ? (queue.volume / 5) : (song.volume / 5))
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