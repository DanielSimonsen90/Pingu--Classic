const ytdl = require('ytdl-core');
const { Message } = require('discord.js');
const { PinguLibrary, DiscordPermissions } = require('PinguPackage');

module.exports = {
    name: 'noice',
    description: 'Noice',
    usage: '',
    guildOnly: true,
    id: 2,
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message}}*/
    async execute({ message }) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return;

        let permCheck = PinguLibrary.PermissionCheck({
            author: message.author,
            channel: voiceChannel,
            client: message.client,
            content: message.content
        }, [DiscordPermissions.CONNECT, DiscordPermissions.SPEAK, DiscordPermissions.VIEW_CHANNEL]);
        if (permCheck != PinguLibrary.PermissionGranted) return message.channel.send(permCheck);

        (await voiceChannel.join()).play(ytdl('https://www.youtube.com/watch?v=Akwm2UZJ34o', { filter: 'audioonly' }))
            .on('error', err => PinguLibrary.errorLog(message.client, `Voice dispatcher error in *noice`, message.content, err))
            .on('end', () => voiceChannel.leave())
            .setVolume(0.5);

    },
};