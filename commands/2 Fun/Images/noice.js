const ytdl = require('ytdl-core');
const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('noice', 'Fun', 'Noice', {
    guildOnly: true
}, async ({ message }) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return;

    let permCheck = PinguLibrary.PermissionCheck({
        author: message.author,
        channel: voiceChannel,
        client: message.client,
        content: message.content
    }, 'CONNECT', 'SPEAK', 'VIEW_CHANNEL');
    if (permCheck != PinguLibrary.PermissionGranted) return message.channel.send(permCheck);

    (await voiceChannel.join()).play(ytdl('https://www.youtube.com/watch?v=Akwm2UZJ34o', { filter: 'audioonly' }))
        .on('error', err => PinguLibrary.errorLog(message.client, `Voice dispatcher error in *noice`, message.content, err))
        .on('end', () => voiceChannel.leave())
        .setVolume(0.5);
});