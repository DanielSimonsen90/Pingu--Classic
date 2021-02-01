const { Client, TextChannel, MessageEmbed } = require("discord.js");
const { PinguLibrary, PinguUser, DiscordPermissions } = require("../../PinguPackage");

module.exports = {
    name: 'events: webhookUpdate',
    /**@param {{channel: TextChannel}}*/
    async setContent({ channel }) {
        if (PinguLibrary.PermissionCheck({
            client: channel.client,
            channel,
            author: channel.client.user,
            content: null
        }, [DiscordPermissions.MANAGE_WEBHOOKS]) != PinguLibrary.PermissionGranted) return null;

        let webhook = (await channel.fetchWebhooks()).last();
        if (!webhook) return;
        if (!webhook.name) {
            let audits = await channel.guild.fetchAuditLogs({ type: 'WEBHOOK_DELETE' });
            let { executor } = audits.entries.last();
            return module.exports.content = new MessageEmbed().setDescription(`Webhook deleted by ${executor}`);
        }

        return module.exports.content = new MessageEmbed()
            .addField(`Name`, webhook.name, true)
            .addField(`Owner`, webhook.owner, true)
            .addField(`Token`, webhook.token, true)
            .addField(`Channel ID`, webhook.channelID, true)
            .addField(`Type`, webhook.type, true)
            .setURL(webhook.url);
    },
    /**@param {Client} client
     @param {{channel: TextChannel}}*/
    execute(client, { channel }) {

    }
}