const { Client, Guild } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: guildUnavailable',
    /**@param {Client} client
     @param {{guild: Guild}}*/
    execute(client, { guild: Guild }) {

    }
}