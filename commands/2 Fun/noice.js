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
        else if (!voiceChannel.permissionsFor(message.guild.me).has(Permissions.FLAGS.CONNECT))
            return message.channel.send(`I don't have permission to **connect** to ${voiceChannel.name}`);
        else if (!voiceChannel.permissionsFor(message.guild.me).has(Permissions.FLAGS.SPEAK))
            return message.channel.send(`I don't have permission to **speak** to ${voiceChannel.name}`);

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