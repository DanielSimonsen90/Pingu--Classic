const { Message, MessageEmbed} = require('discord.js');
module.exports = {
    name: 'latestrelease',
    cooldown: 5,
    description: 'My owner\'s latest release',
    usage: '',
    id: 3,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        if (message.channel.type != 'dm')
            if (!message.channel.permissionsFor(message.guild.client.user).has('SEND_MESSAGES'))
                return message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!`);

        const Embed = new MessageEmbed()
            .setTitle('Latest Releases')
            .setColor(0xfb8927)
            //.setThumbnail('')
            .setDescription('See the latest releases from Daniel Simonsen!')
            .setFooter(`Don't be afraid to follow uwu`)
            .addField('Latest Single', 'https://soundcloud.com/daniel-simonsen-705578407/partner')
            .addField('Latest Album', 'https://open.spotify.com/album/1mTc6wUXaknWCqg4nxLXzU?si=1dragSqnR9SDhEqWq7l0Ew')
            .addField('Latest Remix', 'https://www.youtube.com/watch?v=VKbzrbwRykI')
        message.channel.send(Embed);

        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(message.guild.client.user).has('EMBED_LINKS'))
                message.channel.send(`I'm sorry there's no embed. I don't have the **embed links** permission.`);
    },
};