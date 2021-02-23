const { Client, GuildMember, Collection, Guild } = require("discord.js");
const { PinguEvent } = require('PinguPackage');

module.exports = new PinguEvent('guildMembersChunk');