const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('mood', 'Fun', 'My current mood', null, async ({ message }) => {
    let moodTypes = [
        "I'm not feeling so good...",
        "I'm feeling kinda tired",
        "I'm hungry. Isn't it food time soon?",
        "I'm feeling pretty good tbh",
        "I'm not that bad tbh",
        "Idk what I'm feeling man... L-LEAVE ME **ALONE**! :)"
    ];

    return message.channel.send(moodTypes[Math.floor(Math.random() * moodTypes.length)]);
});