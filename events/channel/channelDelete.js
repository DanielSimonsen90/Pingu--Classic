const { Client, DMChannel, GuildChannel } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: channelDelete',
    /**@param {Client} client
     @param {{channel: DMChannel | GuildChannel}}*/
    execute(client, { channel }) {

    }
}