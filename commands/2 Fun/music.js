const { Message, MessageEmbed, VoiceChannel } = require('discord.js'),
    ytdl = require('ytdl-core');
const { PinguGuild, Queue, Song } = require('../../PinguPackage');
var MainActivity;

module.exports = {
    name: 'music',
    description: 'plays moives and videos',
    usage: `<play <link | search>> | volume [new volume] | move <posA> <posB> | stop | skip | nowplaying | queue | pause | resume>`,
    guildOnly: true,
    id: 2,
    example: ["play https://www.youtube.com/watch?v=dQw4w9WgXcQ", ],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        const voiceChannel = message.member.voice.channel,
            PermCheck = PermissionCheck(message, voiceChannel);
        if (PermCheck != `Permission Granted`) return message.channel.send(PermCheck);

        const command = args.shift().toLowerCase(),
            queue = PinguGuild.GetPGuild(message).musicQueue;
        MainActivity = message.client.user.presence;

        if (command == 'play' || command == 'p')
            return HandlePlay(message, args, voiceChannel, queue);

        if (!queue) return message.channel.send('Nothing is playing!');

        switch (command) {
            case st: case stop: HandleStop(queue); break;
            case sk: case skip: HandleSkip(message, queue); break;
            case np: case nowplaying: HandleNowPlaying(message, queue); break;
            case vol: case volume: HandleVolume(message, args[0], queue); break;
            case q: case queue: HandleQueue(message, queue); break;
            case pause: case resume: HandlePauseResume(message, queue, command == 'pause'); break;
            case move: case mo: HandleMove(message, queue, args); break;
            default: return console.log(`Ran default switch using ${command}`);
        }
    },
};

/**@param {Message} message @param {VoiceChannel} voiceChannel*/
function PermissionCheck(message, voiceChannel) {
    const PermArr = ["SEND_MESSAGES", "CONNECT", "SPEAK"];
    for (var Perm = 0; Perm < PermArr.length; Perm++)
        if (!message.channel.permissionsFor(message.client.user).has(PermArr[Perm]))
            return `Sorry, ${message.author}. It seems like I don't have the **${PermArr[Perm]}** permission.`
    if (!voiceChannel)
        return `Please join a **voice channel** before executing command ${message.author}!`;
    return `Permission Granted`;
}

//#region Command Handling
/**Executes when author sends *music play
 * @param {Message} message 
 * @param {string[]} args 
 * @param {VoiceChannel} voiceChannel
 * @param {Queue} queue*/ async function HandlePlay(message, args, voiceChannel, queue) {
    const song = new Song(await ytdl.getInfo(args[1]));

    if (!queue) {
        queue = new Queue(message.channel, VoiceChannel);
        queue.setConnection(await voiceChannel.join());
        queue.add(song);
        Play(message.guild, queue.songs[0]);
    }
    else {
        if (!queue.playing) return HandlePauseResume(message, queue);
        queue.add(song);
        message.channel.send(`**${song.title}** was added to the queue.`);
    }
}
/**Executes when author sends *music stop
 * @param {Queue} queue*/ function HandleStop(queue) {
    queue.songs = [];
    queue.connection.dispatcher.end();
}
/**Executes when author sends *music skip
 * @param {Message} message
 * @param {Queue} queue*/ function HandleSkip(message, queue) {
    queue.connection.dispatcher.end();
    if (message.channel != queue.logChannel)
        queue.logChannel.send(`Skipped, requested by **${message.guild.member(message.author).nickname}**.`);
    message.channel.send(`Skipped!`);
}
/**Executes when author sends *music np
 * @param {Message} message
 * @param {Queue} queue*/ function HandleNowPlaying(message, queue) {
    message.channel.send(`Currently playing: **${queue.songs[0].title}**`);
}
/**Executes when author sends *music volume
 * @param {Message} message 
 * @param {string} newVolume
 * @param {Queue} queue*/ function HandleVolume(message, newVolume, queue) {
    if (!newVolume)
        return message.channel.send(`Volume is currently **${queue.volume}**`);
    queue.connection.dispatcher.setVolumeLogarithmic(newVolume / 5);
    const previousVolume = queue.volume;
    queue.volume = parseInt(newVolume);
    message.channel.send(`Volumed changed from **${previousVolume}** to **${newVolume}**.`);
}
/**Executes when author sends *music queue
 * @param {Message} message
 * @param {Queue} queue*/ function HandleQueue(message, queue) {
    const embed = new MessageEmbed()
        .setTitle(`Queue for ${queue.voiceChannel.name}`)
        .setImage(message.client.user.avatarURL())
        .setColor(PinguGuild.GetPGuild(message).embedColor);

    try { queue.songs.forEach(song => embed.addField(`#${queue.songs.indexOf(song) + 1} ${song.title}`, song.length)) }
    catch (e) { return message.channel.send(e); }

    message.channel.send(embed);
}
/**Executes when author sends *music pause or *music resume
 * @param {Message} message
 * @param {Queue} queue
 * @param {boolean} pauseRequest*/ function HandlePauseResume(message, queue, pauseRequest) {
    if (!queue.playing && pauseRequest) return message.channel.send('Music is already paused!');
    else if (queue.playing && !pauseRequest) return message.channel.send(`I've already resumed the music again!`);

    if (pauseRequest) queue.connection.dispatcher.pause();
    else queue.connection.dispatcher.resume();

    queue.playing = !pauseRequest;
    const PauseOrResume = pauseRequest ? 'Paused' : 'Resumed';

    if (message.channel != queue.logChannel)
        queue.logChannel.send(`${PauseOrResume} by ${message.guild.member(message.author).nickname}.`)
    message.channel.send(`${PauseOrResume} music.`);
}
/**Executes when author sends *music move
 * @param {Message} message
 * @param {Queue} queue
 * @param {string[]} args*/ function HandleMove(message, queue, args) {

}
//#endregion

/**@param {Message} message @param {Song} song*/
function Play(message, song) {
    const queue = PinguGuild.GetPGuild(message).musicQueue;

    PinguGuild.UpdatePGuildsJSONAsync(message,
        `Saved Queue to pGuilds.json`,
        `Error while saving "${message.guild.name}"'s queue to pGuilds.json`
    );

    if (!song) {
        queue.logChannel.send('Thank you for listening!');
        queue.voiceChannel.leave();
        PinguGuild.GetPGuild(message).musicQueue = null;
        message.client.user.presence = MainActivity;
        return;
    }

    queue.connection.play(ytdl(song.link))
        .on('start', () => {
            message.client.user.setActivity(`${song.title} in ${voiceChannel.name}`, 'PLAYING');
            queue.logChannel.send(`**Now playing:** ${song.title}`);
        })
        .on('error', err => {
            console.log(err);
            queue.logChannel.send(err);
            PinguGuild.GetPGuild(message).musicQueue = null;
        })
        .on('end', () => {
            queue.songs.shift();
            Play(message, queue.songs[0]);
        }).setVolumeLogarithmic(queue.volume);
}