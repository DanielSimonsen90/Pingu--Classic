const { Client, Guild, MessageEmbed } = require("discord.js");
const { PinguLibrary, PinguUser } = require("PinguPackage");

module.exports = {
    name: 'events: guildUnavailable',
    /**@param {{guild: Guild}}*/
    setContent({ guild, Guild }) {
        return module.exports.content = new MessageEmbed().setDescription(`**${guild.name}** is now unavailable.`);
    },
    /**@param {Client} client
     @param {{guild: Guild}}*/
    execute(client, { guild: Guild }) {

    }
}