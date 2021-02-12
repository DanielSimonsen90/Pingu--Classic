const { Client } = require("discord.js");
const { PinguLibrary, PinguUser } = require("PinguPackage");

module.exports = {
    name: 'events: invalidated',
    /**@param {Client} client
     @param {{}}*/
    execute(client, {}) {
        PinguLibrary.errorLog(client, `Invalidated called`);
    }
}