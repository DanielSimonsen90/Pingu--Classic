const { Client, User, Channel } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: typingStart',
    /**@param {Client} client
     @param {{channel: Channel | import("discord.js").PartialDMChannel, user: User}}*/
    execute(client, { channel, user }) {

    }
}