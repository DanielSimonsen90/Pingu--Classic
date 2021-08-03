const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('error', null,
    async function execute(client, err) {
        return client.log('error', `Error event`, null, err);
    }
);