const { Message, MessageEmbed, VoiceChannel, MessageReaction, User } = require('discord.js'),
    { PinguGuild, Queue, Song, PinguLibrary, PClient, DiscordPermissions, config } = require('PinguPackage'),
    ytdl = require('ytdl-core'),
    YouTube = require('simple-youtube-api');
var youTube = new YouTube(youtube_api), commandName = "", ms = require('ms');
const { youtube_api } = config;


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
    /**@param {{message: Message, args: string[]}}*/
    async execute({ message, args }) {
        const voiceChannel = message.member.voice.channel,
            PermCheck = PermissionCheck(message, voiceChannel);
        if (PermCheck != PinguLibrary.PermissionGranted) return message.channel.send(PermCheck);

        commandName = args.shift().toLowerCase();
        var queue = Queue.get(message.guild.id);

        switch (commandName) {
            case "join": case "summon": return HandleJoin(message, args.join(' '));
            case "disconnect": case "dc": return HandleDisconnect(message, queue);
            case "play": case "p": return HandlePlay(message, args, voiceChannel, queue);
            case "playskip": case "ps": return queue ?
                HandlePlaySkip(message, queue, args) :
                HandlePlay(message, args, voiceChannel, queue);
        }

        if (!queue) return message.channel.send('Nothing is playing!');
        if (!queue.currentSong) queue.index = 0;

        var command = this.musicCommands.find(cmd => [cmd.name, cmd.alias].includes(commandName))
        if (!command) return message.channel.send(`I didn't recognize that command!`);

        if (["pause", "stfu", "resume", "speak"].includes(commandName))
            HandlePauseResume(message, queue, ["pause", "stfu"].includes(commandName));
        else if (['vol', 'volume'].includes(commandName))
            HandleVolume(message, queue, args[0]);
        else command.cmdHandler(message, queue, args);
    },
    /**@param {Message} message
     * @param {Queue} queue
     * @param {boolean} pauseRequest*/
    async ReactControlPanel(message, queue, pauseRequest) {
        await (async function ReactEmojis() {
            await message.react('🔀')
            await message.react('⏮️');
            await message.react(pauseRequest ? '▶️' : '⏸️')
            await message.react('⏹️');
            await message.react('⏭️');
            await message.react('🔁');
            await message.react('🔂');
            await message.react('🇶');
            await message.react('🤔');
        })();

        /**@param {MessageReaction} reaction
         * @param {User} user*/
        const filter = (_, user) =>
            message.channel.id == queue.logChannel.id && //Reaction message came from logChannel
            message.guild.member(user).voice.channel.id == queue.voiceChannel.id && //Reactor is in queue's VC
            !user.bot; //Not the penguin

        try {
            message.createReactionCollector(filter, { time: queue.currentSong.lengthMS })
                .on('collect', async (reaction, user) => {
                    if (!user.bot) reaction.users.remove(user);

                    let response = await (function getResponse() {
                        switch (reaction.emoji.name) {
                            case '🔀': return HandleShuffle(message, queue);
                            case '⏮️': return HandleRestart(message, queue, ["song"]);
                            case '⏸️': case '▶️': return HandlePauseResume(message, queue, reaction.emoji.name == '⏸️');
                            case '⏹️': return HandleStop(message, queue);
                            case '⏭️': return HandleSkip(message, queue);
                            case '🔁': return HandleLoop(message, queue, ['queue']);
                            case '🔂': return HandleLoop(message, queue, ['song']);
                            case '🇶': HandleQueue(message, queue); return null;
                            case '🤔': return HandleNowPlaying(message, queue);
                            default: return null;
                        }
                    })();
                    if (response) response.delete({ timeout: 5000 });
                })
        } catch { /*Null checking cus I cant be bothered to deal with in if-statements*/ }
    }
};

/**@param {Message} message 
 * @param {VoiceChannel} voiceChannel*/
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
    await queue.AnnounceMessage(message, `Disconnected!`, `**${message.member.displayName}** disconnected me!`);

    if (!Queue.get(message.guild.id)) return;

    queue.playing = false;

    return await queue.Update(message, "HandleDisconnect",
        `Disconnected from ${queue.voiceChannel.name}`
    );
}
/**Executes when author sends *music play
 * @param {Message} message 
 * @param {string[]} args 
 * @param {VoiceChannel} voiceChannel
 * @param {Queue} queue*/
async function HandlePlay(message, args, voiceChannel, queue) {
    if (!args[0] && (!queue || !queue.songs[0])) return message.channel.send(`You didn't give me something to play!`);

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

                    await queue.Update(message, "HandlePlay",
                        `Playlist was added to queue`
                    );

                    return queue.AnnounceMessage(message,
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
            await queue.AnnounceMessage(message, `I ran into an error trying to get the video information! I've contacted my developers.`)
            return null;
        })
        .then(async vInfo => {
            let song = new Song(message.author, vInfo.videoDetails);
            if (!song) return message.channel.send(`I couldn't get that song!`);
            else if (!song.link) song = new Song(message.author, vInfo.videoDetails);

            if (!queue) {
                queue = new Queue(message.channel, voiceChannel, [song]);
                queue.connection = await voiceChannel.join();
                Play(message, queue.songs[0], queue);
            }
            else if (!args[0]) {
                queue.connection = await queue.voiceChannel.join();
                try { HandlePauseResume(message, queue, false); }
                catch (err) {
                    if (err.message == `Cannot read property 'resume' of null`)
                        return Play(message, queue.currentSong, queue);
                    PinguLibrary.errorLog(message.client, `Unable to resume dispatcher`, message.content, err);
                }
            }
            else {
                if (!queue.playing) return HandlePauseResume(message, queue, queue.playing);
                else {
                    queue.add(song);
                    message.channel.send(`**${song.title}** ${(song.author ? `from ${song.author}` : "")} was added to the queue.`);
                }

                queue.Update(message, "HandlePlay",
                    `${song.title} was added to **${message.guild.name}**'s queue`
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

    return queue.AnnounceMessage(message,
        `Skipped **${skippingSong.title}** to play **${queue.currentSong.title}**`,
        `**${message.member.displayName}** skipped **${skippingSong.title}** to play **${queue.currentSong.title}**.`
    );
}
/**@param {Message} message
 * @param {Queue} queue
 * @param {string[]} args*/
async function HandleRemove(message, queue, args) {
    if (!queue) return message.channel.send(`There's no queue!`);
    if (message.member.voice.channel.id != queue.voiceChannel.id) return message.channel.send(`You must join us to remove a song!`);

    var item = args[0], songToRemove;
    if (!isNaN(parseInt(item))) {
        var index = parseInt(item) - 1;

        if (queue.songs.length < index || index < 0) return message.channel.send(`That number is too ${(index < 0 ? 'low' : 'high')}!`);
        songToRemove = queue.songs[index];
    }
    else {
        item = args.join(' ');
        if (!queue.includes(item)) return message.channel.send(`I couldn't find a match!`);
        songToRemove = queue.find(item);
    }
    if (!songToRemove) return;
    queue.remove(songToRemove);

    queue.Update(message, "HandleRemove",
        `Removed ${songToRemove.title} from **${message.guild.name}**'s queue.`
    );

    return queue.AnnounceMessage(message,
        `Removed ${songToRemove.title} from queue.`,
        `${message.author.username} removed ${songToRemove.title} from queue.`
    );
}

/**Executes when author sends *music stop
 * @param {Message} message
 * @param {Queue} queue*/
async function HandleStop(message, queue) {
    if (!queue.playing) return message.channel.send(`The music is already stopped!`);

    let stopped = await queue.AnnounceMessage(message,
        `Stopped!`, `${message.member.displayName} stopped the radio!`
    );

    queue.songs = [];
    await queue.Update(message, "HandleStop",
        `Reset queue's songs for **${message.guild.name}**`
    );

    try { queue.connection.dispatcher.end(); }
    catch (err) {
        if (!["Cannot read property 'dispatcher' of null", "Cannot read property 'end' of null"].includes(err.message))
            PinguLibrary.errorLog(message.client, "Dispatcher error in music, HandleStop", message.content, err);
    }

    await ResetClient(message);

    await queue.Update(message, "HandleStop",
        `Reset **${message.guild.name}**'s queue`
    );
    return stopped;
}
/**Executes when author sends *music skip
 * @param {Message} message
 * @param {Queue} queue*/
async function HandleSkip(message, queue) {
    queue.connection.dispatcher.end();

    await queue.Update(message, "HandleSkip",
        `Updated queue after ${message.author.username} skipped.`
    );

    if (!message.content.includes("playskip") && !message.content.includes("ps"))
        return queue.AnnounceMessage(message,
            "Skipped!",
            `Skipped, requested by **${message.guild.member(message.author).displayName}**.`
        );
}
/**Executes when author sends *music np
 * @param {Message} message
 * @param {Queue} queue*/
async function HandleNowPlaying(message, queue) {
    let sent = await message.channel.send(await queue.NowPlayingEmbed(message));
    module.exports.ReactControlPanel(sent, queue, !queue.playing);
    return sent;
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
    currentSong.volume = parseFloat(newVolume.replace(',', '.'));

    queue.AnnounceMessage(message,
        `Volumed changed from **${previousVolume}** to **${newVolume}**.`,
        `Volumed changed from **${previousVolume}** to **${newVolume}** by ${message.member.displayName}`
    );

    queue.Update(message, "HandleVolume",
        `Updated queue volume for **${message.guild.name}**.`
    );
}
/**Executes when author sends *music queue
 * @param {Message} message
 * @param {Queue} queue*/
async function HandleQueue(message, queue) {
    let pGuild = await PinguGuild.GetPGuild(message.guild);
    let pGuildClient = PinguGuild.GetPClient(message.client, pGuild);

    const embed = new MessageEmbed()
        .setTitle(`Queue for ${queue.voiceChannel.name}${(queue.loop ? ' [**LOOPED**]' : '')}`)
        .setThumbnail(queue.currentSong.thumbnail)
        .setColor(pGuildClient.embedColor)
        .setFooter(`Queue looping: ${queue.loop ? 'Yes' : 'No'} | Song looping: ${queue.currentSong.loop ? 'Yes' : 'No'}`)

    try {
        let loopIndex = 0;
        for (var i = queue.index; loopIndex < queue.songs.length || loopIndex < 10 && queue.songs.length > 10; i++) {
            if (i == queue.songs.length)
                if (queue.loop) i = 0;
                else break;

            let indexSong = queue.songs[i];

            if (!indexSong.endsAt)
                indexSong.endsAt = new Date(queue.songs[(i - 1 > -1 ? i - 1 : queue.songs.length - 1 - i)].endsAt.getTime() + indexSong.lengthMS);

            let timeLeft = indexSong.getTimeLeft();

            let formatTime = () => {
                return [timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map(number =>
                    number < 10 ? `0${number}` : number.toString()).join('.');
            }

            embed.addField(
                `[${i + 1}]: ${indexSong.title}${(indexSong.loop ? ' | [LOOPED]' : "")}`,
                `Requested by <@${indexSong.requestedBy._id}> | Time ${(
                    i == queue.index ?
                        `left: **${formatTime()}**/**${indexSong.length}**` :
                        `until played: **${formatTime()}**`
                )}`
            );
            loopIndex++;

            if (indexSong.loop) break;
        }
    }
    catch (err) {
        PinguLibrary.errorLog(message.client, `Tried to send queue for ${message.guild.name}`, message.content, err);
        return message.channel.send(`I ran into an error trying to get the queue, and sent a message to my developers!`);
    }

    for (var i = queue.index + 1; i < queue.songs.length || i < 10 && queue.songs.length > 10; i++) {
        queue.songs[i].endsAt = null;
    }

    let sent = await message.channel.send(embed);
    await sent.react('🗑️');

    /**@param {MessageReaction} reaction
     * @param {User} user*/
    const filter = (reaction, user) =>
        message.channel.id == queue.logChannel.id && //Reaction message came from logChannel
        message.guild.member(user).voice.channel.id == queue.voiceChannel.id && //Reactor is in queue's VC
        !user.bot && //Not the penguin
        reaction.emoji.name == '🗑️'; //Must be bin

    let collector = sent.createReactionCollector(filter);
    collector.on('collect', () => collector.stop())
    collector.on('end', _ => sent.delete());
    return sent;
}
/**Executes when author sends *music pause or *music resume
 * @param {Message} message
 * @param {Queue} queue
 * @param {boolean} pauseRequest*/
async function HandlePauseResume(message, queue, pauseRequest) {
    let sent = await queue.pauseResume(message, pauseRequest);

    queue.Update(message, "HandlePauseResume",
        `${(queue.playing ? "Resumed" : "Paused")} **${message.guild.name}**'s queue.`
    );

    return sent;
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
    catch (err) { return message.channel.send(`Positions must be numbers!`); }

    if (songIndexToMove < 1 || newSongPosition < 0) return message.channel.send(`I can't move something that's already playing!`);
    else if (songIndexToMove > queue.songs.length) return message.channel.sendd(`You didn't select a song! Please select from 2 - ${queue.songs.length - queue.index}!`);
    else if (newSongPosition > queue.songs.length) newSongPosition = queue.songs.length;

    if (!message.content.includes('playskip'))
        queue.AnnounceMessage(message,
            `Moved **${queue.songs[newSongPosition].title}** from position **${songIndexToMove}** to **${newSongPosition}**.`,
            `**${message.author.tag}** moved **${queue.songs[songIndexToMove - 1].title}** from position **${songIndexToMove - 1}** to **${newSongPosition - 1}**.`
        );

    queue.move(songIndexToMove, newSongPosition);
    return queue.Update(message, "HandleMove",
        `Updated **${message.guild.name}**'s music queue positions.`
    );
}
/**@param {Message} message
 * @param {Queue} queue
 * @param {string[]} args*/
async function HandleLoop(message, queue, args) {
    var loopType = args[0] && args[0] == 'song' ? 'song' : 'queue';
    var looping = loopType == 'queue' ? !queue.loop : !queue.songs[queue.index].loop;

    if (loopType == 'queue') queue.loop = !queue.loop;
    else queue.songs[queue.index].loop = !queue.songs[queue.index].loop;

    await queue.Update(message, "HandleLoop",
        `Updated loop (${looping}) for ${loopType}`
    );

    return queue.AnnounceMessage(message, `${(looping ? `Looping` : `Unlooped`)} ${loopType}!`);
}
/**@param {Message} message
 * @param {Queue} queue
 * @param {string[]} args*/
async function HandleRestart(message, queue, args) {
    let restartType = args[0] && args[0] == 'queue' && new Date(Date.now() + 10000) < queue.currentSong.lengthMS ? 'queue' : 'song';
    queue.index = restartType == 'queue' ? 0 : queue.index;

    await queue.Update(message, `HandleRestart`,
        `Successfully saved new indexes for restarting`
    );

    Play(message, queue.currentSong, queue);

    return message.channel.send(`Restarting ${restartType}!`)
}
/**@param {Message} message
 * @param {Queue} queue*/
async function HandleShuffle(message, queue) {
    let queueSongs = queue.songs.map(v => v._id != queue.songs[queue.index]._id && v).filter(v => v);

    for (var i = 0; i < Math.round(Math.random() * queue.songs.length); i++) {
        queueSongs.sort(() => Math.round(Math.random() * 2) == 1 ? 1 : -1);
    }

    queue.songs = [queue.songs[queue.index]];
    queueSongs.forEach(song => queue.add(song));

    queue.Update(message, "HandleShuffle",
        `Successfully shuffled **${queue.voiceChannel.name}**'s queue`
    );

    return queue.AnnounceMessage(message,
        `Shuffled!`,
        `**${message.author.tag}** shuffled the queue!`
    );
}
//#endregion

/**@param {Message} message 
 * @param {Song} song 
 * @param {Queue} queue*/
async function Play(message, song, queue) {
    var pGuild = await PinguGuild.GetPGuild(message.guild);
    var pGuildClient = PinguGuild.GetPClient(message.client, pGuild);
    Queue.set(message.guild.id, queue);

    if (!song) {
        var timeout = message.client.setTimeout(async () => {
            await ResetClient(message);
            queue.logChannel.send('Thank you for listening!');
            queue.voiceChannel.leave();

            return await queue.Update(message, "Play",
                `Queue finished - reset & saved to **${message.guild.name}**'s queue`
            );
        }, ms('2m'));
        await ResetClient(message);
        return;
    }
    else if (timeout) message.client.clearTimeout(timeout);

    var streamItem = ytdl(song.link, { filter: 'audioonly' });

    queue.logChannel = message.guild.channels.cache.get(queue.logChannel.id);

    queue.connection.play(streamItem)
        .on('start', async () => {
            //Deafen yourself
            if (!message.guild.me.voice.selfDeaf) message.guild.me.voice.setSelfDeaf(true);

            //Set volume
            if (song.volume == -1) song.volume = queue.volume;
            queue.volume = song.volume;

            //Play song
            song.play();
            PinguLibrary.consoleLog(message.client, `Start: ${song.title}`);

            //Change nickname to [<name> Radio] Pingu
            var requestedBy = message.guild.members.cache.find(m => m.id == song.requestedBy._id);
            if (message.guild.me.permissions.has("CHANGE_NICKNAME")) {
                message.guild.me.setNickname(`[${requestedBy.displayName} Radio] ${pGuildClient.displayName}`) //[Nickname Radio] Pingu
                    .catch(() => message.guild.me.setNickname(`[${requestedBy.username} Radio] ${pGuildClient.displayName}`) //[Username Radio] Pingu
                        .catch(() => message.guild.me.setNickname(`[${message.guild.me.displayName} Radio] ${pGuildClient.displayName}`) //[Pingu Radio] Pingu
                            .catch(() => message.guild.me.setNickname(pGuildClient.displayName)))); //Pingu
            }

            //Set activity to match the song you're playing, and where you're playing it
            message.client.user.setActivity(`${song.title} in ${queue.voiceChannel.name}`, { type: 'STREAMING', url: song.link })

            //Make embed to send
            let embed = await queue.NowPlayingEmbed(message)

            //Did you already send an embed within 5 messages?
            let lastMessage = (await queue.logChannel.messages.fetch({ after: message.id }))
                .array()
                .filter((_, i) => i <= 5)
                .find(v =>
                    v.embeds &&
                    v.embeds[0] &&
                    v.embeds[0].title &&
                    v.embeds[0].title.startsWith('Now playing:')
                );

            //If last message in logChannel was the "Now Playing" embed, edit that embed with the new one, else send embed
            if (lastMessage && lastMessage.embeds[0] && lastMessage.embeds[0].title.startsWith('Now playing:'))
                module.exports.ReactControlPanel(await lastMessage.edit(embed), queue, !queue.playing)
            else message.channel.send(embed).then(sent => module.exports.ReactControlPanel(sent, queue, false))

            //Update queue
            queue.Update(message, "play.on",
                `Playing next song - **${message.guild.name}**'s queue was saved.`
            );
        })
        .on('error', err => {
            PinguLibrary.consoleLog(message.client, `Error: ${song.title}`);

            PinguLibrary.errorLog(message.client, "Voice connection error", message.content, err);
            queue.AnnounceMessage(message, `I had a voice connection error! I've notified my developers.`)
        })
        .on('finish', async () => {
            PinguLibrary.consoleLog(message.client, `Finish: ${song.title}`);
            song.stop();
            queue = Queue.get(message.guild.id);

            (await message.channel.messages.fetch({ after: message.id }))
                .filter(m => m.embeds[0] && m.embeds[0].title && m.embeds[0].title.startsWith('Now playing:'))
                .forEach(async m => await m.reactions.removeAll());

            if (queue.currentSong && !queue.currentSong.loop) queue.index++;
            if (queue.index == queue.songs.length && queue.loop) queue.index = 0;

            if (!["stop", "st"].includes(commandName))
                Play(message, queue.currentSong, queue);
        })
        .setVolumeLogarithmic(song.volume == -1 ? (queue.volume / 5) : (song.volume / 5))
}
/**@param {Message} message
 * @param {Queue} queue*/
async function ResetClient(message) {
    let pGuild = await PinguGuild.GetPGuild(message.guild);
    let pGuildClient = PinguGuild.GetPClient(message.client, pGuild);

    if (message.guild.me.permissions.has("CHANGE_NICKNAME"))
        await message.guild.me.setNickname(pGuildClient.displayName);

    await PinguLibrary.setActivity(message.client);
}
