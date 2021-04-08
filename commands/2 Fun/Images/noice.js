const ytdl = require('ytdl-core');
const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('noice', 'Fun', 'Noice', {
    guildOnly: true
}, async ({ message }) => {
    message.channel.send("https://media0.giphy.com/media/yJFeycRK2DB4c/giphy.gif?cid=ecf05e47qt8qhkq6tc22hxfb01jluhsk9fc7fbca62mfrpqc&rid=giphy.gif");

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
        .on('error', err => PinguLibrary.errorLog(message.client, `Voice dispatcher error in *noice`, message.content, err, {
            params: { message },
            additional: { voiceChannel }
        }))
        .on('end', () => voiceChannel.leave())
        .setVolume(0.5);
});