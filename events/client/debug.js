const { Client } = require("discord.js");
const { PinguLibrary, PinguUser } = require("PinguPackage");

module.exports = {
    name: 'events: debug',
    /**@param {Client} client
     @param {{ value: string }}*/
    execute(client, { value }) {
        PinguLibrary.consoleLog(client, "**Debug:**\n```" + `${value}\n` + "```");
    }
}