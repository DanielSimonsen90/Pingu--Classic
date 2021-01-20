const { Client, GuildMember, Speaking } = require("discord.js");

module.exports = {
    name: 'events: guildMemberSpeaking',
    /**@param {Client} client
     @param {{member: GuildMember, speakingState: Readonly<Speaking>}}*/
    execute(client, { member, speakingState }) {

    }
}