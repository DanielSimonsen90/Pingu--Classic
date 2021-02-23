const { PinguCommand, PinguLibrary } = require("PinguPackage");

module.exports = new PinguCommand('spinthewheel', 'Utility', 'Get a random item from your list of items.', {
    usage: '<option1>, <option2>, <option3>....',
    example: ['Yes, No', 'Pizza, McDonalds, Sandwich, Noodles'],
    aliases: ["stw"]
}, async ({ message, args }) => {
    var stringArgs = args.join(' ') || "Yes, No";
    const options = stringArgs.split(', ');
    const ranItem = Math.round(Math.random() * Math.floor(options.length - 1));

    var result = options[ranItem];
    PinguLibrary.consoleLog(message.client, `Result: ${result}`);

    message.channel.send(result);
});