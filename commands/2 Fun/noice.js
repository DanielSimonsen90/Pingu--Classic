const ytdl = require('ytdl-core');
const { Message } = require('discord.js');
const { PinguLibrary, DiscordPermissions } = require('../../PinguPackage');

module.exports = {
    name: 'noice',
    description: 'Noice',
    usage: '',
    guildOnly: true,
    id: 2,
    permissions: [DiscordPermissions.SEND_MESSAGES, DiscordPermissions.MANAGE_MESSAGES],
    /**@param {{message: Message}}*/
    async execute({ message }) {
        const voiceChannel = message.member.voice.channel;
        message.delete();
        message.channel.send('https://tenor.com/LgPu.gif');

        if (!voiceChannel) return;
        let permCheck = PinguLibrary.PermissionCheck({
            author: message.author,
            channel: voiceChannel,
            client: message.client,
            content: message.content
        }, [DiscordPermissions.CONNECT, DiscordPermissions.SPEAK, DiscordPermissions.VIEW_CHANNEL]);
        if (permCheck != PinguLibrary.PermissionGranted) return message.channel.send(permCheck);

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