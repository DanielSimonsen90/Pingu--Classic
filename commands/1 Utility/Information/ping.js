const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('ping', 'Utility', 'Tells you how much I lag', null,
    async ({ message }) => {
        let sent = await message.channel.send(`Calculating...`);
        let latency = sent.createdTimestamp - message.createdTimestamp;
        PinguLibrary.consoleLog(message.client, `Ping: ${latency}ms`);

        sent.edit(
            `My latency: ${latency}ms\n` +
            `Discord API latency: ${message.client.ws.ping}ms`
        );
    }
);