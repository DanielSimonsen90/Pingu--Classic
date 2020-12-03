const { Message, Guild, MessageEmbed, VoiceChannel, Permissions, StreamDispatcher } = require('discord.js'),
    ytdl = require('ytdl-core');
const { PinguGuild, Queue, Song, PinguLibrary, PQueue, PClient } = require('../../PinguPackage');
var queue;


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
        { name: "stop", alias: "st", cmdHandler: HandleStop },
        { name: "skip", alias: "sk", cmdHandler: HandleSkip },
        { name: "nowplaying", alias: "np", cmdHandler: HandleNowPlaying },
        { name: "volume", alias: "vol", cmdHandler: HandleVolume },
        { name: "queue", alias: "q", cmdHandler: HandleQueue },
        { name: "pause", alias: null, cmdHandler: HandlePauseResume },
        { name: "resume", alias: null, cmdHandler: HandlePauseResume },
        { name: "move", alias: "mo", cmdHandler: HandleMove },
    ],
    /**@param {Message} message @param {string[]} args*/
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel,
            PermCheck = PermissionCheck(message, voiceChannel);
        if (PermCheck != PinguLibrary.PermissionGranted) return message.channel.send(PermCheck);

        const commandName = args.shift().toLowerCase();
        queue = await getQueueElements(message.guild, PinguGuild.GetPGuild(message.guild).musicQueue);

        if ([this.musicCommands[0].name, this.musicCommands[0].alias].includes(commandName)) //command is join
            return this.musicCommands[0].cmdHandler(message, args.join(' '));
        else if ([this.musicCommands[1].name, this.musicCommands[1].alias].includes(commandName)) //command is disconnect
            return this.musicCommands[1].cmdHandler(message, queue);
        else if ([this.musicCommands[2].name, this.musicCommands[2].alias].includes(commandName)) //command is play
            return this.musicCommands[2].cmdHandler(message, args, voiceChannel, queue);

        if (!queue) return message.channel.send('Nothing is playing!');

        var command = this.musicCommands.find(cmd => [cmd.name, cmd.alias].includes(commandName))
        if (!command) return message.channel.send(`I didn't recognize that command!`);
        command.cmdHandler(message, queue, (["pause", "resume"].includes(commandName) ? commandName == 'pause' : args[0]))

        //switch (commandName) {
        //    case 'st': case 'stop': HandleStop              (message, queue); break;
        //    case 'sk': case 'skip': HandleSkip              (message, queue); break;
        //    case 'np': case 'nowplaying': HandleNowPlaying  (message, queue); break;
        //    case 'vol': case 'volume': HandleVolume         (message, queue, args[0]); break;
        //    case 'q': case 'queue': HandleQueue             (message, queue); break;
        //    case 'pause': case 'resume': HandlePauseResume  (message, queue, commandName == 'pause'); break;
        //    case 'mo': case 'move': HandleMove              (message, queue, args); break;
        //    case 'join': HandleJoin                         (message); break;
        //}
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
/**@param {Message} message @param {string} channelData*/
async function HandleJoin(message, channelData) {
    var channel = channelData && message.guild.channels.cache.find(c =>
        c.type == 'voice' && ([c.id, c.name.toLowerCase()].includes(channelData.toLowerCase()))
    ) || message.member.voice.channel;
    return channel.join();
}
/**@param {Message} message @param {Queue} queue*/
async function HandleDisconnect(message, queue) {
    if (!message.guild.me.voice.connection) return message.channel.send(`I'm not in a voice chat!`);
    else if (!message.member.voice.channel == message.guild.me.voice.channel) return message.channel.send(`You're not in my voice channel, so you can't disconnect me!`);

    message.guild.me.voice.connection.disconnect();
    announceMessage(message, queue, `Disconnected!`, `**${message.member.displayName}** disconnected me!`);
}

/**Executes when author sends *music play
 * @param {Message} message 
 * @param {string[]} args 
 * @param {VoiceChannel} voiceChannel
 * @param {Queue} queue*/
async function HandlePlay(message, args, voiceChannel, queue) {
    if (!args[0] && !queue.songs[0]) return message.channel.send(`You didn't give me something to play!`);

    var vInfo = await ytdl.getInfo((args[0] && args[0].replace(/<(.+)>/g, '$1') || queue.songs[0].link)).catch(async err => {
        await PinguLibrary.errorLog(message.client, `Unable to get video info`, message.content, err);
        announceMessage(message, queue, `I ran into an error trying to get the video information! I've contacted my developers.`)
        return null;
    });
    const song = new Song(vInfo, message.author);
    if (!song) message.channel.send(`I couldn't get that song!`);

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
        queue.add(song);
        message.channel.send(`**${song.title}** (from ${song.author}) was added to the queue.`);
    }
}
async function HandlePlaySkip() {

}

/**Executes when author sends *music stop
 * @param {Message} message
 * @param {Queue} queue*/
function HandleStop(message, queue) {
    if (!queue.playing) return message.channel.send(`The music is already stopped!`);

    ResetClient(message, queue);

    announceMessage(message, queue,
        `Stopped!`, `${message.member.displayName} stopped the radio!`
    );

    queue.songs = [];
    try { queue.connection.dispatcher.end(); }
    catch (err) {
        if (err.message != "Cannot read property 'dispatcher' of null" && "Cannot read property 'end' of null")
            PinguLibrary.errorLog(message.client, "Dispatcher error in music, HandleStop", message.content, err);
    }

    PinguGuild.UpdatePGuildsJSON(message.client, module.exports.name,
        `Successfully reset queue for **${message.guild.name}**.`,
        `Unable to reset queue for **${message.guild.name}**.`
    );
}
/**Executes when author sends *music skip
 * @param {Message} message
 * @param {Queue} queue*/
function HandleSkip(message, queue) {
    queue.connection.dispatcher.end();

    announceMessage(message, queue,
        "Skipped!",
        `Skipped, requested by **${message.guild.member(message.author).displayName}**.`
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
 * @param {Queue} queue
 * @param {string} newVolume*/
function HandleVolume(message, queue, newVolume) {
    if (!newVolume) return message.channel.send(`Volume is currently **${PinguGuild.GetPGuild(message.guild).musicQueue.volume}**`);

    queue.connection.dispatcher.setVolumeLogarithmic(newVolume / 5);
    const previousVolume = queue.volume;
    queue.volume = parseInt(newVolume);

    announceMessage(message, queue,
        `Volumed changed from **${previousVolume}** to **${newVolume}**.`,
        `Volumed changed from **${previousVolume}** to **${newVolume}** by ${message.member.displayName}`
    );

    PinguGuild.GetPGuild(message.guild).musicQueue = new PQueue(queue);

    PinguGuild.UpdatePGuildsJSON(message.client, module.exports.name,
        `Updated queue for **${message.guild.name}**, queue was ${(queue.playing ? "resumed" : "paused")}.`,
        `Unable to update queue for **${message.guild.name}**.`
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

    try { queue.songs.forEach(song => embed.addField(`[${queue.songs.indexOf(song) + 1}]: ${song.title}`, `Requested by: ${song.requestedBy} | Length: ${song.length}`)) }
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

    announceMessage(message, queue,
        `${PauseOrResume} music.`,
        `${PauseOrResume} by ${message.member.displayName}.`
    );

    PinguGuild.GetPGuild(message.guild).musicQueue = new PQueue(queue);

    PinguGuild.UpdatePGuildsJSON(message.client, module.exports.name,
        `Updated queue for **${message.guild.name}**, queue was ${(queue.playing ? "resumed" : "paused")}.`,
        `Unable to update queue for **${message.guild.name}**.`
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
    pGuild.musicQueue = new PQueue(queue);

    if (!song) {
        await ResetClient(message, queue);
        queue.logChannel.send('Thank you for listening!');
        queue.voiceChannel.leave();
        pGuild.musicQueue = null;

        return await PinguGuild.UpdatePGuildsJSONAsync(message.client, module.exports.name,
            `Reset & saved Queue to pGuilds.json`,
            `Error while resetting **${message.guild.name}**'s queue to pGuilds.json`
        );
    }

    var streamItem = ytdl(song.link, { filter: 'audioonly' });

    queue.connection.play(streamItem)
        .on('start', async () => {
            console.log("Song Start");

            if (message.guild.me.permissions.has("CHANGE_NICKNAME")) {
                await message.guild.me.setNickname(`[${message.guild.member(song.requestedBy).displayName} Radio] ${queue.client.displayName}`) //[Nickname Radio] Pingu
                    .catch(() => message.guild.me.setNickname(`[${song.requestedBy.username} Radio] ${queue.client.displayName}`) //[Username Radio] Pingu
                        .catch(() => message.guild.me.setNickname(`[${message.guild.me.displayName} Radio] ${queue.client.displayName}`) //[Pingu Radio] Pingu
                            .catch(() => message.guild.me.setNickname(queue.client.displayName)))); //Pingu
            }

            var nowPlayingMessage = `**Now playing:** ${song.title}\n**Requested by:** `;

            //message.client.user.setActivity(`${song.title} in ${queue.voiceChannel.name}`, 'PLAYING');
            message.client.user.setActivity(`${song.title} in ${queue.voiceChannel.name}`, { type: 'STREAMING', url: song.link })

            queue.logChannel.send(nowPlayingMessage + `${song.requestedBy.username}`)
                .then(sent => sent.edit(nowPlayingMessage + `<@${song.requestedBy.id}>`));

            PinguGuild.UpdatePGuildsJSONAsync(message.client, module.exports.name,
                `Saved Queue to pGuilds.json`,
                `Error while saving **${message.guild.name}**'s queue to pGuilds.json`
            );
        })
        .on('error', err => {
            console.log("Song Error");

            PinguLibrary.errorLog(message.client, "Voice connection error", message.content, err);
            announceMessage(message, queue, `I had a voice connection error! I've notified my developers.`)

            pGuild.musicQueue = null;
        })
        .on('end', () => {
            console.log("Song End");

        })
        .on('finish', () => {
            console.log("Song Finished");
            queue.songs.shift();
            Play(message, queue.songs[0], queue);
        })
        .setVolumeLogarithmic(queue.volume / 5);
}
/**@param {Message} message
 * @param {Queue} queue
 * @param {string} msg*/
function announceMessage(message, queue, senderMsg, logMsg) {
    if (message.channel != queue.logChannel)
        message.channel.send(senderMsg);
    return queue.logChannel.send((logMsg || senderMsg));
}

/**@param {Guild} guild
 * @param {PQueue} pqueue*/
async function getQueueElements(guild, pqueue) {
    var queue = pqueue ? new Queue(
        new PClient(guild.me, guild),
        guild.channels.cache.find(c => c.id == pqueue.logChannel.id),
        guild.channels.cache.find(c => c.id == pqueue.voiceChannel.id),
        pqueue.songs || [],
        pqueue.playing
    ) : null;

    if (queue && guild.me.voice.channel)
        queue.connection = await guild.me.voice.channel.join();
    return queue;
}

/**@param {Message} message
 * @param {Queue} queue*/
async function ResetClient(message, queue) {
    if (message.guild.me.permissions.has("CHANGE_NICKNAME"))
        await message.guild.me.setNickname(queue.client.displayName);

    await PinguLibrary.setActivity(message.client);
}