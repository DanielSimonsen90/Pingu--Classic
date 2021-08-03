const { MessageEmbed } = require('discord.js');
const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('contact', 'Supporting', 'Contact information incase something is :b:roke or if any questions may occur about mr. bot owner', {
    permissions: ["EMBED_LINKS"]
}, async ({ client, message, pGuildClient }) => {
    let Danho = client.developers.get('Danho');

    return message.channel.send(new MessageEmbed({
        title: 'Support of Pingu',
        color: pGuildClient.embedColor || client.DefaultEmbedColor,
        thumbnail: { url: Danho.avatarURL() },
        footer: { text: `Please don't send him pointless stuff to waste his time :)` },
        description: (
            `Contact information & socials about my owner\n` +
            `**Discord:** ${Danho}\n` +
            `[**Support Server**](${client.invite})\n` +
            `[**Github**](https://www.github.com/DanielSimonsen90/)\n` +
            `[**Spotify**](https://open.spotify.com/artist/2Ya69OwtcUqvAMPaE8vXdg)\n` +
            `[**YouTube**](https://www.youtube.com/channel/UCNy01Kv9gpTLeKGHzdMbb0w?)\n` +
            `[**SoundCloud**](https://soundcloud.com/daniel-simonsen-705578407)\n` +
            `[**Twitch**](https://www.twitch.tv/danhoesaurus)\n` +
            `[**Instagram**](https://www.instagram.com/danhoesaurus/)\n`
        )
    }));
});