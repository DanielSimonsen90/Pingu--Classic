const { Client } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: error',
    /**@param {Client} client
     @param {{err: Error}}*/
    execute(client, { err }) {
        PinguLibrary.errorLog(client, `Client event`, null, err);
    }
}