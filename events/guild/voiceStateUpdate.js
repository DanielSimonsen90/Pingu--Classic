const { Client, VoiceState } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: voiceStateUpdate',
    /**@param {Client} client
     @param {{preState: VoiceState, state: VoiceState}}*/
    execute(client, { preState, state }) {

    }
}