const ytdl = require('ytdl-core');
const { Message } = require('discord.js');

module.exports = {
    name: 'noice',
    description: 'Noice',
    usage: '',
    id: 2,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        PermCheck = PermissionCheck(message);
        if (PermCheck != `Permission Granted`) return message.channel.send(PermCheck);

        const voiceChannel = message.member.voice.channel;
        message.delete();
        message.channel.send('https://tenor.com/LgPu.gif');

        if (!voiceChannel) return;

        voiceChannel.join().then(connection => {
            const stream = ytdl('https://www.youtube.com/watch?v=Akwm2UZJ34o', { filter: 'audioonly' });
            const dispatcher = connection.play(stream);

            dispatcher.on('error', err => message.channel.send(err));

            ytdl.getInfo('https://www.youtube.com/watch?v=Akwm2UZJ34o');
            dispatcher.setVolume(0.5);

            dispatcher.on('end', () => voiceChannel.leave());
        });
    },
};
/**@param {Message} message */
function PermissionCheck(message) {
    if (message.channel.type === 'dm')
        return `I execute this command in DMs.`;

    const PermArr = ["SEND_MESSAGES", "MANAGE_MESSAGES", "CONNECT", "SPEAK"];
    for (var Perm = 0; Perm < PermArr.length; Perm++)
        if (!message.channel.permissionsFor(message.client.user).has(PermArr[Perm]))
            return `Sorry, ${message.author}. It seems like I don't have permission to **${PermArr[Perm].toLowerCase().replace('_',' ')}**!`
    return `Permission Granted`
}