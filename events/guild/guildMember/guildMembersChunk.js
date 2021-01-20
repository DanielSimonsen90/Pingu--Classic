const { Client, GuildMember, Collection, Guild } = require("discord.js");

module.exports = {
    name: 'events: guildMembersChunk',
    /**@param {Client} client
     @param {{members: Collection<string, GuildMember>, guild: Guild, collectionInfo: { count: number, index: number, nonce: string }}}*/
    execute(client, { members, guild, collectionInfo }) {

    }
}