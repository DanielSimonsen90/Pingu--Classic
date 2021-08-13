const { Message, TextChannel } = require('discord.js');
const { PinguCommand, TimeLeftObject } = require('PinguPackage');
const ms = require('ms');

module.exports = new PinguCommand('slowmode', 'Utility', 'Sets the slowmode to specified argument in channel', {
    usage: ['[#channel] <slowmode in seconds>'],
    guildOnly: true,
    permissions: ['MANAGE_CHANNELS']
}, async ({ client, message, args, pGuildClient }) => {
    let permCheck = PermissionCheck();
    if (permCheck != client.permissions.PermissionGranted) return message.channel.send(permCheck);

    const channel = getChannel();
    if (channel != message.channel) args.shift();

    let timeArgument = args.shift();
    let time = isNaN(ms(timeArgument)) ? parseInt(timeArgument) : ms(timeArgument) / 1000;

    let auditLogMessage = `${pGuildClient.prefix}slowmode used by ${message.member.displayName}`;

    return channel.setRateLimitPerUser((time < 0 ? 0 : time), auditLogMessage).catch(err => {
        client.log('error', `Error changing slowmode`, message.content, err, {
            params: { message, args, pGuildClient },
            additional: { channel, timeArgument, time, auditLogMessage }
        });
        message.channel.send(`I had an error setting the slowmode! I've contacted my developers...`);
        return channel.rateLimitPerUser;
    }).then(channel => message.channel.send(`Successfully set ${channel}'s slowmode to ${getTimeString(time)}`));

    function PermissionCheck() {
        const channel = getChannel();
        if (!args[0] || channel != message.channel && !args[1]) return `The slowmode for ${channel} is ${getTimeString(message, channel.rateLimitPerUser)}`;
        else if (isNaN(ms(args[0])) && isNaN(parseInt(args[0]))) return `${args[0]} is not a valid argument! How much slowmode do you want?`;
        else if (!channel.isText()) return `Channel must be a text channel!`;
    
        return client.permissions.checkFor(message, 'MANAGE_CHANNELS');
    }
    /**@returns {TextChannel}*/
    function getChannel() {
        let channelData = args[0];
        return message.guild.channels.cache.find(c => [c.id, c.name].includes(channelData) || c == message.mentions.channels.first()) || message.channel;
    }
    /** @param {number} time*/
    function getTimeString(time) {
        return new TimeLeftObject(message.createdAt, new Date(message.createdTimestamp + time * 1000)).toString()
    }
});