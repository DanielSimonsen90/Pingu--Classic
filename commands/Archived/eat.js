const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('eat', 'Fun', 'Is this you, Slothman?', {
    usage: '<food>',
    examples: ["fish"]
}, async ({ message, args }) => {
    let Reply;
    switch (args[0]) {
        case 'shit': Reply = `no u eat the ${args[0]}. :KChamp:`; break;
        case 'fish': Reply = `MMmmmMm! Yes please! Gimme!!`; break;
        case 'leaf': Reply = `What am I a fucking sloth?`; break;
        case 'monster': Reply = `What am I a fucking Billet?`; break;
        case 'sand': Reply = `Am I *that* black??`; break;
        default: Reply = `Uhm.. I don't think I should eat that..`; break;
    }
    return message.channel.send(Reply);
});