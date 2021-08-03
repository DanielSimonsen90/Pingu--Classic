const ytdl = require('ytdl-core');
const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('noice', 'Fun', 'Noice', {
    guildOnly: true
}, async ({ client, message }) => {
    message.channel.send("https://media0.giphy.com/media/yJFeycRK2DB4c/giphy.gif?cid=ecf05e47qt8qhkq6tc22hxfb01jluhsk9fc7fbca62mfrpqc&rid=giphy.gif");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return;

    const { author, member, guild } = message;
    let permCheck = client.permissions.checkFor({ channel: voiceChannel, author }, 'CONNECT', 'SPEAK', 'VIEW_CHANNEL');
    if (permCheck != client.permissions.PermissionGranted) return message.channel.send(permCheck);

    var conn = await voiceChannel.join();
    conn.play(ytdl('https://www.youtube.com/watch?v=Akwm2UZJ34o', { filter: 'audioonly' }))
        .on('start', () => client.AchievementCheck({ user: author, guildMember: member, guild }, 'VOICE', 'Noice', [conn.voice]))
        .on('error', err => client.log('error', `Voice dispatcher error in *noice`, message.content, err, {
            params: { message },
            additional: { voiceChannel }
        }))
        .on('end', () => voiceChannel.leave())
        .setVolume(0.5);
});