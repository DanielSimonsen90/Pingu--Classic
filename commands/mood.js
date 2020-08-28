const { Message } = require('discord.js');

module.exports = {
    name: 'mood',
    cooldown: 5,
    description: 'My current mood',
    usage: '',
    id: 2,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        if (message.channel.type != 'dm')
            if (!message.channel.memberPermissions(message.guild.client.user).has('SEND_MESSAGES'))
                return message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!`)

        let MoodNumber = Math.floor(Math.random() * Math.floor(5)),
            Mood;

        switch (MoodNumber) {
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