const { TextChannel, NewsChannel } = require('discord.js');
const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('publish', 'Utility', 'Publishes message in announcement channe', {
    usage: '[#channel], <message id>',
    guildOnly: true,
    examples: ["#announcements 788551586178793493", "788054169352536074"]
}, async ({ client, message, args }) => {
    if (!args) return message.channel.send(`I need a message ID, so I can publish your message!`);
    
    const { author, content } = message;
    let channel = getChannel();

    if (channel.type != 'news') return message.channel.send(`${channel} is not an Announcement channel!`);
    let messageID = args.shift();

    let unannounced = await channel.messages.fetch(messageID);
    if (!unannounced) return message.channel.send(`I couldn't fetch a message using **${messageID}** from ${channel}!`);

    let permCheck = client.permissions.checkFor({ author, channel }, 'VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES');
    if (permCheck != client.permissions.PermissionGranted) return message.channel.send(permCheck);

    await unannounced.crosspost();
    return message.channel.send(`Published **${unannounced.id}** (from **${unannounced.author.tag}**) in ${channel}.`);

    /**@returns {TextChannel | NewsChannel} */
    function getChannel() {
        let channel = message.mentions.channels.first();
        if (channel) {
            const mentionIndex = args.mentions.get('CHANNEL').index;
            args.splice(mentionIndex);
        }
        else channel = message.channel;
        return channel;
    }
});