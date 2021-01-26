const { Client, DMChannel, GuildChannel, MessageEmbed } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: channelDelete',
    /**@param {{channel: DMChannel | GuildChannel}}*/
    async setContent({ channel }) {
        if (!channel.guild) return module.exports.content = new MessageEmbed().setDescription(`${channel} was deleted.`);

        let audits = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE' });
        let { executor } = audits.entries.first();

        return module.exports.content = new MessageEmbed().setDescription(`${channel} was deleted by ${executor}`)
    },
    /**@param {Client} client
     @param {{channel: DMChannel | GuildChannel}}*/
    execute(client, { channel }) {

    }
}