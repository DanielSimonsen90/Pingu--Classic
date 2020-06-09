const Discord = require('discord.js');
module.exports = {
    name: 'serverinfo',
    description: 'Sends server information.',
    usage: '',
    guildOnly: true,
    id: 1,
    execute(message, args) {
        const RegionUpper = message.guild.region.charAt(0).toUpperCase(),
            RegionRest = message.guild.region.substring(1, message.guild.region.length),
            Region = RegionUpper + RegionRest,
            Embed = new Discord.RichEmbed()
                .setTitle(`Server Information`)
                .setThumbnail(message.guild.iconURL)
                .setColor(0xfb8927)
                .addField(`Server name`, message.guild.name, true)
                .addField(`Total members`, message.guild.memberCount, true)
                .addBlankField(true)
                .addField(`Region`, Region, true)
                .addField(`Owner`, message.guild.owner, true)
                .addBlankField(true)
                .addField(`Creation Date`, message.guild.createdAt, false);

        if (!message.channel.memberPermissions(message.guild.client.user).has('SEND_MESSAGES')) {
            message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!\nBut here's your information:`)
            return message.author.send(Embed);
        }

        return message.channel.send(Embed);
    },
};