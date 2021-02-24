const { PinguCommand } = require("PinguPackage");

module.exports = new PinguCommand('setactivity', 'DevOnly', "Make me do something else than listening to people's screams", {
    usage: '<status type> <status message>',
    examples: ["listening my jam"]
}, async ({ client, message, args }) => {
    if (!args[0] || !args[1])
        return message.channel.send(`You didn't provide me with enough arguments!`);
    else if (!['PLAYING', 'WATCHING', 'LISTENING', 'COMPETING'].includes(args[0]))
        return message.channel.send(`What am I supposed to do? Play? Listen? Watch?`);

    let Activity = args.shift(),
        ActivityMessage = args.join(" ");
        client.user.setActivity({
            name: `${ActivityMessage} ${client.DefaultPrefix}help`,
            type: Activity
        });

    return message.channel.send(`Updated activity!`);
});