const { Message, MessageEmbed } = require('discord.js');

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
            .setColor(0xfb8927)
            .setThumbnail(message.client.user.avatarURL)
            .setFooter('Please don\'t send him pointless stuff to waste his time :)')
            .addField('Discord', '@Daddy Danneko#2105', true)
            .addField('GMail', 'pingulevel1@gmail.com', true)
            .addBlankField(true)
            .addField('Spotify', 'https://open.spotify.com/artist/2Ya69OwtcUqvAMPaE8vXdg', false)
            .addField('YouTube', 'https://www.youtube.com/channel/UCNy01Kv9gpTLeKGHzdMbb0w?', false)
            .addField('SoundCloud', 'https://soundcloud.com/daniel-simonsen-705578407', false)
            .addField('Instagram', 'https://www.instagram.com/danhoesaurus/', false);

        if (message.channel.type != 'dm')
            if (!message.channel.permissionsFor(message.client.user).has('SEND_MESSAGES')) {
                message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!\nBut here's your information:`)
                return message.author.send(Embed);
            }

        message.channel.send(Embed);
    },
};