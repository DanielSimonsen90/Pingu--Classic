const { Client } = require("discord.js");

module.exports = {
    name: 'events: shardReady',
    /**@param {Client} client
     @param {{id: string, deadGuildsIDs: Set<string>}}*/
    execute(client, { id, deadGuildsIDs }) {

    }
}