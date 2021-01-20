const { Client, Presence } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: presenceUpdate',
    /**@param {Client} client
     @param {{prePresence: Presence, presence: Presence}}*/
    execute(client, { prePresence, presence }) {

    }
}