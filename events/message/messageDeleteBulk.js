const { Client, Message, Collection } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: messageDeleteBulk',
    /**@param {Client} client
     @param {{messages: Collection<string, Message | import("discord.js").PartialMessage>}}*/
    execute(client, { messages }) {

    }
}