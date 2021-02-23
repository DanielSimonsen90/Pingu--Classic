const { TextChannel, NewsChannel } = require('discord.js');
const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('publish', 'Utility', 'Publishes message in announcement channe', {
    usage: '[#channel], <message id>',
    guildOnly: true,
    examples: ["#outages 788551586178793493", "788054169352536074"]
}, async ({ message, args }) => {
    if (!args) return message.channel.send(`I need a message ID, so I can publish your message!`);

    let channel = getChannel();

    if (channel.type != 'news') return message.channel.send(`${channel} is not an Announcement channel!`);
    let messageID = args.find(v => v);

    let unannounced = await channel.messages.fetch(messageID);
    if (!unannounced) return message.channel.send(`I couldn't fetch a message using **${messageID}** from ${channel}!`);

    let permCheck = PinguLibrary.PermissionCheck({
        author: message.author,
        channel,
        client: message.client,
        content: message.content
    }, ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES']);
    if (permCheck != PinguLibrary.PermissionGranted) return message.channel.send(permCheck);

    await unannounced.crosspost();
    return message.channel.send(`Published **${unannounced.id}** (from **${unannounced.author.tag}**) in ${channel}.`);

    /**@returns {TextChannel | NewsChannel} */
    function getChannel() {
        let channel = message.mentions.channels.first();
        if (channel) {
            for (var i = 0; i < args.length; i++) {
                if (args[i] == `<#${channel.id}>`)
                    args[i] = null;
            }
        }
        else channel = message.channel;
        return channel;
    }
});