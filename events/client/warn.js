const { Client } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: warn',
    /**@param {Client} client
     @param {{warning: string}}*/
    execute(client, { warning }) {
        PinguLibrary.consoleLog(client, "**Warning:**\n```" + `${warning}\n` + "```");
    }
}