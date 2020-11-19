const { Message, MessageEmbed, Permissions } = require('discord.js');
const { PinguGuild, PinguSupport, PinguLibrary } = require('../../PinguPackage');

module.exports = {
    name: 'support',
    cooldown: 5,
    description: 'Contact information incase something is :b:roke or if any questions may occur about me',
    usage: '',
    id: 3,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        var Embed = new MessageEmbed()
            .setTitle('Support of Pingu')
            .setDescription('Contact information & socials about my owner')
            .setColor(message.channel.type != 'dm' ? PinguGuild.GetPGuild(message.guild).embedColor : 15527148)
            .setThumbnail(message.client.user.avatarURL)
            .setFooter(`Please don't send him pointless stuff to waste his time :)`)
            .addField('Discord', '@Danho#2105', true)
            .addField('GMail', 'pingulevel1@gmail.com', true)
            .addField('Support Server', 'https://discord.gg/Mp4CH8eftv', true)
            .addField("\u200B", "\u200B", true)
            .addField('Spotify', 'https://open.spotify.com/artist/2Ya69OwtcUqvAMPaE8vXdg', false)
            .addField('YouTube', 'https://www.youtube.com/channel/UCNy01Kv9gpTLeKGHzdMbb0w?', false)
            .addField('SoundCloud', 'https://soundcloud.com/daniel-simonsen-705578407', false)
            .addField('Instagram', 'https://www.instagram.com/danhoesaurus/', false);

        if (message.channel.type != 'dm') {
            var permCheck = PinguLibrary.PermissionCheck(message, [Permissions.FLAGS.SEND_MESSAGES]);
            if (permCheck != PinguLibrary.PermissionGranted) return message.author.send(`${permCheck}\nBut here's your information:`, Embed);
        }
        message.channel.send(Embed);
    },
};