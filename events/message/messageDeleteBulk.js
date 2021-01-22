const { Client, Message, Collection, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'events: messageDeleteBulk',
    /**@param {{messages: Collection<string, Message | import("discord.js").PartialMessage>}}*/
    setContent({ messages }) {
        return module.exports.content = new MessageEmbed().setDescription(`Deleted ${messages.size} messages from ${messages.first().channel}`);
    },
    /**@param {Client} client
     @param {{messages: Collection<string, Message | import("discord.js").PartialMessage>}}*/
    execute(client, { messages }) {

    },
}