const { Client } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: rateLimit',
    /**@param {Client} client
     @param {{info: import("discord.js").RateLimitData}}*/
    execute(client, { info }) {
        PinguLibrary.errorLog(client, `I'm being ratelimited by **${info.limit}**, which is costing me ${info.timeDifference}`);
    }
}