const ytdl = require('ytdl-core');

module.exports = {
    name: 'noice',
    description: 'Noice',
    usage: '',
    id: 2,
    execute(message) {
        const { voiceChannel } = message.member;

        if (message.channel.type === 'dm')
            return message.author.send(`I execute this command in DMs.`);
        else {
            const PermissionCheck = message.channel.memberPermissions(message.guild.client.user),
                PermArr = ["SEND_MESSAGES", "MANAGE_MESSAGES", "CONNECT", "SPEAK"];
            for (var Perm = 0; Perm < PermArr.length; Perm++)
                if (!PermissionCheck.has(PermArr[Perm]))
                    return `Sorry, ${message.author}. It seems like I don't have the **${PermArr[Perm]}** permission.`
        }

        message.delete();
        message.channel.send('https://tenor.com/LgPu.gif');

        if (!voiceChannel)
            return;

        voiceChannel.join().then(connection => {
            const stream = ytdl('https://www.youtube.com/watch?v=Akwm2UZJ34o', { filter: 'audioonly' }),
                dispatcher = connection.playStream(stream);

            ytdl.getInfo('https://www.youtube.com/watch?v=Akwm2UZJ34o');
            dispatcher.setVolume(0.5);

            dispatcher.on('end', () => voiceChannel.leave());
        });
    },
};