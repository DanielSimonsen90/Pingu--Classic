const { Client, Role, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'events: roleDelete',
    /**@param {{role: Role}}*/
    async setContent({ role }) {
        let auditLogs = await role.guild.fetchAuditLogs({ type: 'ROLE_DELETE' });
        let { executor } = auditLogs.entries.first();

        return module.exports.content = new MessageEmbed().setDescription(`${role.name} was deleted by ${executor}`);
    },
    /**@param {Client} client
     @param {{role: Role}}*/
    execute(client, { role }) {

    }
}