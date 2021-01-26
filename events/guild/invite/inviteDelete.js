const { Client, Invite, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'events: inviteDelete',
    /**@param {{invite: Invite}}*/
    async setContent({ invite }) {
        let auditLogs = await invite.guild.fetchAuditLogs({ type: 'INVITE_DELETE' });
        let { executor } = auditLogs.entries.first();

        return module.exports.content = new MessageEmbed().setDescription(`Invite link, ${invite.code}, was deleted by ${executor}`);
    },
    /**@param {Client} client
     @param {{invite: Invite}}*/
    execute(client, { invite }) {

    }
}