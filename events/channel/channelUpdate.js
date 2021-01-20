const { Client, DMChannel, GuildChannel } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: channelUpdate',
    /**@param {Client} client
     * @param {{preChannel: DMChannel | GuildChannel, channel: DMChannel | GuildChannel}}*/
    execute(client, { preChannel, channel }) {

    }
}