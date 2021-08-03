const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('invalidated', null,
    async function execute(client) {
        return client.log('error', 'Invalidated called')
    }
);