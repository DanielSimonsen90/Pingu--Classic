const { Message, MessageEmbed } = require('discord.js');
const { PinguGuild, DiscordPermissions } = require('../../PinguPackage');

module.exports = {
    name: 'support',
    cooldown: 5,
    description: 'Contact information incase something is :b:roke or if any questions may occur about me',
    usage: '',
    id: 3,
    permissions: [DiscordPermissions.SEND_MESSAGES, DiscordPermissions.EMBED_LINKS],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        var Embed = new MessageEmbed()
            .setTitle('Support of Pingu')
            .setDescription('Contact information & socials about my owner')
            .setColor(message.channel.type != 'dm' ? PinguGuild.GetPGuild(message.guild).embedColor : 15527148)
            .setThumbnail(message.client.user.avatarURL)
            .setFooter(`Please don't send him pointless stuff to waste his time :)`)
            .addField('Discord', '@Danho#2105', true)
            .addField('E-mail', 'pingulevel1@gmail.com', true)
            .addField('Support Server', 'https://discord.gg/gbxRV4Ekvh', true)
            .addField("\u200B", "\u200B", true)
            .addField('Spotify', 'https://open.spotify.com/artist/2Ya69OwtcUqvAMPaE8vXdg', false)
            .addField('YouTube', 'https://www.youtube.com/channel/UCNy01Kv9gpTLeKGHzdMbb0w?', false)
            .addField('SoundCloud', 'https://soundcloud.com/daniel-simonsen-705578407', false)
            .addField('Instagram', 'https://www.instagram.com/danhoesaurus/', false)
            .addField('Github', 'https://www.github.com/DanielSimonsen90/', false);
        message.channel.send(Embed);
    },
};