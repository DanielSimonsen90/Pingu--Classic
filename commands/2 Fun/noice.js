const ytdl = require('ytdl-core');
const { Message, Permissions } = require('discord.js');
const { PinguLibrary } = require('../../PinguPackage');

module.exports = {
    name: 'noice',
    description: 'Noice',
    usage: '',
    guildOnly: true,
    id: 2,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        var PermCheck = PinguLibrary.PermissionCheck(message, [
            Permissions.FLAGS.SEND_MESSAGES,
            Permissions.FLAGS.MANAGE_MESSAGES,
        ]);
        if (PermCheck != PinguLibrary.PermissionGranted) return message.channel.send(PermCheck);

        const voiceChannel = message.member.voice.channel;
        message.delete();
        message.channel.send('https://tenor.com/LgPu.gif');

        if (!voiceChannel) return;
        PermCheck = PinguLibrary.PermissionCheck(message, [
            Permissions.FLAGS.CONNECT,
            Permissions.FLAGS.SPEAK,
        ]);
        if (PermCheck != PinguLibrary.PermissionGranted) return `${PermCheck.substring(0, PermCheck.length - 1)}, so I couldn't play the video for you in there..`;

        voiceChannel.join().then(connection => {
            const stream = ytdl('https://www.youtube.com/watch?v=Akwm2UZJ34o', { filter: 'audioonly' });
            const dispatcher = connection.play(stream);

            dispatcher.on('error', err => PinguLibrary.errorLog(message.client, `Voice dispatcher error in *noice`, message.content, err));

            ytdl.getInfo('https://www.youtube.com/watch?v=Akwm2UZJ34o');
            dispatcher.setVolume(0.5);

            dispatcher.on('end', () => voiceChannel.leave());
        });
    },
};