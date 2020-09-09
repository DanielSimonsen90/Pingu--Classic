const { MessageEmbed, Message, Guild } = require('discord.js');
module.exports = {
    name: 'serverinfo',
    description: 'Sends server information.',
    usage: '[Server ID]',
    guildOnly: true,
    id: 1,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        if (args[0] == null)
            return SendInfo(message, message.guild);
        //return SendInfo(message, new Discord.Guild(message.client, message.client.fetchGuildPreview(args[0])));

    },
};

/**@param {Message} message @param {Guild} guild*/
function SendInfo(message, guild) {
    const Embed = new MessageEmbed()
        .setTitle(`Server Information: ${guild.name}`)
        .setThumbnail(guild.iconURL)
        .setColor(0xfb8927)
        .addField(`Total members`, guild.memberCount, true)
        .addBlankField(true)
        .addField(`Region`, guild.region.charAt(0).toUpperCase() + guild.region.substring(1, guild.region.length), true)
        .addField(`Owner`, guild.owner, true)
        .addBlankField(true)
        .addField(`Creation Date`, guild.createdAt, false);

    return !message.channel.permissionsFor(message.guild.client.user).has('SEND_MESSAGES') ?
        message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!\nBut here's your information:`).then(() => message.author.send(Embed)) :
    message.channel.send(Embed);
}