const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('warn', null,
    async function execute(client, warning) {
        return client.log('error', "**Warning:**\n```" + `${warning}\n` + "```")
    }
);