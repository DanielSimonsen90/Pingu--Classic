const { GuildMember, Client } = require("discord.js");

module.exports = {
    name: 'events: guildMemberUpdate',
    /**@param {Client} client
     @param {{preMember: GuildMember, member: GuildMember}}*/
    execute(client, { preMember, member }) {

    }
}