const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('debug', null,
    async function execute(client, value) {
        return client.log('console', "**Debug:**\n```" + `${value}\n` + "```")
    }
);