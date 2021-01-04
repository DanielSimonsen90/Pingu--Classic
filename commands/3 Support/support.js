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
            .addField("\u200B", `[**Support Server**](https://discord.gg/gbxRV4Ekvh)`, true)
            .addField("\u200B", `[**Github**](https://www.github.com/DanielSimonsen90/)`, true)
            .addField("\u200B", `[**Spotify**](https://open.spotify.com/artist/2Ya69OwtcUqvAMPaE8vXdg)`, true)
            .addField("\u200B", `[**YouTube**](https://www.youtube.com/channel/UCNy01Kv9gpTLeKGHzdMbb0w?)`, true)
            .addField("\u200B", `[**SoundCloud**](https://soundcloud.com/daniel-simonsen-705578407)`, true)
            .addField("\u200B", `[**Twitch**](https://www.twitch.tv/danhoesaurus)`, true)
            .addField("\u200B", `[**Instagram**](https://www.instagram.com/danhoesaurus/)`, true)
            .addField("\u200B", "\u200B", true);
        message.channel.send(Embed);
    },
};