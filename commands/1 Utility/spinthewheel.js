module.exports = {
    name: 'spinthewheel',
    description: 'set the prefix of server',
    usage: '<option1>, <option2>, <option3>....',
    id: 1,
    example: ['Yes, No', 'Pizza, McDonalds, Sandwich, Noodles'],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        var stringArgs = args.join(' ') || "Yes, No";
        const options = stringArgs.split(', ');
        const ranItem = Math.round(Math.random() * Math.floor(options.length - 1));

        var result = options[ranItem];
        console.log(`Result: ${result}`);

        message.channel.send(result);
    }
}