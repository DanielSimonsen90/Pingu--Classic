const { Message } = require('discord.js');
const { DiscordPermissions } = require('../../PinguPackage');

module.exports = {
    name: 'mood',
    cooldown: 5,
    description: 'My current mood',
    usage: '',
    id: 2,
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message}}*/
    execute({ message }) {
        let Mood;

        switch (Math.floor(Math.random() * Math.floor(5))) {
            case 1: Mood = `I'm not feeling so good...`; break;
            case 2: Mood = `I'm feeling kinda tired..`; break;
            case 3: Mood = `I'm hungry. Isn't it food time soon?`; break;
            case 4: Mood = `I'm feeling pretty good tbh`; break;
            case 5: Mood = `I'm not too bad tbh`; break;
            default: Mood = `Idk what I'm feeling man... L-LEAVE ME **ALONE**! :)`
        }
        return message.channel.send(Mood);
    },
};