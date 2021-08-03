const { PinguCommand } = require("PinguPackage");

module.exports = new PinguCommand('spinthewheel', 'Utility', 'Get a random item from your list of items.', {
    usage: '<option1>, <option2>, <option3>....',
    example: ['Yes, No', 'Pizza, McDonalds, Sandwich, Noodles'],
    aliases: ["stw"]
}, async ({ client, message, args }) => {
    const stringArgs = args.join(' ') || "Yes, No";
    const options = stringArgs.split(', ');
    const ranItem = Math.round(Math.random() * Math.floor(options.length - 1));

    const result = options[ranItem];
    client.log('console', `Spun [${args.join(', ')}]\nResult: ${result}`);

    return message.channel.send(result);
});