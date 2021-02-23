const { Message, TextChannel } = require('discord.js');
const { PinguCommand, PinguLibrary, TimeLeftObject } = require('PinguPackage');
const ms = require('ms');

module.exports = new PinguCommand('slowmode', 'Utility', 'Sets the slowmode to specified argument in channel', {
    usage: ['[#channel] <slowmode in seconds>'],
    guildOnly: true,
    permissions: ['MANAGE_CHANNELS']
}, async ({ message, args, pGuildClient }) => {
    let permCheck = PermissionCheck(message, args);
    if (permCheck != PinguLibrary.PermissionGranted) return message.channel.send(permCheck);

    const channel = getChannel(message, args);
    if (channel != message.channel) args.shift();

    let timeArgument = args.shift();
    let time = isNaN(ms(timeArgument)) ? parseInt(timeArgument) : ms(timeArgument) / 1000;

    let auditLogMessage = `${pGuildClient.prefix}slowmode used by ${message.member.displayName}`;

    channel.setRateLimitPerUser((time < 0 ? 0 : time), auditLogMessage).catch(err => {
        PinguLibrary.errorLog(message.client, `Error changing slowmode`, message.content, err);
        message.channel.send(`I had an error setting the slowmode! I've contacted my developers...`);
        return channel.rateLimitPerUser;
    }).then(channel => message.channel.send(`Successfully set ${channel}'s slowmode to ${getTimeString(message, time)}`));
});



/**@param {Message} message
 * @param {string[]} args*/
function PermissionCheck(message, args) {
    const channel = getChannel(message, args);
    if (!args[0] || channel != message.channel && !args[1]) return `The slowmode for ${channel} is ${getTimeString(message, channel.rateLimitPerUser)}`;
    else if (isNaN(ms(args[0])) && isNaN(parseInt(args[0]))) return `${args[0]} is not a valid argument! How much slowmode do you want?`;
    else if (!channel.isText()) return `Channel must be a text channel!`;

    return PinguLibrary.PermissionCheck(message, ['MANAGE_CHANNELS']);
}
/**@param {Message} message
 * @param {string[]} args
 * @returns {TextChannel}*/
function getChannel(message, args) {
    let channelData = args[0];
    return message.guild.channels.cache.find(c => [c.id, c.name].includes(channelData) || c == message.mentions.channels.first()) || message.channel;
}
/**@param {Message} message
 * @param {number} time*/
function getTimeString(message, time) {
    let stringThing = new TimeLeftObject(message.createdAt, new Date(message.createdTimestamp + time * 1000));
    return stringThing.toString();
}