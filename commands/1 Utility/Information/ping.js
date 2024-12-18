const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('ping', 'Utility', 'Tells you how much I lag', null,
    async ({ client, message }) => {
        let sent = await message.channel.send(`Calculating...`);
        let latency = sent.createdTimestamp - message.createdTimestamp;
        PinguLibrary.consoleLog(client, `Ping: ${latency}ms`);

        sent.edit(
            `My latency: ${latency}ms\n` +
            `Discord API latency: ${client.ws.ping}ms`
        );
        return sent;
    }
);