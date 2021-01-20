const { Client } = require("discord.js");

module.exports = {
    name: 'events: shardDisconnect',
    /**@param {Client} client
     @param {{id: number, closeEvent: CloseEvent}}*/
    execute(client, { id, closeEvent }) {

    }
}