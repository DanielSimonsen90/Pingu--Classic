const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('emojiUpdate',
    async function setContent(preEmote, emote) {
        return preEmote.name != emote.name ?
            module.exports.content = new MessageEmbed()
                .setDescription(PinguEvent.SetDescriptionValues('Name', preEmote.name, emote.name)) : null;
    }
);