const { Client, Guild, User } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: guildBanRemove',
    /**@param {Client} client
     @param {{guild: Guild, user: User}}*/
    execute(client, { guild, user }) {

    }
}