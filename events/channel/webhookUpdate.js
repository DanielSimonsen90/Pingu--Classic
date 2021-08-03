const { MessageEmbed } = require("discord.js");
const { PinguEvent, EmbedField } = require("PinguPackage");

module.exports = new PinguEvent('webhookUpdate',
    async function setContent(client, channel) {
        if (client.permissions.checkFor({
            channel,
            author: channel.client.user
        }, 'MANAGE_WEBHOOKS') != client.permissions.PermissionGranted) return null;

        let webhook = (await channel.fetchWebhooks()).last();
        if (!webhook) return;
        if (!webhook.name) {
            let audits = await channel.guild.fetchAuditLogs({ type: 'WEBHOOK_DELETE' });
            let { executor } = audits.entries.last();
            return module.exports.content = new MessageEmbed({ description: `Webhook deleted by ${executor}` })
        }

        return module.exports.content = new MessageEmbed({
            fields: [
                new EmbedField(`Name`, webhook.name, true),
                new EmbedField(`Owner`, webhook.owner, true),
                new EmbedField(`Token`, webhook.token, true),
                new EmbedField(`Channel ID`, webhook.channelID, true),
                new EmbedField(`Type`, webhook.type, true)
            ],
            url: webhook.url
        })
    }
);