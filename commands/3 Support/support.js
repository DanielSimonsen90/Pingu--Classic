const { Message, MessageEmbed } = require('discord.js');
const { PinguGuild, DiscordPermissions, PinguLibrary } = require('../../PinguPackage');

module.exports = {
    name: 'support',
    cooldown: 5,
    description: 'Contact information incase something is :b:roke or if any questions may occur about me',
    usage: '',
    id: 3,
    permissions: [DiscordPermissions.SEND_MESSAGES, DiscordPermissions.EMBED_LINKS],
    /**@param {{message: Message, pGuild: PinguGuild}}*/
    async execute({ message, pGuild }) {
        let Danho = PinguLibrary.SavedServers.DanhoMisc(message.client).owner.user;
        var Embed = new MessageEmbed()
            .setTitle('Support of Pingu')
            .setColor(message.guild ? pGuild.embedColor : PinguLibrary.DefaultEmbedColor)
            .setThumbnail(Danho.avatarURL())
            .setFooter(`Please don't send him pointless stuff to waste his time :)`)
            .setDescription(
                `Contact information & socials about my owner\n` +
                `**Discord:** ${Danho}\n` +
                `[**Support Server**](https://discord.gg/gbxRV4Ekvh)\n` +
                `[**Github**](https://www.github.com/DanielSimonsen90/)\n` +
                `[**Spotify**](https://open.spotify.com/artist/2Ya69OwtcUqvAMPaE8vXdg)\n` +
                `[**YouTube**](https://www.youtube.com/channel/UCNy01Kv9gpTLeKGHzdMbb0w?)\n` +
                `[**SoundCloud**](https://soundcloud.com/daniel-simonsen-705578407)\n` +
                `[**Twitch**](https://www.twitch.tv/danhoesaurus)\n` +
                `[**Instagram**](https://www.instagram.com/danhoesaurus/)\n`
            );
        message.channel.send(Embed);
    },
};