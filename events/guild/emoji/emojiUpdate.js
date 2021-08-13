const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('emojiUpdate',
    async function setContent(client, embed, previous, current) {
        return previous.name != current.name ?
            module.exports.content = embed.setDescription(PinguEvent.SetDescriptionValues('Name', previous.name, current.name)) : 
            null;
    }
);