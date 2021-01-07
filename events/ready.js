const { Client } = require("discord.js");
const { PinguLibrary } = require("../PinguPackage");
const { announceOutages } = require('../config');

module.exports = {
    name: 'events: ready',
    /**@param {Client} client*/
    execute(client) {
        if (announceOutages) PinguLibrary.outages(client, `\nI'm back online!\n`);
        console.log(`\nI'm back online!\n`);
        PinguLibrary.setActivity(client);
    }
}