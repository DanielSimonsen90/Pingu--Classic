const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('ping', 'Utility', 'Tells you how much I lag', null,
    async ({ client, message }) => {
        let sent = await message.channel.send(`Calculating...`);
        let latency = sent.createdTimestamp - message.createdTimestamp;
        client.log('console', `Ping: ${latency}ms`);

        sent.edit(
            `My latency: ${latency}ms\n` +
            `Discord API latency: ${client.ws.ping}ms`
        );
        return sent;
    }
);