const { Client, Guild, MessageEmbed } = require("discord.js");
const { PinguLibrary, PinguUser } = require("PinguPackage");

module.exports = {
    name: 'events: guildIntegrationsUpdated',
    /**@param {{guild: Guild}}*/
    setContent({ guild }) {
        return module.exports.content = new MessageEmbed().setDescription(`Integration Updated`);
    },
    /**@param {Client} client
     @param {{guild: Guild}}*/
    execute(client, { guild }) {

    }
}