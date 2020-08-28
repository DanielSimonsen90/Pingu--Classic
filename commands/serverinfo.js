const Discord = require('discord.js');
module.exports = {
    name: 'serverinfo',
    description: 'Sends server information.',
    usage: '[Server ID]',
    guildOnly: true,
    id: 1,
    execute(message, args) {
        if (args[0] == null)
            return SendInfo(message.guild);
        //return SendInfo(new Discord.Guild(message.client, message.client.fetchGuildPreview(args[0])));

    },
};

function SendInfo(guild) {
    const Embed = new Discord.RichEmbed()
        .setTitle(`Server Information: ${guild.name}`)
        .setThumbnail(guild.iconURL)
        .setColor(0xfb8927)
        .addField(`Total members`, guild.memberCount, true)
        .addBlankField(true)
        .addField(`Region`, guild.region.charAt(0).toUpperCase() + guild.region.substring(1, guild.region.length), true)
        .addField(`Owner`, guild.owner, true)
        .addBlankField(true)
        .addField(`Creation Date`, guild.createdAt, false);

    if (!message.channel.memberPermissions(message.guild.client.user).has('SEND_MESSAGES')) {
        message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!\nBut here's your information:`)
        return message.author.send(Embed);
    }

    return message.channel.send(Embed);
}