const { MessageEmbed } = require("discord.js");
const { PinguLibrary, PinguEvent, EmbedField } = require("PinguPackage");

module.exports = new PinguEvent('webhookUpdate',
    async function setContent(channel) {
        if (PinguLibrary.PermissionCheck({
            client: channel.client,
            channel,
            author: channel.client.user
        }, 'MANAGE_WEBHOOKS') != PinguLibrary.PermissionGranted) return null;

        let webhook = (await channel.fetchWebhooks()).last();
        if (!webhook) return;
        if (!webhook.name) {
            let audits = await channel.guild.fetchAuditLogs({ type: 'WEBHOOK_DELETE' });
            let { executor } = audits.entries.last();
            return module.exports.content = new MessageEmbed().setDescription(`Webhook deleted by ${executor}`);
        }

        return module.exports.content = new MessageEmbed()
            .addFields([
                new EmbedField(`Name`, webhook.name, true),
                new EmbedField(`Owner`, webhook.owner, true),
                new EmbedField(`Token`, webhook.token, true),
                new EmbedField(`Channel ID`, webhook.channelID, true),
                new EmbedField(`Type`, webhook.type, true)
            ])
            .setURL(webhook.url);
    }
);