const { Client, Message } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: messageUpdate',
    /**@param {Client} client
     @param {{preMessage: Message, message: Message}}*/
    execute(client, { preMessage, message }) {

    }
}